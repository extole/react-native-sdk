import WebView from 'react-native-webview';
import type { Action, AppEvent, Extole } from 'extole-mobile-sdk';
import { Dimensions } from 'react-native';
import React from 'react';

export class ViewFullScreenAction implements Action {
  type = 'VIEW_FULLSCREEN';
  title = 'VIEW_FULLSCREEN';

  zone_name = '';
  data: Record<string, string> = {};

  execute(event: AppEvent, extole: Extole) {
    console.trace('ViewFullScreen was executed');
    const zoneUrl = new URL(
      'https://' + extole.getProgramDomain() + '/zone/' + this.zone_name,
    );
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
        }}
        source={{
          uri: zoneUrl.href,
        }}
      />,
    );
    extole.navigationCallback();
  }
}
