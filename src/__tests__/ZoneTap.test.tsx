import type { Campaign } from '../Campaign';
import { ZoneImpl } from '../impl/ZoneImpl';

test('zone.tap sends the mobile_cta tap event for native share', () => {
  const sentEvents: Array<{ name: string; data: Record<string, string> }> = [];
  const campaign = {
    getCampaignId: () => 'campaign-123',
    sendEvent: (name: string, data: Record<string, string>) => {
      sentEvents.push({ name, data });
    },
  } as Campaign;

  const zone = new ZoneImpl(campaign, 'mobile_cta', {
    image: 'https://example.com/cta.png',
  });

  zone.tap();

  expect(sentEvents).toEqual([
    {
      name: 'mobile_cta_tap',
      data: { target: 'campaign_id:campaign-123' },
    },
  ]);
});
