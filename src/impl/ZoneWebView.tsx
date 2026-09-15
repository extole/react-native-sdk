import React, { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';
import type { DimensionValue } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import {
  isNativeShareMessage,
  nativeShareScript,
  openNativeShareSheet,
} from '../NativeShare';

export interface ZoneWebViewConfiguration {
  width?: string | number;
  height?: string | number;
}

interface ZoneWebViewProps {
  programDomain: string;
  zoneName: string;
  queryParameters?: Record<string, string>;
  accessToken: string;
  width: string | number;
  height: string | number;
}

interface DeferredZoneWebViewProps {
  programDomain: string;
  zoneName: string;
  queryParameters?: Record<string, string>;
  configuration?: ZoneWebViewConfiguration;
  initialization: Promise<void>;
  getAccessToken: () => string | Promise<string>;
}

const FORCE_LIGHT_STYLE_ID = 'extole-force-light';

export const forceLightColorSchemeScript = `
(function () {
  var root = document.head || document.documentElement;
  if (!root || document.getElementById('${FORCE_LIGHT_STYLE_ID}')) {
    return;
  }
  var style = document.createElement('style');
  style.id = '${FORCE_LIGHT_STYLE_ID}';
  style.textContent =
    '@media (prefers-color-scheme: dark) {' +
    'html, body { display: block !important; visibility: visible !important; }' +
    '}';
  root.appendChild(style);
})();
true;`;

export const zoneWebViewScript = `
${forceLightColorSchemeScript}
${nativeShareScript}`;

export const buildZoneUrl = (
  programDomain: string,
  zoneName: string,
  queryParameters: Record<string, string> = {},
): string => {
  const baseUrl = 'https://' + programDomain + '/zone/' + zoneName;
  const query = Object.keys(queryParameters)
    .map(
      (parameterName) =>
        `${encodeURIComponent(parameterName)}=${encodeURIComponent(
          queryParameters[parameterName] ?? '',
        )}`,
    )
    .join('&');
  return query ? `${baseUrl}?${query}` : baseUrl;
};

const toDimension = (size: string | number): DimensionValue =>
  size as DimensionValue;

const handleShouldStartLoadWithRequest = (request: {
  url: string;
}): boolean => {
  if (request.url.startsWith('blob')) {
    console.error('Link cannot be opened.');
    return false;
  }

  if (
    request.url.startsWith('tel:') ||
    request.url.startsWith('mailto:') ||
    request.url.startsWith('sms:')
  ) {
    Linking.openURL(request.url).catch((error: Error) => {
      console.error('Failed to open Link: ' + error.message);
    });
    return false;
  }

  return true;
};

const handleWebViewMessage = async (
  event: WebViewMessageEvent,
): Promise<void> => {
  const { data } = event.nativeEvent;
  if (!isNativeShareMessage(data)) {
    return;
  }

  try {
    await openNativeShareSheet(data);
  } catch (error: unknown) {
    console.error('WebView error', error);
  }
};

export const ZoneWebView: React.FC<ZoneWebViewProps> = ({
  programDomain,
  zoneName,
  queryParameters = {},
  accessToken,
  width,
  height,
}) => {
  const zoneUrl = buildZoneUrl(programDomain, zoneName, queryParameters);
  const headers = accessToken
    ? { Authorization: 'Bearer ' + accessToken }
    : undefined;

  return (
    <WebView
      scrollEnabled={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      forceDarkOn={false}
      style={{
        width: toDimension(width),
        height: toDimension(height),
        backgroundColor: '#ffffff',
      }}
      startInLoadingState={true}
      injectedJavaScriptBeforeContentLoaded={zoneWebViewScript}
      injectedJavaScript={forceLightColorSchemeScript}
      originWhitelist={['http://*', 'https://*', 'sms:*', 'tel:*', 'mailto:*']}
      onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
      onError={(syntheticEvent) => {
        console.error('WebView error', syntheticEvent.nativeEvent);
      }}
      onHttpError={(syntheticEvent) => {
        console.error('WebView HTTP error', syntheticEvent.nativeEvent);
      }}
      onMessage={handleWebViewMessage}
      source={{ uri: zoneUrl, headers }}
    />
  );
};

export const DeferredZoneWebView: React.FC<DeferredZoneWebViewProps> = ({
  programDomain,
  zoneName,
  queryParameters = {},
  configuration,
  initialization,
  getAccessToken,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const width = configuration?.width ?? '100%';
  const height = configuration?.height ?? 200;

  useEffect(() => {
    let isCancelled = false;
    initialization
      .then(() => getAccessToken())
      .then((token) => {
        if (!isCancelled) {
          setAccessToken(typeof token === 'string' ? token : '');
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to prepare zone WebView:', error);
        if (!isCancelled) {
          setAccessToken('');
        }
      });
    return () => {
      isCancelled = true;
    };
  }, [initialization, getAccessToken]);

  if (accessToken == null) {
    return (
      <View
        style={{
          width: toDimension(width),
          height: toDimension(height),
          backgroundColor: '#ffffff',
        }}
      />
    );
  }

  return (
    <ZoneWebView
      programDomain={programDomain}
      zoneName={zoneName}
      queryParameters={queryParameters}
      accessToken={accessToken}
      width={width}
      height={height}
    />
  );
};
