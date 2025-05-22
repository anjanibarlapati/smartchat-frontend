import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useAppTheme} from '../../hooks/appTheme';
import {addMessage, Message} from '../../redux/reducers/messages.reducer';
import {storeState} from '../../redux/store';
import {normalizeNumber} from '../../utils/getContactsDetails';
import {Theme} from '../../utils/themes';
import {sendMessage} from './SendButton.service';
import {styles} from './SendButton.styles';

const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

interface SendButtonProps {
  receiverMobileNumber: string;
  message: string;
  onSend: () => void;
}

export function SendButton({
  receiverMobileNumber,
  message,
  onSend,
}: SendButtonProps) {
  const theme: Theme = useAppTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: storeState) => state.user);

  const handleSend = async () => {
    if (message.trim() === '') {
      return;
    }
    const normalizedmobileNumber: any = normalizeNumber(receiverMobileNumber);
    const msg: Message = {
      id: generateId(),
      sender: user.mobileNumber,
      receiver: normalizedmobileNumber,
      message,
      sentAt: new Date().toISOString(),
      isSender: true,
      status: 'sent',
    };

    dispatch(addMessage({chatId: normalizedmobileNumber, message: msg}));
    onSend();

    try {
      await sendMessage(user.mobileNumber, receiverMobileNumber, message);
    } catch (error) {
      throw new Error('unable to encrypt message');
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleSend}>
        <Image
          source={theme.images.send}
          style={styles.sendButtonIcon}
          accessibilityLabel="send-icon"
        />
      </TouchableOpacity>
    </View>
  );
}
