import { Image, Text, useWindowDimensions, View } from 'react-native';
import { useAppTheme } from '../../hooks/appTheme';
import { MessageProps } from '../../types/MessageProps';
import { Theme } from '../../utils/themes';
import { getStyles } from './MessageBox.styles';

 export const getTickIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return require('../../../assets/images/singleTick.png');
      case 'delivered':
        return require('../../../assets/images/doubleTick.png');
      case 'seen':
        return require('../../../assets/images/readTick.png');
      case 'pending':
        return require('../../../assets/images/pending.png');
    }
  };

export const MessageBox = ({
  message,
  timestamp,
  status,
  isSender,
}: MessageProps) => {

  const {width, height} = useWindowDimensions();
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme, width, height, isSender);

  return (
    <View
      style={[
        styles.container,
        isSender ? styles.senderContainer : styles.receiverContainer,
      ]} accessibilityLabel="messageBox-container">
      <Text style={styles.messageText}>{message}</Text>
      <View style={styles.footer}>
        <Text style={styles.timeText}>{timestamp}</Text>
        {isSender &&
          <Image
            accessibilityLabel="tick-icon"
            source={getTickIcon(status)}
            style={styles.tickIcon}
          />
        }
      </View>
    </View>
  );
};
