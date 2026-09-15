import type { Action } from '../Action';
import type { AppEvent } from './AppEvent';
import type { ExtoleInternal } from './ExtoleInternal';
import React from 'react';
import { ZoneWebView } from './ZoneWebView';

export class ViewFullScreenAction implements Action {
  type = 'VIEW_FULLSCREEN';
  title = 'VIEW_FULLSCREEN';

  zone_name = '';
  data: Record<string, string> = {};

  async execute(event: AppEvent, extole: ExtoleInternal) {
    const accessToken = await extole.getAccessToken();

    extole.setViewElement(
      <ZoneWebView
        programDomain={extole.getProgramDomain()}
        zoneName={this.zone_name}
        queryParameters={event.params}
        accessToken={accessToken}
        width='100%'
        height='100%'
      />,
    );
    extole.navigationCallback();
  }
}
