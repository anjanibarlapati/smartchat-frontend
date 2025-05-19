import { ChatHeader } from '../../components/ChatHeader/ChatHeader';
import { Menu } from '../../components/Menu/Menu';
import { InputChatBox } from '../../components/ChatBox/InputChatBox';
import { useAppTheme } from '../../hooks/appTheme';
import { getStyles } from './IndividualChat.styles';
import { useCallback, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import { HomeStackParamList } from '../../types/Navigations';
import { Theme } from '../../utils/themes';



type IndividualChatRouteProp = RouteProp<HomeStackParamList, 'IndividualChat'>;

export const IndividualChat = () => {
    const navigation = useNavigation();
    const theme: Theme = useAppTheme();
    const styles = getStyles(theme);
    const route = useRoute<IndividualChatRouteProp>();
    const { name, mobileNumber, profilePic } = route.params;

    const renderChatHeader = useCallback(() => (
        <ChatHeader name={name} mobileNumber={mobileNumber} profilePic={profilePic} />
    ), [name, mobileNumber, profilePic]);

    const renderMenu = useCallback(() => (
        <Menu />
    ), []);

    useEffect(() => {
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            display: 'none',
          },
        });
        return () => navigation.getParent()?.setOptions({
          tabBarStyle: undefined,
        });
      }, [navigation]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerLeft: renderChatHeader,
            headerStyle: styles.headerStyle,
            headerRight: renderMenu,
        });
    }, [navigation, renderChatHeader, renderMenu, styles.headerStyle]);

  return (
    <View style={styles.container}>
        <ScrollView>
            <></>
        </ScrollView>
        <InputChatBox/>
    </View>
  );
};
