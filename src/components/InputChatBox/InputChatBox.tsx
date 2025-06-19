
import NetInfo from '@react-native-community/netinfo';
import React, {useState} from 'react';
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useRealm} from '../../contexts/RealmContext';
import {useAppTheme} from '../../hooks/appTheme';
import {useAlertModal} from '../../hooks/useAlertModal';
import {addNewMessageInRealm} from '../../realm-database/operations/addNewMessage';
import {storeState} from '../../redux/store';
import {Message, MessageStatus} from '../../types/message';
import {Theme} from '../../utils/themes';
import {CustomAlert} from '../CustomAlert/CustomAlert';
import {sendMessage} from './InputChatBox.service';
import {ChatInputStyles} from './InputChatBox.styles';

export function InputChatBox({
  receiverMobileNumber,
}: {
  receiverMobileNumber: string;
}) {
  const theme: Theme = useAppTheme();
  const styles = ChatInputStyles(theme);
  const [message, setMessage] = useState('');
  const user = useSelector((state: storeState) => state.user);
  const {alertVisible, alertMessage, alertType, showAlert, hideAlert} =
    useAlertModal();
  const realm = useRealm();

  const handleSend = async () => {
    try {
        const trimmedMessage = message.trim();
        if (!trimmedMessage){return;}

        const sentAt = new Date().toISOString();
        const netState = await NetInfo.fetch();
        const isSelfChat = receiverMobileNumber === user.mobileNumber;
        const isConnected = netState.isConnected ? netState.isConnected : false;

        const status: MessageStatus = isConnected ? isSelfChat ? MessageStatus.SEEN : MessageStatus.SENT : MessageStatus.PENDING;

        const newMessage: Message = {
          message: trimmedMessage,
          sentAt,
          isSender: true,
          status,
        };
        addNewMessageInRealm(realm, receiverMobileNumber, newMessage);
        if (isConnected){
          sendMessage(
            user.mobileNumber,
            receiverMobileNumber,
            newMessage.message,
            sentAt,
          );
        }
    } catch (error) {
      showAlert('Unable to send message', 'error');
    } finally {
      setMessage('');
    }
  };

  return (
    <View>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
            scrollEnabled={true}
            placeholderTextColor={theme.placeholderTextColor}
          />
        </View>
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Image
            source={theme.images.send}
            style={styles.sendButtonIcon}
            accessibilityLabel="send-icon"
          />
        </TouchableOpacity>
      </View>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={hideAlert}
      />
    </View>
  );
}
