import React, { memo, useEffect } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Badge } from '../../components/Badge/Badge';
import { useAppTheme } from '../../hooks/appTheme';
import { useUnreadChatsCount } from '../../hooks/unreadChatsCount';
import { Profile } from '../../screens/Profile/Profile';
import { BottomTabParamList, tabBarIconProps, WelcomeScreenNavigationProps } from '../../types/Navigations';
import { Theme } from '../../utils/themes';
import { HomeStack } from '../stacks/HomeStack';
import { getStyles } from './Tabs.styles';
import { useSocketEventHandlers } from '../../hooks/useSocketEventHandlers';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useRealmReset } from '../../contexts/RealmContext';
import { resetUser } from '../../redux/reducers/user.reducer';
import { storeState } from '../../redux/store';


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

const UnreadBadge = memo(() => {
    const theme: Theme = useAppTheme();
    const styles = getStyles(theme);
  const unreadChatsCount = useUnreadChatsCount();
  return unreadChatsCount > 0 ? (
    <View style={styles.badgeContainer} accessibilityLabel="badge">
      <Badge value={String(unreadChatsCount)} size="small"/>
    </View>
  ) : null;
});


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
            {routeName === 'UnreadTab' && <UnreadBadge />}
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
    tabBarButton: ({ onPress, children, style }) => (
      <Pressable onPress={onPress} android_ripple={{ color: 'transparent' }} style={style}>
        {children}
      </Pressable>
    ),
  };
};

export function Tabs(): React.JSX.Element {
  const theme: Theme = useAppTheme();
  useSocketEventHandlers();

  const dispatch = useDispatch();
  const {resetRealm} = useRealmReset();
  const welcomeNavigation = useNavigation<WelcomeScreenNavigationProps>();
  const successMessage = useSelector((state: storeState) => state.auth.successMessage);

  useEffect(() => {
    const forceLogout = async() => {
      dispatch(resetUser());
      await EncryptedStorage.clear();
      resetRealm();
      welcomeNavigation.navigate('WelcomeScreen');
    };
    if(successMessage === 'logged-out'){
      forceLogout();
    }
  }, [dispatch, welcomeNavigation, successMessage, resetRealm]);




  return (
    <Tab.Navigator screenOptions={({ route }) => ({ ...getScreenOptions(route, theme),tabBarHideOnKeyboard: true })}>
     <Tab.Screen
        name="AllChatsTab"
        children={() => <HomeStack showUnread={false} />}
      />
      <Tab.Screen
        name="UnreadTab"
        children={() => <HomeStack showUnread={true} />}
      />
      <Tab.Screen name="ProfileScreen" component={Profile} options={{headerShown: true}} />
    </Tab.Navigator>
  );
}



