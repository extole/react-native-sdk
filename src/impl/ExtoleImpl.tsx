import { PromptAction } from './PromptAction';
import { ViewFullScreenAction } from './ViewFullScreenAction';
import { EventCondition } from './EventCondition';
import { FetchResult } from './FetchResult';
import { Zone } from './Zone';
import { Campaign } from './Campaign';
import { NativeModules, Platform, View } from 'react-native';
import type { Condition } from './Condition';
import type { Action } from './Action';
import type { AppEvent } from './AppEvent';
import type { Operation } from './Operation';
import React, { Component } from 'react';
import type { Extole } from '../Extole';

const LINKING_ERROR =
  `The package 'extole-mobile-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({
    ios: '- You have run \'pod install\'\n',
    android: '- You have to run gradlew build',
    default: '',
  }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const ExtoleMobileSdk = NativeModules.ExtoleMobileSdk
  ? NativeModules.ExtoleMobileSdk
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    },
  );

export class ExtoleImpl implements Extole {
  programDomain: string;
  customConditions: Record<string, Partial<Condition>> = {};
  customActions: Record<string, Partial<Action>> = {};
  extoleView: Element = (<View></View>);
  navigationCallback: () => void = () => {
    // no default behavior
  };
  viewHandler: (value: ((prevState: Element) => Element) | Element) => void =
    () => {
      // no default behavior
    };
  view: Element = new Component({});

  constructor(
    programDomain: string,
    appName = 'react-native',
    sandbox = 'production-production',
    labels: [] = [],
    appData: Record<string, string> = {},
    appHeaders: Record<string, string> = {},
  ) {
    console.trace('extole init');
    ExtoleMobileSdk.init(programDomain, {
      appName: appName,
      sandbox: sandbox,
      labels: labels,
      appData: appData,
      appHeaders: appHeaders,
    });
    this.customConditions = {};
    this.customActions = {};
    this.programDomain = programDomain;
    this.registerDefaultActions();
  }

  public identify(email: string, params: Record<string, string>): string {
    params['email'] = email;
    return this.sendEvent('identify', params);
  }

  public getProgramDomain(): string {
    return this.programDomain;
  }

  public setViewElement(view: Element) {
    this.viewHandler(view);
  }

  public fetchZone = (
    zoneName: string,
    data: Record<string, string> = {},
  ): Promise<FetchResult> => {
    return ExtoleMobileSdk.fetchZone(zoneName, data).then((result: string) => {
      const resultData = this.toJson(result);
      return new FetchResult(
        new Zone(zoneName, resultData),
        new Campaign(this, resultData.campaign_id, resultData.program_label),
      );
    });
  };

  public configureUIInteraction(
    extoleView: Element,
    setExtoleView: (value: ((prevState: Element) => Element) | Element) => void,
    navigationCallback: () => void,
  ) {
    this.view = extoleView;
    this.viewHandler = setExtoleView;
    this.navigationCallback = navigationCallback;
  }

  public sendEvent = (eventName: string, params: Record<string, string>) => {
    this.evaluateOperations({ name: eventName, params: params });
    return ExtoleMobileSdk.sendEvent(eventName, params);
  };

  public registerCondition = (title: string, condition: Condition) => {
    this.customConditions[title] = condition;
  };

  public registerAction = (title: string, action: Action) => {
    this.customActions[title] = action;
  };

  private registerDefaultActions() {
    this.customActions.VIEW_FULLSCREEN = ViewFullScreenAction.prototype;
    this.customActions.PROMPT = PromptAction.prototype;
    this.customConditions.EVENT = EventCondition.prototype;
  }

  private evaluateOperations = (event: AppEvent) => {
    ExtoleMobileSdk.getJsonConfiguration().then(
      (jsonOperations: string | Record<string, string>) => {
        const operations: Operation[] = this.toJson(jsonOperations);
        const actionsToExecute = operations
          .filter(this.checkConditionTypeExists())
          .filter(this.filterPassingConditions(event))
          .flatMap((operation) => operation.actions);

        console.trace('Actions to Execute', actionsToExecute);
        this.executeActions(actionsToExecute, event);
      },
    );
  };

  private checkConditionTypeExists() {
    return (operation: Operation) => {
      return (
        operation.conditions.filter((condition: Condition) => {
          console.trace('Checking: ', condition);
          return (
            condition.type in this.customConditions ||
            condition.title in this.customConditions
          );
        }).length > 0
      );
    };
  }

  private toJson(jsonOperations: string | Record<string, string>) {
    return typeof jsonOperations === 'string'
      ? JSON.parse(jsonOperations)
      : jsonOperations;
  }

  private filterPassingConditions(event: AppEvent) {
    return (operation: Operation) => {
      return operation.conditions.every((condition) => {
        const conditionClass =
          this.customConditions[condition.type] !== undefined
            ? this.customConditions[condition.type]
            : this.customConditions[condition.title];
        if (conditionClass) {
          const conditionInstance = Object.assign(
            conditionClass,
            condition,
          );
          return conditionInstance.test(event, this);
        }
        return false;
      });
    };
  }

  private executeActions(actionsToExecute: Action[], event: AppEvent) {
    actionsToExecute.forEach((action) => {
      const actionClass =
        this.customActions[action.type] !== undefined
          ? this.customActions[action.type]
          : this.customActions[action.title];
      if (actionClass) {
        const actionInstance = Object.assign(actionClass, action);
        actionInstance?.execute?.(event, this);
      }
    });
  }
}
