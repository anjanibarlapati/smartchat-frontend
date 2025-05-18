import {Image, Text, View} from 'react-native';
import {useAppTheme} from '../../hooks/appTheme';
import {getStyles} from './MessageBox.styles';
import { MessageProps } from '../../types/MessageProps';
import {Theme} from '../../utils/themes';



export const MessageBox = ({
  message,
  timestamp,
  status,
  isSender,
}: MessageProps) => {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme, isSender);
  const getTickIcon = () => {
    switch (status) {
      case 'sent':
        return (
          <Image
            accessibilityLabel="sent-tick-icon"
            source={require('../../../assets/images/singleTick.png')}
            style={styles.tickIcon}
          />
        );
      case 'delivered':
        return (
          <Image
            accessibilityLabel="delivered-tick-icon"
            source={require('../../../assets/images/doubleTick.png')}
            style={styles.tickIcon}
          />
        );
      case 'read':
        return (
          <Image
            accessibilityLabel="read-tick-icon"
            source={require('../../../assets/images/readTick.png')}
            style={styles.tickIcon}
          />
        );
    }
  };

  return (
    <View
      style={[
        styles.container,
        isSender ? styles.senderContainer : styles.receiverContainer,
      ]}>
      <Text style={styles.messageText}>{message}</Text>
      <View style={styles.footer}>
        <Text style={styles.timeText}>{timestamp}</Text>
        {isSender && getTickIcon()}
      </View>
    </View>
  );
};
