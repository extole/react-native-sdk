import type { Extole } from '../Extole';
import type { Action } from '../Action';
import type { Condition } from '../Condition';
import type { LogLevel } from 'src/LogLevel';
import type { Logger } from '../Logger';
import type { Zone } from '../Zone';
import type { Campaign } from '../Campaign';

export class CampaignImpl implements Campaign {
  campaignId: string;
  programLabel: string;
  extole: Extole;

  constructor(extole: Extole, campaignId: string, programLabel: string) {
    this.campaignId = campaignId;
    this.programLabel = programLabel;
    this.extole = extole;
  }

  public setLogLevel(logLevel: LogLevel): void {
    this.extole.setLogLevel(logLevel);
  }

  public fetchZone(zoneName: string): Promise<[Zone, Campaign]> {
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

  getLogger(): Logger {
    return this.extole.getLogger();
  }

  getCampaignId(): string {
    return this.campaignId;
  }

}
