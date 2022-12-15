import type { AppEvent } from './impl/AppEvent';
import type { ExtoleInternal } from './impl/ExtoleInternal';

export interface Action {
  execute: (event: AppEvent, extole: ExtoleInternal) => void;
  type: string;
  title: string;
}
