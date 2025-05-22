import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {format} from 'date-fns';
import React, {useCallback, useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import {InputChatBox} from '../../components/ChatBox/InputChatBox';
import {ChatHeader} from '../../components/ChatHeader/ChatHeader';
import {Menu} from '../../components/Menu/Menu';
import {MessageBox} from '../../components/MessageBox/MessageBox';
import {useAppTheme} from '../../hooks/appTheme';
import {storeState} from '../../redux/store';
import {HomeStackParamList} from '../../types/Navigations';
import {normalizeNumber} from '../../utils/getContactsDetails';
import {Theme} from '../../utils/themes';
import {getStyles} from './IndividualChat.styles';

export type IndividualChatRouteProp = RouteProp<
  HomeStackParamList,
  'IndividualChat'
>;

export const IndividualChat = () => {
  const navigation = useNavigation();
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const route = useRoute<IndividualChatRouteProp>();

  const {name, mobileNumber, profilePic} = route.params;

  const normalizedmobileNumber: any = normalizeNumber(mobileNumber);

  const messages = useSelector(
    (state: storeState) => state.messages[normalizedmobileNumber] || [],
  );

  const renderChatHeader = useCallback(
    () => (
      <ChatHeader
        name={name}
        mobileNumber={mobileNumber}
        profilePic={profilePic}
      />
    ),
    [name, mobileNumber, profilePic],
  );

  const renderMenu = useCallback(() => <Menu />, []);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });
    return () =>
      navigation.getParent()?.setOptions({
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
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <MessageBox
            message={item.message}
            timestamp={format(new Date(item.sentAt), 'hh:mm a')}
            isSender={item.isSender}
            status="sent"
          />
        )}
      />

      <InputChatBox
        receiverMobileNumber={mobileNumber}
        onSendMessage={() => {}}
      />
    </View>
  );
};
