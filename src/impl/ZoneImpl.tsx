import type { Campaign } from '../Campaign';
import type { Zone } from '../Zone';

export class ZoneImpl implements Zone {
  name: string;
  data: Record<string, any>;
  campaign: Campaign;

  constructor(campaign: Campaign, name: string, data: Record<string, any>) {
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

  public getData(): Record<string, any> {
    return this.data;
  }

  public getName(): string {
    return this.name;
  }
}
