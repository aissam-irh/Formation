import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from './src/screens/Signup/Signup';
import Signin from './src/screens/Login/Signin';
import Home from './src/screens/Home/Home';
import Nologin from './src/screens/Nologin/Nologin';
import Map from './src/screens/Maps/Map';
import Détails from './src/screens/Détails/Détails';
import Notification from './src/screens/Notification/Notification';
import AddPost from './src/screens/AddPost/AddPost';
import Nocnx from './src/screens/NoCnx/Nocnx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionic from 'react-native-vector-icons/Ionicons';
import { FlatList, Platform } from 'react-native';
import PdfView from './src/screens/pdf/pdf';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { setConnected } from './src/Redux/CnxSlice';
import OneSignal from 'react-native-onesignal';
import { ScaledSheet } from 'react-native-size-matters/extend';
import Share from 'react-native-share';
import ShareC from './src/screens/Share/Share'

////////////////////////////////////////////////:
OneSignal.setAppId('f30f9440-4783-4a36-8b23-7cbbc153ee7e');

OneSignal.promptForPushNotificationsWithUserResponse(response => {
  console.log(' response   ===>:', response);
});

OneSignal.setNotificationWillShowInForegroundHandler(
  notificationReceivedEvent => {
    console.log(
      'OneSignal: notification will show in foreground====>:',
      notificationReceivedEvent,
    );
    let notification = notificationReceivedEvent.getNotification();

    const data = notification.additionalData;
    console.log('additionalData: ', data);
    notificationReceivedEvent.complete(notification);
  },
);

OneSignal.addSubscriptionObserver(event => {
  console.log('ssssss ====>:', event);
});

OneSignal.setNotificationOpenedHandler(notification => {
  console.log('notification opened=====>:', notification);
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeName = 'Home';
const MapName = 'Map';
const NotificationName = 'Notification';


export default function app() {
  const dispatch = useDispatch();

  const connected = useSelector(state => state?.connected?.value);

  const ButonBarSelect = () => {
    return (
      <Tab.Navigator
        initialRouteName={HomeName}
        screenOptions={({ route }) => ({
          headerShown: false,
          headerBackground: 'green',
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#000000',
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: Platform.OS === 'android' ? 60 : 90,
            backgroundColor: '#E1FAF6',
            borderTopLeftRadius: 10,
          },
          tabBarItemStyle: {
            backgroundColor: '#E1FAF6',
          },
          tabBarLabelStyle: {
            fontWeight: '400',
            fontSize: 14,
            marginBottom: 6,
          },
          tabBarIcon: ({ focused }) => {
            let iconName;
            let rn = route.name;

            if (rn === HomeName) {
              width = 30;
              height = 30;
              iconName = !focused
                ? require('./img/pngs/activeHome.png')
                : require('./img/pngs/inactiveHome.png');
            } else if (rn === MapName) {
              width = 30;
              height = 30;
              iconName = focused
                ? require('./img/pngs/map.png')
                : require('./img/pngs/inactiveMap.png');
            } else if (rn === NotificationName) {
              width = 30;
              height = 30;
              iconName = focused
                ? require('./img/pngs/activeNot.png')
                : require('./img/pngs/inactiveNot.png');
            }

            // You can return any component that you like here!
            return (
              <View style={{ padding: 20 }}>
                <Image
                  source={iconName}
                  style={[{ width: width, height: height }]}
                />
              </View>
            );
          },
        })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Notification" component={Notification} />
        <Tab.Screen name="Map" component={Map} />
        <Tab.Screen
          name="Share"
          component={ShareC}
          options={{ tabBarButton: props => <ShareC /> }}
        />
      </Tab.Navigator>
    );
  };

  const unsubscribe = NetInfo.addEventListener(state => {
    if (connected !== state.isConnected) {
      dispatch(setConnected(state.isConnected));
    }
  });

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Nologin"
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Nologin" component={Nologin} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Signin" component={Signin} />
          <Stack.Screen name="HomeOR" component={ButonBarSelect} />
          <Stack.Screen name="Détails" component={Détails} />
          <Stack.Screen name="AddPost" component={AddPost} />
          <Stack.Screen name="PdfView" component={PdfView} />
          <Stack.Screen name="Nocnx" component={Nocnx} />
        </Stack.Navigator>
      </NavigationContainer>
      {!connected && <Nocnx />}
    </>
  );
}

