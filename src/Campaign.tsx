import type { Extole } from './Extole';

export interface Campaign extends Extole {
  getCampaignId: () => string;
}
