import { Share } from 'react-native';

const NATIVE_SHARE_MESSAGE_PREFIX = 'share:';

interface WebShareRequest {
  url?: string;
  text?: string;
  title?: string;
}

export const nativeShareScript = `
      if (navigator.share == null) {
        navigator.share = (shareRequest) => {
           window.ReactNativeWebView.postMessage('${NATIVE_SHARE_MESSAGE_PREFIX}' + JSON.stringify(shareRequest));
        };
      };
      if (window.extoleShare === undefined) {
        window.extoleShare = {}
        window.extoleShare.share = (shareRequest) => {
           window.ReactNativeWebView.postMessage('${NATIVE_SHARE_MESSAGE_PREFIX}' + JSON.stringify(shareRequest));
        };
      };
      true;`;

export const isNativeShareMessage = (webViewMessage: string): boolean =>
  webViewMessage.startsWith(NATIVE_SHARE_MESSAGE_PREFIX);

const parseNativeShareRequest = (webViewMessage: string): WebShareRequest => {
  const shareRequest = JSON.parse(
    webViewMessage.slice(NATIVE_SHARE_MESSAGE_PREFIX.length)
  );

  return typeof shareRequest === 'string'
    ? JSON.parse(shareRequest)
    : shareRequest;
};

const buildNativeShareText = (shareRequest: WebShareRequest): string => {
  const shareMessage = shareRequest.text?.trim() ?? '';
  const shareLink = shareRequest.url?.trim() ?? '';

  if (!shareLink || shareMessage.includes(shareLink)) {
    return shareMessage;
  }

  return shareMessage ? `${shareMessage} ${shareLink}` : shareLink;
};

export const openNativeShareSheet = async (
  webViewMessage: string
): Promise<void> => {
  const shareRequest = parseNativeShareRequest(webViewMessage);
  const shareText = buildNativeShareText(shareRequest);

  if (!shareText) {
    return;
  }

  await Share.share(
    {
      title: shareRequest.title,
      message: shareText,
    },
    {
      dialogTitle: shareRequest.title,
      subject: shareRequest.title,
    }
  );
};
