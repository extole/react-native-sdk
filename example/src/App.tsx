import type { ReactElement } from 'react';
import * as React from 'react';

import {Button, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import type { Zone } from '../../src/index';
import { Extole } from '../../src/index';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
} from 'react-native';


const extole = new Extole('mobile-monitor.extole.io');

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name='Promo' component={ExtoleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function ExtoleScreen(): ReactElement {
  return extole.view as ReactElement;
}

function HomeScreen({ navigation }: { navigation: any }) {
  const [extoleView, setExtoleView] = React.useState<React.ReactNode>(<View />);
  const [zone, setZone] = React.useState<Zone | null>(null);
  const [text, onChangeText] = React.useState('Useless Text');
  extole.configure(extoleView, setExtoleView, () => {
    navigation.navigate('Promo');
  });
  React.useEffect(() => {
    extole
      .fetchZone('mobile_cta')
      .then(([zone, _campaign]) => {
        setZone(zone);
      }).catch((exception: any) => {
      console.error('Unable to fetch zone', exception);
    });
    extole
      .fetchZone('mobile_cta_timestamp')
      .then(([zone, _campaign]) => {
        console.log("Timestamp zone data", zone.getData())
      });
  }, []);

  const login = () => {
    extole.sendEvent('deeplink', { 'email': text, 'extole_item': 'value' });
  };
  const logout = () => {
    extole.logout()
  };
  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: zone?.getData().image || 'https://reactnative.dev/img/tiny_logo.png',
        }}
      />
      <View style={styles.space} />
      <Text>This is a Demo App that may not contain content if there is no internet connection</Text>
      <SafeAreaView style={{ marginTop: 20, height: 300 }}>
          {extole.webView("microsite", {"email": "demoemail@mailosaur.com"})}
      </SafeAreaView>
      <Text>Enter your email:</Text>
      <TextInput onChangeText={onChangeText} style={{borderWidth: 1, width: 300}}></TextInput>
      <Button title="Login" onPress={login} />
      <Button title="Logout" onPress={logout} />
      <Text>Current timestamp: {zone?.getData().timestamp}</Text>
      <View style={styles.space} />
    </View>
  );
}

const styles = StyleSheet.create({
  space: {
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  promoText: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  tinyLogo: {
    width: '100%',
    height: 300,
  },
  logo: {
    width: 66,
    height: 58,
  },
});
