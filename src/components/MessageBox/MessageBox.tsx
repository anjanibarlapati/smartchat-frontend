import { Image, Text, useWindowDimensions, View } from 'react-native';
import { useAppTheme } from '../../hooks/appTheme';
import { MessageProps } from '../../types/MessageProps';
import { Theme } from '../../utils/themes';
import { getStyles } from './MessageBox.styles';

 export const getTickIcon = (status: string, theme: Theme) => {
    switch (status) {
      case 'pending':
        return theme.images.pendingTick;
      case 'sent':
        return theme.images.singleTick;
      case 'delivered':
        return theme.images.doubleTick;
      case 'seen':
        return theme.images.readTick;
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
            source={getTickIcon(status, theme)}
            style={styles.tickIcon}
          />
        }
      </View>
    </View>
  );
};
