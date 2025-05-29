import {Image, TouchableOpacity, View} from 'react-native';
import {styles} from './Menu.styles';
import {ChatOptionsModal} from '../ChatOptionsModal/ChatOptionsModal';
import {useState} from 'react';
import {clearUserChat} from '../ChatOptionsModal/clearChat.service';
import {useDispatch, useSelector} from 'react-redux';
import {storeState} from '../../redux/store';
import {clearUserMessages} from '../../redux/reducers/messages.reducer';
import {useAlertModal} from '../../hooks/useAlertModal';
import { CustomAlert } from '../CustomAlert/CustomAlert';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProps } from '../../types/Navigations';

export const Menu = ({
  receiverMobileNumber,
}: {
  receiverMobileNumber: string;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
   const navigateToHomeScreen = useNavigation<HomeScreenNavigationProps>();
    const {
      alertVisible, alertMessage, alertType, showAlert, hideAlert,
    } = useAlertModal();
  const user = useSelector((state: storeState) => state.user);
  const handleClearChat = async () => {
    try {
      const response = await clearUserChat(
        user.mobileNumber,
        receiverMobileNumber,
      );
      if (response.ok) {
        dispatch(clearUserMessages({chatId: receiverMobileNumber}));
        setTimeout(()=> {
           navigateToHomeScreen.replace('Home');
        },1000);
      }
    } catch (error) {
      showAlert('Unable to Clear Chat', 'error');
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
      <CustomAlert visible={alertVisible} message={alertMessage} type={alertType} onClose={hideAlert} />
    </View>
  );
};
