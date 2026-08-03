import WebView, { WebViewMessageEvent } from 'react-native-webview';
import type { Action } from '../Action';
import type { AppEvent } from './AppEvent';
import type { ExtoleInternal } from './ExtoleInternal';
import { Dimensions, Linking } from 'react-native';
import React from 'react';
import {
  isNativeShareMessage,
  nativeShareScript,
  openNativeShareSheet,
} from '../NativeShare';


export class ViewFullScreenAction implements Action {
  type = 'VIEW_FULLSCREEN';
  title = 'VIEW_FULLSCREEN';

  zone_name = '';
  data: Record<string, string> = {};

  async execute(event: AppEvent, extole: ExtoleInternal) {
    const zoneUrl = new URL(
      'https://' + extole.getProgramDomain() + '/zone/' + this.zone_name,
    );
    const accessToken = await extole.getAccessToken();
    const headers = {
      'Authorization': 'Bearer ' + accessToken,
    };
    for (const key in event.params) {
      zoneUrl.searchParams.append(
        encodeURIComponent(key),
        encodeURIComponent(event.params[key] as string),
      );
    }

    extole.setViewElement(
      <WebView
        scrollEnabled={true}
        startInLoadingState={true}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: 'transparent'
        }}
        injectedJavaScriptBeforeContentLoaded={nativeShareScript}
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
        onMessage={async (event: WebViewMessageEvent) => {
          const { data } = event.nativeEvent;
          if (isNativeShareMessage(data)) {
            try {
              await openNativeShareSheet(data);
            } catch (error: unknown) {
              console.error('WebView error', error);
            }
          }
        }}
        source={{
          uri: zoneUrl.href,
          headers: headers,
        }}
      />,
    );
    extole.navigationCallback();
  }
}
