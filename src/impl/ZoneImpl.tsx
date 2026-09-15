import type { Campaign } from '../Campaign';
import type { Zone } from '../Zone';

export class ZoneImpl implements Zone {
  name: string;
  data: Record<string, unknown>;
  campaign: Campaign;

  constructor(campaign: Campaign, name: string, data: Record<string, unknown>) {
    this.name = name;
    this.data = data;
    this.campaign = campaign;
  }

  public tap(): void {
    this.campaign.sendEvent(this.name + '_tap',
      { 'target': 'campaign_id:' + this.campaign.getCampaignId() });
  }

  public viewed(): void {
    this.campaign.sendEvent(this.name + '_viewed',
      { 'target': 'campaign_id:' + this.campaign.getCampaignId() });
  }

  public getData(): Record<string, unknown> {
    return this.data;
  }

  public getName(): string {
    return this.name;
  }

  toJSON() {
    return {
      name: this.name,
      data: this.data,
      campaign: this.campaign
    };
  }
}
