import type { Zone } from '../Zone';
import type { Campaign } from '../Campaign';
import { View } from 'react-native';
import type { Condition } from '../Condition';
import type { Action } from '../Action';
import type { AppEvent } from './AppEvent';
import type { Operation } from './Operation';
import React, { Component } from 'react';
import type { ExtoleInternal } from './ExtoleInternal';
import { ExtoleNative } from './ExtoleNative';
import { LogLevel } from '../LogLevel';
import type { Logger } from 'src/Logger';
import { LoggerImpl } from './LoggerImpl';
import { ZoneImpl } from './ZoneImpl';
import { CampaignImpl } from './CampaignImpl';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { Linking, Share, Dimensions } from 'react-native';


export class ExtoleInternalImpl implements ExtoleInternal {
  programDomain: string;
  customConditions: Record<string, Partial<Condition>> = {};
  customActions: Record<string, Partial<Action>> = {};
  extoleView: React.ReactNode = (<View></View>);
  logLevel: LogLevel = LogLevel.ERROR;
  navigationCallback: () => void = () => {
    // no default behavior
  };
  viewHandler: (value: ((previousState: React.ReactNode) => React.ReactNode) | React.ReactNode) => void =
    () => {
      // no default behavior
    };
  view: React.ReactNode = new Component({});
  extoleNative: ExtoleNative;


  constructor(
    programDomain: string,
    extoleNative: ExtoleNative = new ExtoleNative()) {
    this.extoleNative = extoleNative;
    this.customConditions = {};
    this.customActions = {};
    this.programDomain = programDomain;
  }

  static async create(
    programDomain: string,
    appName = 'react-native',
    sandbox = 'production-production',
    labels: [] = [],
    data: Record<string, string> = {},
    appData: Record<string, string> = {},
    appHeaders: Record<string, string> = {},
    email?: string,
    jwt?: string,
    extoleNative: ExtoleNative = new ExtoleNative()
  ): Promise<ExtoleInternalImpl> {
    try {
      await extoleNative.init(
        programDomain,
        appName,
        sandbox,
        labels,
        data,
        appData,
        appHeaders,
        email,
        jwt
      );

      return new ExtoleInternalImpl(programDomain, extoleNative);
    } catch (error) {
      console.error('Failed to initialize Extole:', error);
      throw error;
    }
  }

  getLogger(): Logger {
    return new LoggerImpl(this.extoleNative);
  }

  public identify(email: string, params: Record<string, string>): string {
    return this.extoleNative.identify(email, params);
  }

  public identifyJwt(jwt: string, params: Record<string, string>): string {
    return this.extoleNative.identifyJwt(jwt, params);
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
  ): Promise<[Zone, Campaign]> => {
    return this.extoleNative.fetchZone(zoneName, data).then((result: string) => {
      const resultData = this.toJson(result);
      const campaign = new CampaignImpl(this, resultData.campaign_id,
        resultData.program_label);
      return [new ZoneImpl(campaign, zoneName,
        this.toJson(resultData.zone)), campaign];
    });
  };

  public webView(zoneName: string, queryParameters: {}, configuration:{width: string | number, height: string | number} | undefined = undefined): Element {

    const injectedJavaScriptBeforeContentLoaded = `
      if (navigator.share == null) {
        navigator.share = (param) => {
           window.ReactNativeWebView.postMessage('share:' + JSON.stringify(param));
        };
      };
      if (window.extoleShare === undefined) {
        window.extoleShare = {}
        window.extoleShare.share = (param) => {
           window.ReactNativeWebView.postMessage('share:' + JSON.stringify(param));
        };
      };
      true;`;

      const buildUrl = (url: string, params: any): string => {
        const newUrl = new URL(url);
        Object.keys(params).forEach(key => newUrl.searchParams.append(key, params[key]));
        return newUrl.toString();
    }

    interface WebShareAPIParam {
        url?: string;
        text?: string;
        title?: string;
    }

    var allQueryParameter = {...queryParameters}
    var urlToOpen = buildUrl("https://" + this.programDomain + "/zone/" + zoneName, allQueryParameter)

    return (<WebView
      scrollEnabled={true}
      style={{ height: configuration?.height ?? 200, width: configuration?.width ?? Dimensions.get('window').width, backgroundColor: 'red' }}
      startInLoadingState={true}
      injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
      originWhitelist={['http://*', 'https://*', 'sms:*', 'tel:*', 'mailto:*']}
      onShouldStartLoadWithRequest={(request) => {
          if (request.url.startsWith('blob')) {
              console.error('Link cannot be opened.');
              return false;
          }

          if (request.url.startsWith('tel:') ||
              request.url.startsWith('mailto:') ||
              request.url.startsWith('sms:')
          ) {
              Linking.openURL(request.url).catch(error => {
                  console.error('Failed to open Link: ' + error.message);
              });
              return false;
          }
          return true;
      }}
      onLoadEnd={() => {

      }}
      onMessage={async (event: WebViewMessageEvent) => {
          const { data } = event.nativeEvent;
          if (data.startsWith('share:')) {
              try {
                  const param: WebShareAPIParam = JSON.parse(JSON.parse(data.slice('share:'.length)));
                  if (param.url == null && param.text == null) {
                      return;
                  }

                  await Share.share(
                      {
                          title: param.title,
                          message: param.text,
                          url: param.url ?? '',
                      },
                      {
                          dialogTitle: param.title,
                          subject: param.title,
                      },
                  );
              } catch (error: unknown) {
                  console.error('WebView error', error);
              }
          }
      }}
      source={{
          uri: urlToOpen,
      }}
  />);
  }

  public configure(
    extoleView: React.ReactNode,
    setExtoleView: (value: ((prevState: React.ReactNode) => React.ReactNode) | React.ReactNode) => void,
    navigationCallback: () => void,
  ) {
    this.view = extoleView;
    this.viewHandler = setExtoleView;
    this.navigationCallback = navigationCallback;
  }

  public sendEvent = (eventName: string, params: Record<string, string>) => {
    this.evaluateOperations({ name: eventName, params: params });
    return this.extoleNative.sendEvent(eventName, params);
  };

  public registerCondition = (title: string, condition: Condition) => {
    this.customConditions[title] = condition;
  };

  public registerAction = (title: string, action: Action) => {
    this.customActions[title] = action;
  };

  public getLogLevel(): LogLevel {
    return this.logLevel;
  }

  public getAccessToken(): string {
    return  this.extoleNative.getAccessToken();
  }

  public logout(): void {
    this.extoleNative.logout();
  }

  private evaluateOperations = (event: AppEvent) => {
    this.extoleNative.getJsonConfiguration().then(
      (jsonOperations: string | Record<string, string>) => {
        const operations: Operation[] = this.toJson(jsonOperations);
        const actionsToExecute = operations
          .filter(this.checkConditionTypeExists())
          .filter(this.filterPassingConditions(event))
          .flatMap((operation) => operation.actions);

        this.executeActions(actionsToExecute, event);
      },
    );
  };

  private checkConditionTypeExists() {
    return (operation: Operation) => {
      return (
        operation.conditions.filter((condition: Condition) => {
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
