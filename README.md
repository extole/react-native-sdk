# Extole React Native SDK

This integration guide shows you how to set up and launch an Extole program as quickly as possible with our React Native SDK.


## Requirements

The Extole React Native SDK supports iOS 13.0 or later and Android supports minSdkVersion 21 or later.


## Install the SDK dependency

Add the `extole-mobile-sdk` dependency:


```
npm install @extole/react-native-sdk react-native-webview
```



## Initialize SDK

Initialize Extole:


```
import {Extole} from '@extole/extole-mobile-sdk';


const extole = new Extole('share.client.com', 'your-app-name');
```


You’ll need to provide your Extole program domain in place of `'share.client.com'`. Be sure to also replace `'your-app-name'` with a descriptive name for your application.


## Initialize View

In your code, pass configure the `view` and callback:


```
const [extoleView, setExtoleView] = React.useState<React.ReactNode>(<View />);

extole.configure(extoleView, setExtoleView, () => {
    navigation.navigate('Promo');
});

// Use the extole.view
function ExtoleScreen(): ReactElement {
  return return extole.view as ReactElement;
}

// The ExtoleScreen() method is used as a Screen
<Stack.Screen name='Promo' component={ExtoleScreen} />

```


By default, Extole will use this single view to interact with the customer.


## Exchange Data with Extole


### Customer Information

Send Extole information about the customer:


```
extole.identify("<email@domain.tld>", {"partner_user_id": "123"})
```



You can choose to pass any type of data to describe the customer. Richer data about your customers gives your marketing team the information they need to better segment your program participants and target them with appropriate campaigns.


### Events

Send Extole events, such as registers, signups, conversions, account openings, etc:


```
extole.sendEvent("cta_viewed", {"key": "value"}))
```


For each event type, you can send additional data. For example, on a conversion event you may want to pass in order ID or order value and so on.


### Call to Action Content

Populate a call to action (CTA) with content from Extole.

CTAs such as mobile menu items can be fully customized in the My Extole Campaign Editor. Each CTA has a designated zone. The following code is an example of how to retrieve a CTA by fetching zone content:


```
const [zone, setZone] = React.useState<Zone | null>(null);
React.useEffect(() => {
    extole
      .fetchZone('mobile_cta')
      .then(([zone, _campaign]) => {
        setZone(zone);
      });
}, []);

// On CTA tap send the event to Extole
const onShareButtonPress = () => {
  extole.sendEvent(cta?.touch_event, { extole_zone_name: 'microsite' });
};

. . . 

// Usage example:
<View style={styles.container}>
  <Image
    style={styles.tinyLogo}
    source={{
      uri: zone?.getData().image || '<default image link>',
    }}
  />
  <View style={styles.space} />
  <Button title={zone?.getData().title || ''} onPress={onShareButtonPress} />
  <View style={styles.space} />
</View>
```



## In order to be able to fetch the `cta` zone, the zone should be configured in My Extole and should return JSON content containing the `image` and `title`.

Important note: We encourage you to pull CTA content from My Extole because doing so ensures that your menu item or overlay message will reflect the copy and offer you’ve configured for your campaign.


# Advanced Usage

The following topics cover advanced use cases for the Extole React Native SDK. If you would like to explore any of these options, please reach out to our Support Team at support@extole.com.


## Configuring Actions from Events

You can set up a specific action to occur when an event is fired. For example, when a customer taps on your menu item CTA, you may want the event to trigger an action that loads your microsite and shows the share experience.

To set up this type of configuration, you will need to work with Extole Support to set up a zone in My Extole that returns JSON configurations with conditions and actions. The SDK executes actions for conditions that are passing for a specific event:


```
{
  "operations": [
    {
      "conditions": [
        {
          "type": "EVENT",
          "event_names": [
            "cta_tap"
          ]
        }
      ],
      "actions": [
        {
          "type": "VIEW_FULLSCREEN",
          "zone_name": "microsite"
        }
      ]
    }
  ]
}
```



### 


### Supported Actions

The following types of actions are supported by default in our SDK.


<table>
  <tr>
   <td><strong>Action Name</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><code>PROMPT</code>
   </td>
   <td>Display a pop-up notification native to iOS. For example, this could appear when a discount or coupon code has been successfully applied. 
   </td>
  </tr>
  <tr>
   <td><code>NATIVE_SHARING</code>
   </td>
   <td>Open the native share sheet with a predefined message and link that customers can send via SMS or any enabled social apps. 
   </td>
  </tr>
  <tr>
   <td><code>VIEW_FULLSCREEN</code>
   </td>
   <td>Trigger a full screen mobile web view. For example, this could be your microsite as configured in My Extole to display the share experience.
   </td>
  </tr>
</table>



### Custom Actions

If you would like to create custom actions beyond our defaults, use the format exhibited in the example below. Please reach out to our Support Team at [support@extole.com](mailto:support@extole.com) if you have any questions.


#### Example custom action


```
export class CustomReactAction implements Action {
  type = 'CUSTOM';
  title = 'REACT_ACTION';

  execute(_event: AppEvent, _extole: Extole) {
    console.log('Custom Action was executed', this);
  }
}
```



#### Registering a custom action


```
extole.registerAction('CUSTOM', CustomReactAction.prototype);
```



## 


## Appendix


### Advanced Actions


#### Load Operations
Loads additional operations


```
{
  "type": "LOAD_OPERATIONS",
  "zones": [
    "<zone_name>"
  ],
  "data": {
    "key": "value"
  }
}
```


####  Fetch
Fetches and caches content

```
{
  "type": "FETCH",
  "zones": [
    "<zone_name_1>",
    "<zone_name_2>"
  ]
}
```



#### Set Log Level
Used to configure the log level (DEBUG, INFO, WARN, ERROR)

```
{
  "type": "SET_LOG_LEVEL",
  "log_level": "WARN"
}
```

