import { ExtoleNative } from '../impl/ExtoleNative';
import type { Action, AppEvent, Condition } from '../';
import { LogLevel } from '../LogLevel';
import { ExtoleInternalImpl } from '../impl/ExtoleInternalImpl';
import type { Extole } from '../Extole';

let logLevel = LogLevel.ERROR
test('custom action and conditions work with map', async () => {
  const extole = new ExtoleInternalImpl('https://mobile-monitor.extole.io',
    'react-native-test',
    'production-test',
    [],
    {},
    {},
    {},
    new MockNativeLayer());

  extole.registerAction('REACT_ACTION', CustomReactAction.prototype);
  extole.registerCondition('REACT_CONDITION', CustomReactCondition.prototype);

  expect(extole.customActions['REACT_ACTION']).toBeDefined();
  expect(extole.customConditions['REACT_CONDITION']).toBeDefined();
  expect(logLevel).toEqual(LogLevel.ERROR);

  await extole.sendEvent('name', {});

  expect(logLevel).toEqual(LogLevel.DEBUG);
});

class MockNativeLayer extends ExtoleNative {
  programDomain = '';
  appName = 'react-native';
  sandbox = 'production-production';
  labels: [] = [];
  data: Record<string, string> = {};
  appData: Record<string, string> = {};
  appHeaders: Record<string, string> = {};

  public init(programDomain: string, appName: string, sandbox: string, labels: [] = [],
              data: Record<string, string> = {}, appData: Record<string, string> = {}, appHeaders: Record<string, string> = {}) {
    this.programDomain = programDomain;
    this.appName = appName;
    this.sandbox = sandbox;
    this.labels = labels;
    this.data = data;
    this.appData = appData;
    this.appHeaders = appHeaders;
  }


  fetchZone(zoneName: string, data: Record<string, string>): any {
    return zoneName + ' ' + data;
  }

  sendEvent(eventName: string, params: Record<string, string>): any {
    return eventName + ' ' + params;
  }

  getJsonConfiguration(): Promise<string | Record<string, string>> {
    return Promise.resolve('[{' +
      '  "conditions": [' +
      '    {' +
      '      "type": "REACT_CONDITION",' +
      '       "data": {' +
      '          "event_name": "name"' +
      '      }' +
      '    }' +
      '  ],' +
      '  "actions": [' +
      '    {' +
      '      "type": "REACT_ACTION",' +
      '      "data": {' +
      '          "custom_key": "custom_value"' +
      '      }' +
      '    }' +
      '  ]' +
      '}]');
  }
}

class CustomReactAction implements Action {
  type = 'CUSTOM';
  title = 'REACT_ACTION';

  execute(_event: AppEvent, _extole: Extole) {
    console.log('Custom Action was executed', this);
    logLevel = LogLevel.DEBUG
  }
}

class CustomReactCondition implements Condition {
  type = 'CUSTOM';
  title = 'REACT_CONDITION';
  data: Record<string, string> = {};

  test(event: AppEvent, _: Extole): boolean {
    console.log('React Condition was executed', event);
    return this.data['event_name'] == 'name';
  }
}
