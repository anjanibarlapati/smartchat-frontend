import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useAppTheme} from '../../hooks/appTheme';
import {storeState} from '../../redux/store';
import {ChatCardProps} from '../../types/Chat';
import {HomeScreenNavigationProps} from '../../types/Navigations';
import {Theme} from '../../utils/themes';
import {Badge} from '../Badge/Badge';
import {getTickIcon} from '../MessageBox/MessageBox';
import {ProfilePictureViewerModal} from '../ProfilePictureViewer/PofilePictureViewer';
import {TimeStamp} from '../TimeStamp/TimeStamp';
import {getStyles} from './ChatCard.styles';

export const ChatCard = ({
  contact,
  message,
  unreadCount = 0,
}: ChatCardProps): React.JSX.Element => {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<HomeScreenNavigationProps>();
  const user = useSelector((state: storeState) => state.user);

  const [modalVisible, setModalVisible] = useState(false);

  const profileImageUri = contact.profilePicture
    ? {uri: contact.profilePicture}
    : require('../../../assets/images/profileImage.png');

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          style={styles.profileImage}
          source={profileImageUri}
          accessibilityLabel="profile-image"
        />
      </TouchableOpacity>
      <ProfilePictureViewerModal
        visible={modalVisible}
        imageSource={profileImageUri}
        name={contact.name}
        onClose={() => setModalVisible(false)}
      />
      <TouchableOpacity
        style={styles.chatContent}
        onPress={() =>
          navigation.navigate('IndividualChat', {
            name: contact.name,
            originalNumber: contact.originalNumber,
            mobileNumber: contact.mobileNumber,
            profilePic: contact.profilePicture,
          })
        }>
        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.personName}>
            {`${contact.name}${
              contact.mobileNumber === user.mobileNumber ? ' (You)' : ''
            }`}
          </Text>
          <TimeStamp
            from="chat-card"
            date={message.sentAt}
            isUnreadChat={unreadCount > 0}
          />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.messageContainer}>
            {message.isSender && (
              <Image
                accessibilityLabel="tick-icon"
                source={getTickIcon(message.status, theme)}
                style={styles.tickIcon}
              />
            )}
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.latestMessage}>
              {message.message}
            </Text>
          </View>
          {unreadCount > 0 && <Badge value={String(unreadCount)} size="big" />}
        </View>
      </TouchableOpacity>
    </View>
  );
};
