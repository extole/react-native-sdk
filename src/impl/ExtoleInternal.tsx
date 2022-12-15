import type { Extole } from '../Extole';
import type { LogLevel } from '../LogLevel';

export interface ExtoleInternal extends Extole {
  setViewElement: (view: Element) => void;
  navigationCallback: () => void;
  getLogLevel: () => LogLevel;
}
