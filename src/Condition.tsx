import type { AppEvent } from './impl/AppEvent';
import type { ExtoleInternal } from './impl/ExtoleInternal';

export interface Condition {
  test: (_event: AppEvent, _extole: ExtoleInternal) => boolean;
  type: string;
  title: string;
}
