import type { Action, AppEvent } from 'extole-mobile-sdk';
import type { Extole } from 'extole-mobile-sdk';

export class CustomReactAction implements Action {
  type = 'CUSTOM';
  title = 'REACT_ACTION';

  execute(_event: AppEvent, _extole: Extole) {
    console.log('Custom Action was executed', this);
  }
}
