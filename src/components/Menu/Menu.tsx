import {Image, TouchableOpacity, View} from 'react-native';
import {styles} from './Menu.styles';
import {ChatOptionsModal} from '../ChatOptionsModal/ChatOptionsModal';
import {useState} from 'react';
import {clearUserChat} from '../ChatOptionsModal/clearChat.service';
import {useDispatch, useSelector} from 'react-redux';
import {storeState} from '../../redux/store';
import {clearUserMessages} from '../../redux/reducers/messages.reducer';
import {useAlertModal} from '../../hooks/useAlertModal';

export const Menu = ({
  receiverMobileNumber,
}: {
  receiverMobileNumber: string;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const {showAlert} = useAlertModal();
  const user = useSelector((state: storeState) => state.user);
  const handleClearChat = async () => {
    try {
      const response = await clearUserChat(
        user.mobileNumber,
        receiverMobileNumber,
      );
      if (response.ok) {
        dispatch(clearUserMessages({chatId: receiverMobileNumber}));
      }
    } catch (error) {
      showAlert('Something went wrong. Please try again', 'error');
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleBlock = () => {
    setIsModalVisible(false);
  };
  return (
    <View>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Image
          source={require('../../../assets/icons/menu.png')}
          style={styles.menuIcon}
          accessibilityLabel="Menu-Image"
        />
      </TouchableOpacity>
      <ChatOptionsModal
        visible={isModalVisible}
        onClearChat={handleClearChat}
        onBlock={handleBlock}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};
