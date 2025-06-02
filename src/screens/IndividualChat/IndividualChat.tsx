import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {format} from 'date-fns';
import React, {useCallback, useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {ChatHeader} from '../../components/ChatHeader/ChatHeader';
import {InputChatBox} from '../../components/InputChatBox/InputChatBox';
import {Menu} from '../../components/Menu/Menu';
import {MessageBox} from '../../components/MessageBox/MessageBox';
import {useAppTheme} from '../../hooks/appTheme';
import {HomeStackParamList} from '../../types/Navigations';
import {getSocket} from '../../utils/socket';
import {Theme} from '../../utils/themes';
import {getStyles} from './IndividualChat.styles';
import { useQuery } from '../../contexts/RealmContext';
import { Message } from '../../realm-database/schemas/Message';

export type IndividualChatRouteProp = RouteProp<
  HomeStackParamList,
  'IndividualChat'
>;

export const IndividualChat = () => {
  const navigation = useNavigation();
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const route = useRoute<IndividualChatRouteProp>();

  const {name, originalNumber, mobileNumber, profilePic} = route.params;
  const messages = useQuery<Message>('Message').filtered('chat.chatId == $0', mobileNumber);

  useEffect(() => {
    if (!messages.length) {
      return;
    }

    const socket = getSocket();
    if (!socket?.connected) {
      return;
    }

    const reversedMessages = [...messages].reverse();
    const latestUnseen = reversedMessages.find(
      msg => !msg.isSender && msg.status !== 'seen',
    );

    if (latestUnseen) {
      socket.emit('messageRead', {
        sentAt: latestUnseen.sentAt,
        chatId: mobileNumber,
      });
    }
  }, [messages, mobileNumber]);

  const renderChatHeader = useCallback(
    () => (
      <ChatHeader
        name={name}
        originalNumber={originalNumber}
        profilePic={profilePic}
      />
    ),
    [name, originalNumber, profilePic],
  );

  const renderMenu = useCallback(
    () => <Menu receiverMobileNumber={mobileNumber} />,
    [mobileNumber],
  );

  useEffect(() => {
    const parentNav = navigation.getParent();

    parentNav?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    return () => {
      parentNav?.setOptions({
        tabBarStyle: {
          backgroundColor: theme.primaryBackground,
          height: '12%',
          shadowColor: theme.primaryShadowColor,
          shadowOffset: {width: 1, height: 0.4},
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        },
      });
    };
  }, [navigation, theme]);

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
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => (
          <MessageBox
            message={item.message}
            timestamp={format(new Date(item.sentAt), 'hh:mm a')}
            isSender={item.isSender}
            status={item.status}
          />
        )}
      />

      <InputChatBox receiverMobileNumber={mobileNumber} />
    </View>
  );
};
