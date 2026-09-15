import type { ReactElement } from 'react';
import * as React from 'react';

import {
  Button,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { Zone } from '@extole/react-native-sdk';
import { Extole } from '@extole/react-native-sdk';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  type StackNavigationProp,
} from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Promo: undefined;
  Microsite: undefined;
};

const PROGRAM_DOMAIN = 'mobile-monitor.extole.io';
const MICROSITE_EMAIL = 'demoemail@mailosaur.com';
const FALLBACK_IMAGE_URI = 'https://reactnative.dev/img/tiny_logo.png';
const INLINE_WEBVIEW_HEIGHT = 240;

const extole = new Extole(PROGRAM_DOMAIN);

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Microsite'
          component={MicrositeScreen}
          options={{ title: 'Microsite' }}
        />
        <Stack.Screen name='Promo' component={ExtoleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function ExtoleScreen(): ReactElement {
  return <View style={styles.flex}>{extole.view}</View>;
}

function MicrositeScreen(): ReactElement {
  return (
    <View style={styles.flex} testID='microsite-screen'>
      {extole.webView(
        'microsite',
        { email: MICROSITE_EMAIL },
        { width: '100%', height: '100%' }
      )}
    </View>
  );
}

function HomeScreen({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}) {
  const [extoleView, setExtoleView] = React.useState<React.ReactNode>(<View />);
  const [callToActionZone, setCallToActionZone] = React.useState<Zone | null>(
    null,
  );
  const [email, setEmail] = React.useState('demo@extole.com');

  extole.configure(extoleView, setExtoleView, () => {
    navigation.navigate('Promo');
  });

  React.useEffect(() => {
    extole
      .fetchZone('mobile_cta')
      .then(([zone]) => {
        setCallToActionZone(zone);
        zone.viewed();
      })
      .catch((exception: unknown) => {
        console.error('Unable to fetch zone', exception);
      });
  }, []);

  const callToActionImageUri =
    typeof callToActionZone?.getData().image === 'string'
      ? (callToActionZone.getData().image as string)
      : FALLBACK_IMAGE_URI;

  const handleCallToActionPress = () => {
    if (!callToActionZone) {
      console.warn('CTA tapped before zone loaded');
      return;
    }
    callToActionZone.tap();
  };

  const handleLoginPress = () => {
    extole.sendEvent('deeplink', {
      email,
      extole_item: 'value',
    });
  };

  const handleLogoutPress = () => {
    extole.logout();
  };

  const handleOpenWebViewPress = () => {
    navigation.navigate('Microsite');
  };

  return (
    <SafeAreaView style={styles.flex} testID='home-screen'>
      <View style={styles.flex}>
        <Pressable
          testID='cta-image'
          accessibilityLabel='cta-image'
          onPress={handleCallToActionPress}
          style={styles.callToActionPressable}
        >
          <Image
            style={styles.callToActionImage}
            source={{ uri: callToActionImageUri }}
            accessibilityLabel='mobile-cta-image'
          />
        </Pressable>

        <Text style={styles.sectionLabel}>Microsite</Text>
        <View style={styles.inlineWebView} testID='inline-webview'>
          {extole.webView(
            'microsite',
            { email: MICROSITE_EMAIL },
            { width: '100%', height: '100%' }
          )}
        </View>

        <Text style={styles.sectionLabel}>Enter your email</Text>
        <TextInput
          testID='email-input'
          accessibilityLabel='email-input'
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
          keyboardType='email-address'
          style={styles.emailInput}
        />

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrap}>
            <Button
              testID='login-button'
              title='Login'
              onPress={handleLoginPress}
            />
          </View>
          <View style={styles.buttonWrap}>
            <Button
              testID='logout-button'
              title='Logout'
              onPress={handleLogoutPress}
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrap}>
            <Button
              testID='native-share-button'
              title='Native Share'
              disabled={callToActionZone == null}
              onPress={handleCallToActionPress}
            />
          </View>
          <View style={styles.buttonWrap}>
            <Button
              testID='open-webview-button'
              title='Open WebView'
              onPress={handleOpenWebViewPress}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  callToActionPressable: {
    width: '100%',
  },
  callToActionImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#eeeeee',
  },
  sectionLabel: {
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    fontSize: 16,
    color: '#111111',
  },
  inlineWebView: {
    marginHorizontal: 16,
    height: INLINE_WEBVIEW_HEIGHT,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
  },
  emailInput: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111111',
  },
  buttonRow: {
    marginTop: 12,
    marginHorizontal: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrap: {
    flex: 1,
    marginHorizontal: 8,
  },
});
