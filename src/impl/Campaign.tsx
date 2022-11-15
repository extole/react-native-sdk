import type { FetchResult } from './FetchResult';
import type { Extole } from '../Extole';
import type { ExtoleImpl } from './ExtoleImpl';
import type { Action, Condition } from 'extole-mobile-sdk';

export class Campaign implements Extole {
  campaignId: string;
  programLabel: string;
  extole: ExtoleImpl;

  constructor(extole: ExtoleImpl, campaignId: string, programLabel: string) {
    this.campaignId = campaignId;
    this.programLabel = programLabel;
    this.extole = extole;
  }

  public fetchZone(zoneName: string): Promise<FetchResult> {
    return this.extole.fetchZone(zoneName, {
      campaign_id: this.campaignId,
      program_label: this.programLabel,
    });
  }

  getProgramDomain(): string {
    return this.extole.getProgramDomain();
  }

  identify(email: string, params: Record<string, string>): string {
    return this.extole.identify(email, params);
  }

  registerAction(title: string, action: Action): void {
    this.extole.registerAction(title, action);
  }

  registerCondition(title: string, condition: Condition): void {
    this.extole.registerCondition(title, condition);
  }

  sendEvent(eventName: string, params: Record<string, string>): string {
    return this.extole.sendEvent(eventName, params);
  }

  setViewElement(view: Element): void {
    this.extole.setViewElement(view);
  }
}
