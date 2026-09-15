import type { Extole } from '../Extole';
import type { LogLevel } from '../LogLevel';
import type { ReactElement } from 'react';

export interface ExtoleInternal extends Extole {
  setViewElement: (view: ReactElement) => void;
  navigationCallback: () => void;
  getLogLevel: () => LogLevel;

  getAccessToken: () => string | Promise<string>;
}
