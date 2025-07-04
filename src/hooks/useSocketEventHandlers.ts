import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getRealmInstance } from '../realm-database/connection';
import { addNewMessageInRealm } from '../realm-database/operations/addNewMessage';
import { updateMessageStatusInRealm } from '../realm-database/operations/updateMessageStatus';
import { updateUserAccountStatusInRealm } from '../realm-database/operations/updateUserAccountStatus';
import { setSuccessMessage } from '../redux/reducers/auth.reducer';
import { store, storeState } from '../redux/store';
import { Message, MessageStatus } from '../types/message';
import { decryptMessage } from '../utils/decryptMessage';
import { getTokens } from '../utils/getTokens';
import { handleIncomingMessageNotification } from '../utils/handleIncomingNotification';
import { getSocket } from '../utils/socket';

export const useSocketEventHandlers = () => {
  const user = useSelector((state: storeState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user.mobileNumber) {return;}

    let isMounted = true;
    const socket = getSocket();
    if (!socket) {return;}

    let tokenData: Awaited<ReturnType<typeof getTokens>>;

    const handleNewMessage = async (data: any) => {
      try {
        const actualMessage = await decryptMessage(
          data.chatId,
          data.message,
          data.nonce,
          tokenData.access_token
        );

        const structuredMessage: Message = {
          message: actualMessage,
          sentAt: data.sentAt,
          isSender: false,
          status: data.status,
        };

        const realm = await getRealmInstance();
        addNewMessageInRealm(realm, data.chatId, structuredMessage);
      } catch (error) {
        console.error('Error in newMessage handler:', error);
      }
    };

    const handleDelivered = (data: any) => {
      updateMessageStatusInRealm({
        chatId: data.receiverMobileNumber,
        messageIds: data.messageIds,
        status: MessageStatus.DELIVERED,
      });
    };

    const handleRead = (data: any) => {
      updateMessageStatusInRealm({
        chatId: data.receiverMobileNumber,
        messageIds: data.messageIds,
        status: MessageStatus.SEEN,
      });
    };

    const handleAccountDeleted = async (data: any) => {
      await updateUserAccountStatusInRealm(data.chatId, data.isAccountDeleted);
    };

    const handleForceLogout = () => {
      store.dispatch(setSuccessMessage('logged-out'));
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected:', new Date().toLocaleTimeString());
    };

    const handleNotification = async (data: any) => {
      if (Platform.OS === 'ios') {
        await handleIncomingMessageNotification({ ...data, from: 'socket' });
      }
    };

    const setupListeners = async () => {
      tokenData = await getTokens(user.mobileNumber);
      if (!tokenData || !tokenData.access_token || !isMounted) {return;}

      socket.on('newMessage', handleNewMessage);
      socket.on('messageDelivered', handleDelivered);
      socket.on('messageRead', handleRead);
      socket.on('isAccountDeleted', handleAccountDeleted);
      socket.on('force-logout', handleForceLogout);
      socket.on('disconnect', handleDisconnect);
      socket.on('triggerLocalNotification', handleNotification);
    };

    setupListeners();

    return () => {
      isMounted = false;

      socket.off('newMessage', handleNewMessage);
      socket.off('messageDelivered', handleDelivered);
      socket.off('messageRead', handleRead);
      socket.off('isAccountDeleted', handleAccountDeleted);
      socket.off('force-logout', handleForceLogout);
      socket.off('disconnect', handleDisconnect);
      socket.off('triggerLocalNotification', handleNotification);
    };
  }, [user.mobileNumber, dispatch]);
};
