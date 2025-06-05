import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useAppTheme} from '../../hooks/appTheme';
import {Theme} from '../../utils/themes';
import {getStyles} from './ChatCard.styles';
import {Badge} from '../Badge/Badge';
import {ChatCardProps} from '../../types/Chat';
import { getTickIcon } from '../MessageBox/MessageBox';
import { TimeStamp } from '../TimeStamp/TimeStamp';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProps } from '../../types/Navigations';

export const ChatCard = ({
  contact,
  message,
  unreadCount = 0,
}: ChatCardProps): React.JSX.Element => {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme, unreadCount);
  const navigation = useNavigation<HomeScreenNavigationProps>();

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={()=>navigation.replace('IndividualChat', {name: contact.name, originalNumber: contact.originalNumber, mobileNumber: contact.mobileNumber, profilePic: contact.profilePicture})}>
      <Image
            style={styles.profileImage}
            source={
              contact.profilePicture || require('../../../assets/images/profileImage.png')
            }
            accessibilityLabel="profile-image"
      />
      <View style={styles.chatContent}>
        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.personName}>
            {contact.name}
          </Text>
          <TimeStamp from="chat-card" date={message.sentAt}/>
        </View>
        <View style={styles.textContainer}>
            <View style={styles.messageContainer}>
              {message.isSender && <Image
                  accessibilityLabel="tick-icon"
                  source={getTickIcon(message.status)}
                  style={styles.tickIcon}
              />}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.latestMessage}>
                {message.message}
              </Text>
            </View>
            {unreadCount > 0 &&
              <Badge value={String(unreadCount)} size="big"/>
            }
        </View>
      </View>
    </TouchableOpacity>
  );
};
