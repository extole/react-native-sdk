import { NativeModules, Platform } from 'react-native';

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

export class ExtoleNative {
  public init(programDomain: string,
              appName = 'react-native',
              sandbox = 'production-production',
              labels: [] = [],
              data: Record<string, string> = {},
              appData: Record<string, string> = {},
              appHeaders: Record<string, string> = {},
              email: string | undefined = undefined,
              jwt: string | undefined = undefined): Promise<void> {
      return ExtoleMobileSdk.init(programDomain, {
        appName: appName,
        sandbox: sandbox,
        labels: labels,
        data: data,
        appData: appData,
        appHeaders: appHeaders,
        email: email,
        jwt: jwt,
      }).catch((error: any) => {
        console.error('Failed to initialize Extole:', error);
        throw error;
      });
  }

  public debug(message: string) {
    ExtoleMobileSdk.debug(message);
  }

  public info(message: string) {
    ExtoleMobileSdk.info(message);
  }

  public warn(message: string) {
    ExtoleMobileSdk.warn(message);
  }

  public error(message: string) {
    ExtoleMobileSdk.error(message);
  }

  public fetchZone(zoneName: string, data: Record<string, string>) {
    return ExtoleMobileSdk.fetchZone(zoneName, data);
  }

  public sendEvent(eventName: string, params: Record<string, string>) {
    return ExtoleMobileSdk.sendEvent(eventName, params);
  }

  public identify(email: string, params: Record<string, string>) {
    return ExtoleMobileSdk.identify(email, params);
  }

  public identifyJwt(jwt: string, params: Record<string, string>) {
    return ExtoleMobileSdk.identifyJwt(jwt, params);
  }

  public getAccessToken() {
    return ExtoleMobileSdk.getAccessToken();
  }
  public logout() {
    return ExtoleMobileSdk.logout();
  }

  public getJsonConfiguration(): Promise<string | Record<string, string>> {
    return ExtoleMobileSdk.getJsonConfiguration();
  }
}
