import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    WelcomeScreen: undefined;
    LoadingScreen: undefined;
    RegistrationScreen: undefined;
    LoginScreen: undefined;
    OTPVerificationScreen : {
        mobileNumber: string,
        email: string,
        from: 'registration' | 'login'
    };
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


export type AllChatsTabScreenNavigationProps=NativeStackNavigationProp<BottomTabParamList, 'AllChatsTab'>


export type tabBarIconProps = {
    routeName: string;
    focused: boolean;
}


export type HomeStackParamList = {
    Home: undefined;
    Contact: undefined;
    IndividualChat: {
        name: string;
        originalNumber: string,
        mobileNumber: string;
        profilePic: string | null;
      };
};

export type HomeScreenNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'Home'>;
export type ContactScreenNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'Contact'>;

export type ProfileScreenNavigationProps = NativeStackNavigationProp<BottomTabParamList, 'ProfileScreen'>;
export type IndividualChatNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'IndividualChat'>;
export type OTPVerificationNavigationProps = NativeStackNavigationProp<RootStackParamList, 'OTPVerificationScreen'>;
