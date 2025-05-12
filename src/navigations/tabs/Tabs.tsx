import React from 'react';
import { Image, Text, View } from 'react-native';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '../../screens/Home/Home';
import { BottomTabParamList, tabBarIconProps } from '../../types/Navigations';
import { getStyles } from './Tabs';
import { useAppTheme } from '../../hooks/appTheme';
import { Theme } from '../../utils/themes';


const Tab = createBottomTabNavigator<BottomTabParamList>();

const getTabIcon = (routeName: string, focused: boolean, theme: Theme) => {
  const tabs = theme.images.tabs;
  switch (routeName) {
    case 'AllChatsTab':
      return focused ? tabs.allChatsFocused : tabs.allChats;
    case 'UnreadTab':
      return focused ? tabs.unreadFocused : tabs.unread;
    case 'ProfileScreen':
      return focused ? tabs.profileFocused : tabs.profile;
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
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const iconPath = getTabIcon(routeName, focused, theme);
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

const getScreenOptions = (route: { name: string }, theme: Theme): BottomTabNavigationOptions => {

  return {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: theme.primaryBackground,
      height: '12%',
      shadowColor: theme.primaryShadowColor,
      shadowOffset: { width: 1, height: 0.4 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    tabBarLabel: '',
    tabBarIcon: (props: { focused: boolean }) => (
      <TabBarIcon routeName={route.name} focused={props.focused} />
    ),
  };
};

export function Tabs(): React.JSX.Element {
  const theme: Theme = useAppTheme();
  return (
    <Tab.Navigator screenOptions={({ route }) => getScreenOptions(route, theme)}>
      <Tab.Screen name="AllChatsTab" component={Home} />
      <Tab.Screen name="UnreadTab" component={Home} />
      <Tab.Screen name="ProfileScreen" component={Home} />
    </Tab.Navigator>
  );
}



