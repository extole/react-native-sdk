import * as React from 'react';

import { Button, Image, StyleSheet, View } from 'react-native';
import { Extole } from 'extole-mobile-sdk';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const extole = new Extole('mobile-monitor.extole.io', 'react-native');
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

function ExtoleScreen() {
  return <View>extole.view</View>;
}

function HomeScreen({ navigation }: { navigation: any }) {
  const [cta, setCta] = React.useState<Record<string, any> | undefined>();
  const [extoleView, setExtoleView] = React.useState<Element>(<View />);
  extole.configureUIInteraction(extoleView, setExtoleView, () => {
    console.debug('Navigate');
    navigation.navigate('Promo');
  });
  React.useEffect(() => {
    extole
      .fetchZone('cta_prefetch')
      .then((result: Record<string, any>) => {
        setCta(result.zone.data);
      })
      .catch((error: Error) => {
        console.log(
          'There has been a problem with your fetch operation: ',
          error,
        );
      });
  }, []);


  const onShareButtonPress = () => {
    extole.sendEvent(cta?.touch_event, { extole_zone_name: 'microsite' });
  };
  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: cta?.image || 'https://reactnative.dev/img/tiny_logo.png',
        }}
      />
      <View style={styles.space} />
      <Button title={cta?.title || ''} onPress={onShareButtonPress} />
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
