import type { FetchResult } from './impl/FetchResult';
import type { Condition } from './impl/Condition';
import type { Action } from './impl/Action';

export interface Extole {
  getProgramDomain: () => string;

  fetchZone: (
    zoneName: string,
    data: Record<string, string>
  ) => Promise<FetchResult>;

  identify: (email: string, params: Record<string, string>) => string;

  sendEvent: (eventName: string, params: Record<string, string>) => string;

  registerCondition: (title: string, condition: Condition) => void;

  registerAction: (title: string, action: Action) => void;

  setViewElement: (view: Element) => void;
}
