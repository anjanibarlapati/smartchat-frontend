import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { AlertModal } from '../../components/AlertModal/AlertModal';
import { ChatHeader } from '../../components/ChatHeader/ChatHeader';
import { blockUserChat } from '../../components/ChatOptionsModal/blockChat.service';
import { ChatOptionsModal } from '../../components/ChatOptionsModal/ChatOptionsModal';
import { clearUserChat } from '../../components/ChatOptionsModal/clearChat.service';
import { unblockUserChat } from '../../components/ChatOptionsModal/unblockChat.service';
import { CustomAlert } from '../../components/CustomAlert/CustomAlert';
import { InputChatBox } from '../../components/InputChatBox/InputChatBox';
import { Menu } from '../../components/Menu/Menu';
import { MessageBox } from '../../components/MessageBox/MessageBox';
import { useQuery, useRealm } from '../../contexts/RealmContext';
import { useAppTheme } from '../../hooks/appTheme';
import { useAlertModal } from '../../hooks/useAlertModal';
import { blockContactInRealm } from '../../realm-database/operations/blockContact';
import { clearChatInRealm } from '../../realm-database/operations/clearChat';
import { unblockContactInRealm } from '../../realm-database/operations/unblockContact';
import { updateMessageStatusInRealm } from '../../realm-database/operations/updateMessageStatus';
import { Chat } from '../../realm-database/schemas/Chat';
import { Message } from '../../realm-database/schemas/Message';
import { storeState } from '../../redux/store';
import { HomeScreenNavigationProps, HomeStackParamList } from '../../types/Navigations';
import { getSocket } from '../../utils/socket';
import { Theme } from '../../utils/themes';
import { getStyles } from './IndividualChat.styles';

export type IndividualChatRouteProp = RouteProp<
  HomeStackParamList,
  'IndividualChat'
>;

export const IndividualChat = () => {
  const navigation = useNavigation();
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const route = useRoute<IndividualChatRouteProp>();
  const navigateToHomeScreen = useNavigation<HomeScreenNavigationProps>();
  const {
        alertVisible, alertMessage, alertType, showAlert, hideAlert,
      } = useAlertModal();
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [showClearChatAlert, setShowClearChatAlert] = useState(false);
  const [showBlockUnblockAlert, setShowBlockUnblockAlert] = useState(false);

  const {name, originalNumber, mobileNumber, profilePic} = route.params;
  const user = useSelector((state: storeState) => state.user);
  const messages = useQuery<Message>('Message').filtered('chat.chatId == $0', mobileNumber);
  const realm = useRealm();
  const chat = realm.objectForPrimaryKey<Chat>('Chat', mobileNumber);
  const flatListRef = useRef<FlatList>(null);


  useEffect(() => {
    if(!chat) {
      realm.write(() => {
        realm.create<Chat>('Chat', {
          chatId: mobileNumber,
          isBlocked: false,
          publicKey: null,
        });
      });
    }
  }, [chat, mobileNumber, realm]);

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
      updateMessageStatusInRealm( {chatId: mobileNumber, sentAt: latestUnseen.sentAt, status: 'seen', updateAllBeforeSentAt: true});
    }
  }, [messages, mobileNumber]);

  const renderChatHeader = useCallback(
    () => (
      <>
      <ChatHeader
        name={name}
        originalNumber={originalNumber}
        profilePic={profilePic}
      />
      <Menu onClick={() => setOptionsModalVisible(true)}/>
      </>
    ),
    [name, originalNumber, profilePic],
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
      headerLeft: () => renderChatHeader(),
      headerStyle: styles.headerStyle,
    });
  }, [navigation, renderChatHeader, styles.headerStyle]);

  const handleClearChat = async () => {
    try {
      const response = await clearUserChat(
        user.mobileNumber,
        mobileNumber,
      );
      if (response.ok) {
        clearChatInRealm(realm, mobileNumber);
        setTimeout(()=> {
           navigateToHomeScreen.replace('Home');
        }, 1000);
      }
    } catch (error) {
      showAlert('Unable to Clear Chat', 'error');
    }
  };

  const handleBlockAndUnblock = async () => {
    const isAlreadyBlocked = chat?.isBlocked;
    try{
      if(!isAlreadyBlocked) {
        blockContactInRealm(realm, mobileNumber);
        const response = await blockUserChat({
          senderMobileNumber: user.mobileNumber,
          receiverMobileNumber: mobileNumber,
        });
        if(!response.ok) {
          unblockContactInRealm(realm, mobileNumber);
          const result = await response.json();
          showAlert(result.message, 'warning');
        }
      } else{
        unblockContactInRealm(realm, mobileNumber);
        const response = await unblockUserChat(user.mobileNumber, mobileNumber);
        if(!response.ok) {
          blockContactInRealm(realm, mobileNumber);
          const result = await response.json();
          showAlert(result.message, 'warning');
        }
      }
    } catch(error) {
      isAlreadyBlocked ? blockContactInRealm(realm, mobileNumber) : unblockContactInRealm(realm, mobileNumber);
      showAlert('Something went wrong please try agian', 'error');
    }
  };

  return (
    <>
      <CustomAlert visible={alertVisible} message={alertMessage} type={alertType} onClose={hideAlert} />
      <View style={styles.container}>
        <View style={styles.messageContainer}>
        <FlatList
          data={messages}
          ref={flatListRef}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => (
            <MessageBox
              message={item.message}
              timestamp={format(new Date(item.sentAt), 'hh:mm a')}
              isSender={item.isSender}
              status={item.status}
            />
          )}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
          onLayout={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
        />
        </View>

        {!chat?.isBlocked ? <View style={styles.inputContainer}>
          <InputChatBox receiverMobileNumber={mobileNumber} />
          </View> :
        <View style={styles.blockedMessageContainer}>
          <View style={styles.box}>
            <Text style={styles.blockedText}>
              You have blocked this contact. Unblock to send or receive messages.
            </Text>
          </View>
        </View>
        }
        <ChatOptionsModal
          visible={optionsModalVisible}
          onClearChat={() => {setOptionsModalVisible(false); setShowClearChatAlert(true);}}
          onBlockAndUnblock={() => {setOptionsModalVisible(false); setShowBlockUnblockAlert(true);}}
          onClose={() => setOptionsModalVisible(false)}
          receiverMobileNumber={mobileNumber}
        />
        <AlertModal
          message="Do you really want to clear this chat?"
          visible={showClearChatAlert}
          confirmText="Yes"
          cancelText="Cancel"
          onConfirm={() => {
            setShowClearChatAlert(false);
            handleClearChat();
          }}
          onCancel={() => setShowClearChatAlert(false)}
        />
        <AlertModal
          message={chat?.isBlocked
            ? 'Are you sure you want to unblock this chat?'
            : 'Are you sure you want to block this chat?'}
          visible={showBlockUnblockAlert}
          confirmText="Yes"
          cancelText="Cancel"
          onConfirm={() => {
            setShowBlockUnblockAlert(false);
            handleBlockAndUnblock();
          }}
          onCancel={() => setShowBlockUnblockAlert(false)}
        />
      </View>
    </>
  );
};
