import { Share } from 'react-native';
import { isNativeShareMessage, openNativeShareSheet } from '../NativeShare';

const SHARE_LINK = 'https://refer.example.com/abc123';
const SHARE_TITLE = 'Refer a friend';

let shareSpy: jest.SpyInstance;

beforeEach(() => {
  shareSpy = jest
    .spyOn(Share, 'share')
    .mockResolvedValue({ action: Share.sharedAction });
});

afterEach(() => {
  shareSpy.mockRestore();
});

const buildExtoleShareMessage = (
  shareRequest: Record<string, string>
): string => 'share:' + JSON.stringify(JSON.stringify(shareRequest));

const buildNavigatorShareMessage = (
  shareRequest: Record<string, string>
): string => 'share:' + JSON.stringify(shareRequest);

test('recognizes share messages and ignores every other web view message', () => {
  expect(isNativeShareMessage(buildExtoleShareMessage({}))).toBe(true);
  expect(isNativeShareMessage('extoleLogout')).toBe(false);
});

test('shares the text with the link appended and without a separate url', async () => {
  await openNativeShareSheet(
    buildExtoleShareMessage({
      url: SHARE_LINK,
      text: 'Get $10',
      title: SHARE_TITLE,
    })
  );

  expect(shareSpy).toHaveBeenCalledWith(
    { title: SHARE_TITLE, message: 'Get $10 ' + SHARE_LINK },
    { dialogTitle: SHARE_TITLE, subject: SHARE_TITLE }
  );
});

test('shares the link once when the text already contains it', async () => {
  await openNativeShareSheet(
    buildExtoleShareMessage({
      url: SHARE_LINK,
      text: 'Get $10 ' + SHARE_LINK,
      title: SHARE_TITLE,
    })
  );

  expect(shareSpy).toHaveBeenCalledWith(
    { title: SHARE_TITLE, message: 'Get $10 ' + SHARE_LINK },
    { dialogTitle: SHARE_TITLE, subject: SHARE_TITLE }
  );
});

test('shares the link once when the request carries a blank url', async () => {
  await openNativeShareSheet(
    buildExtoleShareMessage({
      url: ' ',
      text: 'Get $10 ' + SHARE_LINK,
      title: SHARE_TITLE,
    })
  );

  expect(shareSpy).toHaveBeenCalledWith(
    { title: SHARE_TITLE, message: 'Get $10 ' + SHARE_LINK },
    { dialogTitle: SHARE_TITLE, subject: SHARE_TITLE }
  );
});

test('shares the link alone when the request carries no text', async () => {
  await openNativeShareSheet(buildExtoleShareMessage({ url: SHARE_LINK }));

  expect(shareSpy).toHaveBeenCalledWith(
    { title: undefined, message: SHARE_LINK },
    { dialogTitle: undefined, subject: undefined }
  );
});

test('shares a request sent through navigator.share', async () => {
  await openNativeShareSheet(
    buildNavigatorShareMessage({
      url: SHARE_LINK,
      text: 'Get $10',
      title: SHARE_TITLE,
    })
  );

  expect(shareSpy).toHaveBeenCalledWith(
    { title: SHARE_TITLE, message: 'Get $10 ' + SHARE_LINK },
    { dialogTitle: SHARE_TITLE, subject: SHARE_TITLE }
  );
});

test('does not open the share sheet when there is nothing to share', async () => {
  await openNativeShareSheet(buildExtoleShareMessage({}));

  expect(shareSpy).not.toHaveBeenCalled();
});
