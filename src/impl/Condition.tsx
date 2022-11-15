import type { AppEvent } from './AppEvent';
import type { Extole } from 'extole-mobile-sdk';

export interface Condition {
  test: (_event: AppEvent, _extole: Extole) => boolean;
  type: string;
  title: string;
}
