import { useEffect } from 'react';
import { getSocket } from '../utils/socket';
import { useDispatch, useSelector } from 'react-redux';
import { store, storeState } from '../redux/store';
import { clearSuccessMessage } from '../redux/reducers/auth.reducer';
import { updateUserAccountStatusInRealm } from '../realm-database/operations/updateUserAccountStatus';
import { updateMessageStatusInRealm } from '../realm-database/operations/updateMessageStatus';
import { Message, MessageStatus } from '../types/message';
import { getRealmInstance } from '../realm-database/connection';
import { addNewMessageInRealm } from '../realm-database/operations/addNewMessage';
import { decryptMessage } from '../utils/decryptMessage';
import { getTokens } from '../utils/getTokens';
import { Platform } from 'react-native';
import { handleIncomingMessageNotification } from '../utils/handleIncomingNotification';

// export const useSocketEventHandlers = () => {
//   const user = useSelector((state: storeState) => state.user);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!user.mobileNumber) {return;}

//     let isMounted = true;

//     const setupListeners = async () => {
//       const socket = getSocket();
//       if (!socket) {return;}

//       const tokenData = await getTokens(user.mobileNumber);
//       if (!tokenData || !tokenData.access_token || !isMounted) {return;}

//       const handleNewMessage = async (data: any) => {
//         try {
//           const actualMessage = await decryptMessage(
//             data.chatId,
//             data.message,
//             data.nonce,
//             tokenData.access_token
//           );

//           const structuredMessage: Message = {
//             message: actualMessage,
//             sentAt: data.sentAt,
//             isSender: false,
//             status: data.status,
//           };

//           const realm = getRealmInstance();
//           addNewMessageInRealm(realm, data.chatId, structuredMessage);
//         } catch (error) {
//           console.error('Error in newMessage handler:', error);
//         }
//       };

//       const handleDelivered = (data: any) => {
//         const { receiverMobileNumber, messageIds } = data;
//         updateMessageStatusInRealm({
//           chatId: receiverMobileNumber,
//           messageIds,
//           status: MessageStatus.DELIVERED,
//         });
//       };

//       const handleRead = (data: any) => {
//         const { receiverMobileNumber, messageIds } = data;
//         updateMessageStatusInRealm({
//           chatId: receiverMobileNumber,
//           messageIds,
//           status: MessageStatus.SEEN,
//         });
//       };

//       const handleAccountDeleted = (data: any) => {
//         const { isAccountDeleted, chatId } = data;
//         updateUserAccountStatusInRealm(chatId, isAccountDeleted);
//       };

//       const handleForceLogout = () => {
//         store.dispatch(clearSuccessMessage());
//       };

//       const handleDisconnect = () => {
//         console.log('Socket disconnected:', new Date().toLocaleTimeString());
//       };

//       const handleNotification = async (data: any) => {
//         if (Platform.OS === 'ios') {
//           console.log(data);
//           await handleIncomingMessageNotification({...data, from: 'socket'});
//         }
//       };

//       socket.on('newMessage', handleNewMessage);
//       socket.on('messageDelivered', handleDelivered);
//       socket.on('messageRead', handleRead);
//       socket.on('isAccountDeleted', handleAccountDeleted);
//       socket.on('force-logout', handleForceLogout);
//       socket.on('disconnect', handleDisconnect);
//       socket.on('triggerLocalNotification', handleNotification);

//       return () => {
//         socket.off('newMessage', handleNewMessage);
//         socket.off('messageDelivered', handleDelivered);
//         socket.off('messageRead', handleRead);
//         socket.off('isAccountDeleted', handleAccountDeleted);
//         socket.off('force-logout', handleForceLogout);
//         socket.off('disconnect', handleDisconnect);
//         socket.off('triggerLocalNotification', handleNotification);

//       };
//     };

//     setupListeners();

//     return () => {
//       isMounted = false;
//     };
//   }, [dispatch, user.mobileNumber]);
// };







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

        const realm = getRealmInstance();
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

    const handleAccountDeleted = (data: any) => {
      updateUserAccountStatusInRealm(data.chatId, data.isAccountDeleted);
    };

    const handleForceLogout = () => {
      store.dispatch(clearSuccessMessage());
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
