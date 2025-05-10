import React from 'react';
import { Image, Text, View } from 'react-native';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '../../screens/Home/Home';
import { BottomTabParamList, tabBarIconProps } from '../../types/Navigations';
import { styles } from './Tabs';


const Tab = createBottomTabNavigator<BottomTabParamList>();

const getTabIcon = (routeName: string, focused: boolean) => {
  switch (routeName) {
    case 'AllChatsTab':
      return focused ? require('../../../assets/icons/highlighted-all-chats-icon.png') : require('../../../assets/icons/all-chats-icon.png');
    case 'UnreadTab':
      return focused ? require('../../../assets/icons/highlighted-unread-message-icon.png') : require('../../../assets/icons/unread-message-icon.png');
    case 'ProfileScreen':
      return focused ? require('../../../assets/icons/highlighted-profile-tab-icon.png') : require('../../../assets/icons/profile-tab-icon.png');
  }
};

const getTabLabel = (routeName: string) => {
  switch (routeName) {
    case 'AllChatsTab':
      return 'All Chats';
    case 'UnreadTab':
      return 'Unread';
    case 'ProfileScreen':
      return 'Profile';
  }
};


const TabBarIcon = ({ routeName, focused}: tabBarIconProps): React.JSX.Element => {
  const iconPath = getTabIcon(routeName, focused);
  const label = getTabLabel(routeName);

  return (
    <View style={styles.container}>
        <View style={[
            styles.tabIconContainer,
            focused ? styles.focused : styles.unfocused,
        ]}>
            <Image source={iconPath} style={styles.icon} />
        </View>
        <Text style={[styles.label, focused && styles.focusedText]}>{label}</Text>
    </View>
  );
};

const getScreenOptions = (route: { name: string }): BottomTabNavigationOptions => {
  return {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: 'white',
      height: '11%',
      shadowColor: 'black',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    tabBarLabel: '',
    tabBarIcon: (props: { focused: boolean }) => (
      <TabBarIcon routeName={route.name} focused={props.focused} />
    ),
  };
};

export function Tabs(): React.JSX.Element {
  return (
    <Tab.Navigator screenOptions={({ route }) => getScreenOptions(route)}>
      <Tab.Screen name="AllChatsTab" component={Home} />
      <Tab.Screen name="UnreadTab" component={Home} />
      <Tab.Screen name="ProfileScreen" component={Home} />
    </Tab.Navigator>
  );
}



