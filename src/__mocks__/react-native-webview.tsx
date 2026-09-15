import React from 'react';
import { View } from 'react-native';

export type WebViewMessageEvent = {
  nativeEvent: {
    data: string;
  };
};

const WebView = (props: Record<string, unknown>): React.ReactElement => (
  <View {...props} />
);

export default WebView;
