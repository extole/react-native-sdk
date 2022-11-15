import type { Campaign } from './Campaign';
import type { Zone } from './Zone';

export class FetchResult {
  zone: Zone;
  campaign: Campaign;

  constructor(zone: Zone, campaign: Campaign) {
    this.zone = zone;
    this.campaign = campaign;
  }
}
