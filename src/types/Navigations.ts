import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    WelcomeScreen: undefined;
    LoadingScreen: undefined;
    RegistrationScreen: undefined;
    LoginScreen: undefined;
    Tabs: undefined;
};

export type BottomTabParamList = {
    AllChatsTab: undefined;
    UnreadTab: undefined;
    ProfileScreen: undefined;
  };

export type WelcomeScreenNavigationProps = NativeStackNavigationProp<RootStackParamList, 'WelcomeScreen'>;

export type LogincreenNavigationProps = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

export type RegistrationScreenNavigationProps = NativeStackNavigationProp<RootStackParamList, 'RegistrationScreen'>;


export type tabBarIconProps = {
    routeName: string;
    focused: boolean;
}


