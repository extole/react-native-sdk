import {
  buildZoneUrl,
  forceLightColorSchemeScript,
  zoneWebViewScript,
} from '../impl/ZoneWebView';

test('buildZoneUrl returns the zone path without a trailing slash', () => {
  expect(buildZoneUrl('mobile-monitor.extole.io', 'microsite')).toBe(
    'https://mobile-monitor.extole.io/zone/microsite'
  );
});

test('buildZoneUrl encodes query parameters', () => {
  expect(
    buildZoneUrl('mobile-monitor.extole.io', 'microsite', {
      email: 'demoemail@mailosaur.com',
    })
  ).toBe(
    'https://mobile-monitor.extole.io/zone/microsite?email=demoemail%40mailosaur.com'
  );
});

test('forceLightColorSchemeScript keeps the page visible in dark mode', () => {
  expect(forceLightColorSchemeScript).toContain('prefers-color-scheme: dark');
  expect(forceLightColorSchemeScript).toContain('display: block !important');
  expect(forceLightColorSchemeScript).toContain(
    "getElementById('extole-force-light')"
  );
});

test('zoneWebViewScript polyfills share on top of the light override', () => {
  expect(zoneWebViewScript).toContain(forceLightColorSchemeScript);
  expect(zoneWebViewScript).toContain('navigator.share');
  expect(zoneWebViewScript).toContain('extoleShare.share');
});
