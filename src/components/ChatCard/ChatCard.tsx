import {Image, Text, View} from 'react-native';
import {useAppTheme} from '../../hooks/appTheme';
import {Theme} from '../../utils/themes';
import {getStyles} from './ChatCard.styles';
import {Badge} from '../Badge/Badge';
import {ChatCardProps} from '../../types/Chat';

export const ChatCard = ({
  name,
  message,
  time,
  unreadCount = 0,
  profileImage,
}: ChatCardProps): React.JSX.Element => {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme, unreadCount);

  return (
    <View style={styles.cardContainer}>
      <Image
        style={styles.profileImage}
        source={
          profileImage || require('../../../assets/images/profileImage.png')
        }
        accessibilityLabel="profile-image"
      />
      <View style={styles.chatContent}>
        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.personName}>
            {name}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.latestMessage}>
            {message}
          </Text>
        </View>
        <View style={styles.badgeTimeContainer}>
          <Text style={styles.timeText}>{time}</Text>

          {unreadCount > 0 && (
            <View style={styles.badgeWrapper}>
              <Badge value={String(unreadCount)} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
