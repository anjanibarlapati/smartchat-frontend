import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useAlertModal } from '../../hooks/useAlertModal';
import { storeState } from '../../redux/store';
import { HomeScreenNavigationProps } from '../../types/Navigations';
import { blockUserChat } from '../ChatOptionsModal/blockChat.service';
import { ChatOptionsModal } from '../ChatOptionsModal/ChatOptionsModal';
import { clearUserChat } from '../ChatOptionsModal/clearChat.service';
import { CustomAlert } from '../CustomAlert/CustomAlert';
import { styles } from './Menu.styles';
import { clearChatInRealm } from '../../realm-database/operations/clearChat';
import { useRealm } from '../../contexts/RealmContext';

export const Menu = ({
  receiverMobileNumber,
}: {
  receiverMobileNumber: string;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
   const navigateToHomeScreen = useNavigation<HomeScreenNavigationProps>();
    const {
      alertVisible, alertMessage, alertType, showAlert, hideAlert,
    } = useAlertModal();
  const user = useSelector((state: storeState) => state.user);
  const realm = useRealm();
  const handleClearChat = async () => {
    try {
      const response = await clearUserChat(
        user.mobileNumber,
        receiverMobileNumber,
      );
      if (response.ok) {
        clearChatInRealm(realm, receiverMobileNumber);
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

  const handleBlock = async () => {
    setIsModalVisible(false);
    try {
      const response = await blockUserChat({
        senderMobileNumber: user.mobileNumber,
        receiverMobileNumber,
      });
      if (response.ok) {
        showAlert('User has been blocked successfully', 'info');

      }else{
        const result = await response.json();
        showAlert(result.message,'warning');
      }
    } catch (error) {
      showAlert(
        'Something went wrong please try again', 'error'
      );
    }
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
