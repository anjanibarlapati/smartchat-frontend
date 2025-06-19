import NetInfo from '@react-native-community/netinfo';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
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
import { TimeStamp } from '../../components/TimeStamp/TimeStamp';
import { useRealm } from '../../contexts/RealmContext';
import { useAppTheme } from '../../hooks/appTheme';
import { FlattenedChatMessage, useGroupedMessages } from '../../hooks/groupMessageByDate';
import { useAlertModal } from '../../hooks/useAlertModal';
import { addUserAction } from '../../realm-database/operations/addUserAction';
import { blockContactInRealm } from '../../realm-database/operations/blockContact';
import { clearChatInRealm } from '../../realm-database/operations/clearChat';
import { unblockContactInRealm } from '../../realm-database/operations/unblockContact';
import { updateMessageStatusInRealm } from '../../realm-database/operations/updateMessageStatus';
import { Chat } from '../../realm-database/schemas/Chat';
import { resetActiveChat, setActiveChat } from '../../redux/reducers/activeChat.reducer';
import { storeState } from '../../redux/store';
import { MessageStatus } from '../../types/message';
import {
  HomeScreenNavigationProps,
  HomeStackParamList,
} from '../../types/Navigations';
import { getSocket } from '../../utils/socket';
import { SyncActionType } from '../../utils/syncPendingActions';
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
  const { alertVisible, alertMessage, alertType, showAlert, hideAlert } = useAlertModal();
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [showClearChatAlert, setShowClearChatAlert] = useState(false);
  const [showBlockUnblockAlert, setShowBlockUnblockAlert] = useState(false);
  const { name, originalNumber, mobileNumber, profilePic } = route.params;
  const user = useSelector((state: storeState) => state.user);
  const realm = useRealm();
  const chat = realm.objectForPrimaryKey<Chat>('Chat', mobileNumber);
  const flatListRef = useRef<FlatList>(null);
  const [isConnectedToInternet,setIsConnectedToInternet] = useState(false);
  const dispatch = useDispatch();
  const { groupedMessages: messages } = useGroupedMessages(mobileNumber);

  useEffect(()=> {
    const networkStatus = async() => {
       const netState = await NetInfo.fetch();
        if(netState.isConnected){
          setIsConnectedToInternet(true);
        }else{
           setIsConnectedToInternet(false);
        }
    };
    networkStatus();
  });

  const userChat = useMemo(() => ({
    exists: !!chat,
    isBlocked: chat?.isBlocked ?? false,
    isAccountDeleted: chat?.isAccountDeleted ?? false,
  }), [chat]);

  const userMobileNumber = useMemo(() => user.mobileNumber, [user.mobileNumber]);

  const latestUnseenMessageSentAt = useMemo(() => {
    if (!messages.length) {return null;}
    const latestUnseen = [...messages]
      .reverse()
      .find(
        (msg): msg is FlattenedChatMessage =>
          msg.type === 'message' &&
          !msg.isSender &&
          msg.status !== MessageStatus.SEEN
      );
    return latestUnseen ? latestUnseen.sentAt : null;
  }, [messages]);

  useEffect(() => {
    if (!userChat.exists) {
      realm.write(() => {
        realm.create<Chat>('Chat', {
          chatId: mobileNumber,
          isBlocked: false,
          publicKey: null,
        });
      });
    }
  }, [userChat.exists, mobileNumber, realm]);

  useEffect(() => {
    dispatch(setActiveChat(mobileNumber));
    return () => {
      dispatch(resetActiveChat());
    };
  }, [dispatch, mobileNumber]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !socket.connected || mobileNumber === userMobileNumber) {
      return;
    }
    if (userChat.exists && !userChat.isAccountDeleted) {
      socket.emit('isAccountDeleted', {
        senderMobileNumber: userMobileNumber,
        receiverMobileNumber: mobileNumber,
      });
    }
  }, [userChat.exists, userChat.isAccountDeleted, mobileNumber, userMobileNumber]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !socket.connected || mobileNumber === userMobileNumber) {
      return;
    }

    updateMessageStatusInRealm({
      chatId: mobileNumber,
      status: MessageStatus.SEEN,
    });

    if(!latestUnseenMessageSentAt){
      return;
    }
    if(socket){
      socket.emit('messageRead', {
        sentAt: latestUnseenMessageSentAt,
        chatId: mobileNumber,
      });
    } else{
        addUserAction(realm, SyncActionType.MESSAGE_SEEN, {sentAt: latestUnseenMessageSentAt});
    }

  }, [latestUnseenMessageSentAt, mobileNumber, realm, userMobileNumber]);

  const renderChatHeader = useCallback(
    () => (
      <>
        <ChatHeader
          name={name}
          originalNumber={originalNumber}
          profilePic={profilePic}
          isSelfChat={mobileNumber === userMobileNumber}
        />
        <Menu onClick={() => setOptionsModalVisible(true)} />
      </>
    ),
    [mobileNumber, name, originalNumber, profilePic, userMobileNumber],
  );
  useEffect(() => {
    const parentNav = navigation.getParent();
    parentNav?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      parentNav?.setOptions({
        tabBarStyle: {
          backgroundColor: theme.primaryBackground,
          height: '12%',
          shadowColor: theme.primaryShadowColor,
          shadowOffset: { width: 1, height: 0.4 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        },
      });
    };
  }, [navigation, theme.primaryBackground, theme.primaryShadowColor]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: renderChatHeader,
      headerStyle: styles.headerStyle,
    });
  }, [navigation, renderChatHeader, styles.headerStyle]);

  const handleClearChat = useCallback(async () => {
    try {
           clearChatInRealm(realm, mobileNumber);
        if(!isConnectedToInternet){
          addUserAction(realm, SyncActionType.CLEAR_CHAT, {senderMobileNumber: userMobileNumber, receiverMobileNumber: mobileNumber, clearedChatAt: new Date()});
        }else{
          const response = await clearUserChat(userMobileNumber, mobileNumber);
         if(!response.ok){
             const result = await response.json();
             showAlert(result.message, 'warning');
        }}
      } catch (error) {
          showAlert('Unable to Clear Chat', 'error');
       }
        finally {
          setTimeout(() => {
          navigateToHomeScreen.replace('Home');
        }, 1000);
        }
  }, [realm, mobileNumber, isConnectedToInternet, userMobileNumber, showAlert, navigateToHomeScreen]);

  const handleBlockAndUnblock = useCallback(async () => {
  const isAlreadyBlocked = userChat.isBlocked;
    try {
      if (!isAlreadyBlocked) {
        blockContactInRealm(realm, mobileNumber);
        if(!isConnectedToInternet){
          addUserAction(realm,SyncActionType.BLOCK_USER, {senderMobileNumber: userMobileNumber, receiverMobileNumber: mobileNumber, blockedAt: new Date()});
        }else{
        const response = await blockUserChat({
          senderMobileNumber: userMobileNumber,
          receiverMobileNumber: mobileNumber,
        });
        if (!response.ok) {
          unblockContactInRealm(realm, mobileNumber);
          const result = await response.json();
          showAlert(result.message, 'warning');
        }
      }
      } else {
        unblockContactInRealm(realm, mobileNumber);
         if(!isConnectedToInternet){
            addUserAction(realm,SyncActionType.UNBLOCK_USER, {senderMobileNumber: userMobileNumber, receiverMobileNumber: mobileNumber, unblockedAt: new Date()});

        }else{
        const response = await unblockUserChat(userMobileNumber, mobileNumber);
        if (!response.ok) {
          blockContactInRealm(realm, mobileNumber);
          const result = await response.json();
          showAlert(result.message, 'warning');
        }
      }}
    } catch (error) {
      isAlreadyBlocked
        ? blockContactInRealm(realm, mobileNumber)
        : unblockContactInRealm(realm, mobileNumber);
        showAlert('Something went wrong please try again', 'error');
    }
  }, [userChat.isBlocked, realm, mobileNumber, isConnectedToInternet, userMobileNumber, showAlert]);

  const keyExtractor = useCallback((item: any) =>
    item.type === 'timestamp'
      ? item.id!
      : `${item.sentAt}_${item.isSender ? '1' : '0'}`,
    []
  );

  const renderItem = useCallback(({ item }: { item: any }) => {
    if (item.type === 'timestamp') {
      return (
        <View style={styles.dayContainer}>
          <TimeStamp from="chat-screen" date={item.dateKey!} />
        </View>
      );
    }
    return (
      <MessageBox
        message={item.message}
        timestamp={format(new Date(item.sentAt), 'hh:mm a')}
        isSender={item.isSender}
        status={item.status}
      />
    );
  }, [styles.dayContainer]);

  const handleClearChatPress = useCallback(() => {
    setOptionsModalVisible(false);
    setShowClearChatAlert(true);
  }, []);

  const handleBlockUnblockPress = useCallback(() => {
    setOptionsModalVisible(false);
    setShowBlockUnblockAlert(true);
  }, []);

  const handleOptionsModalClose = useCallback(() => {
    setOptionsModalVisible(false);
  }, []);

  const handleClearChatConfirm = useCallback(() => {
    setShowClearChatAlert(false);
    handleClearChat();
  }, [handleClearChat]);

  const handleClearChatCancel = useCallback(() => {
    setShowClearChatAlert(false);
  }, []);

  const handleBlockUnblockConfirm = useCallback(() => {
    setShowBlockUnblockAlert(false);
    handleBlockAndUnblock();
  }, [handleBlockAndUnblock]);

  const handleBlockUnblockCancel = useCallback(() => {
    setShowBlockUnblockAlert(false);
  }, []);

  const showInput = !userChat.isBlocked && !userChat.isAccountDeleted;

  const blockedMessageText = useMemo(() => {
    if (userChat.isAccountDeleted) {
      return 'This user has deleted their account.\n You can no longer send messages';
    }
    if (userChat.isBlocked) {
      return 'You have blocked this contact. Unblock to send or receive messages.';
    }
    return '';
  }, [userChat.isAccountDeleted, userChat.isBlocked]);

  const blockUnblockAlertMessage = useMemo(() =>
    userChat.isBlocked
      ? 'Are you sure you want to unblock this chat?'
      : 'Are you sure you want to block this chat?',
    [userChat.isBlocked]
  );

  return (
    <>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={hideAlert}
      />
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <FlatList
            data={messages}
            ref={flatListRef}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onContentSizeChange={()=>flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={()=>flatListRef.current?.scrollToEnd({ animated: false })}
          />
        </View>

        {showInput ? (
          <View style={styles.inputContainer}>
            <InputChatBox receiverMobileNumber={mobileNumber} />
          </View>
        ) : (
          <View style={styles.blockedMessageContainer}>
            <View style={styles.box}>
              <Text style={styles.blockedText}>
                {blockedMessageText}
              </Text>
            </View>
          </View>
        )}
        <ChatOptionsModal
          visible={optionsModalVisible}
          onClearChat={handleClearChatPress}
          onBlockAndUnblock={handleBlockUnblockPress}
          onClose={handleOptionsModalClose}
          receiverMobileNumber={mobileNumber}
        />
        <AlertModal
          message="Do you really want to clear this chat?"
          visible={showClearChatAlert}
          confirmText="Yes"
          cancelText="Cancel"
          onConfirm={handleClearChatConfirm}
          onCancel={handleClearChatCancel}
        />
        <AlertModal
          message={blockUnblockAlertMessage}
          visible={showBlockUnblockAlert}
          confirmText="Yes"
          cancelText="Cancel"
          onConfirm={handleBlockUnblockConfirm}
          onCancel={handleBlockUnblockCancel}
        />
      </View>
    </>
  );
};


