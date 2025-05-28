import { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useAlertModal } from '../../hooks/useAlertModal';
import { storeState } from '../../redux/store';
import { blockUserChat } from '../ChatOptionsModal/blockChat.service';
import { ChatOptionsModal } from '../ChatOptionsModal/ChatOptionsModal';
import { CustomeAlert } from '../CustomAlert/CustomAlert';
import { styles } from './Menu.styles';

type MenuProps = {
  senderMobileNumber: string;
  receiverMobileNumber: string;
};
export const Menu = ({
  senderMobileNumber: _senderMobileNumber,
  receiverMobileNumber,
}: MenuProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {showAlert, alertVisible, alertType, alertMessage, hideAlert} = useAlertModal();
  const user = useSelector((state: storeState) => state.user);

  const handleClearChat = () => {
    setIsModalVisible(false);
  };

  const handleBlock = async () => {
    setIsModalVisible(false);
    try {
      const response = await blockUserChat({
        senderMobileNumber: user.mobileNumber,
        receiverMobileNumber,
      });
      console.log(response);
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
      <CustomeAlert visible={alertVisible} message={alertMessage} onClose={hideAlert} type={alertType}/>
    </View>
  );
};
