import type { AppEvent } from './AppEvent';
import type { Extole } from 'extole-mobile-sdk';

export interface Action {
  execute: (event: AppEvent, extole: Extole) => void;
  type: string;
  title: string;
}
