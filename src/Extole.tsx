import type { Condition } from './Condition';
import type { Action } from './Action';
import type { Logger } from './Logger';
import type { Zone } from './Zone';
import type { Campaign } from './Campaign';

export interface Extole {
  getProgramDomain: () => string;

  fetchZone: (
    zoneName: string,
    data: Record<string, string>,
  ) => Promise<[Zone, Campaign]>;

  identify: (email: string, params: Record<string, string>) => string;

  sendEvent: (eventName: string, params: Record<string, string>) => string;

  getLogger: () => Logger;

  logout: () => void;

  registerCondition: (title: string, condition: Condition) => void;

  registerAction: (title: string, action: Action) => void;

  setViewElement: (view: Element) => void;
}
