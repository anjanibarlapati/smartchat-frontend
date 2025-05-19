import {Image, TouchableOpacity, View} from 'react-native';
import {styles} from './Menu.styles';
import {ChatOptionsModal} from '../ChatOptionsModal/ChatOptionsModal';
import {useState} from 'react';

export const Menu = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClearChat = () => {
    setIsModalVisible(false);
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
