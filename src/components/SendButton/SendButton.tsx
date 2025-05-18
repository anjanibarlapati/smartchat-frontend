import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {styles} from './SendButton.styles';
import { Theme } from '../../utils/themes';
import { useAppTheme } from '../../hooks/appTheme';

export function SendButton() {
  const theme: Theme = useAppTheme();
  return (
    <View>
      <TouchableOpacity>
        <Image
          source={theme.images.send}
          style={styles.sendButtonIcon}
          accessibilityLabel="send-icon"
        />
      </TouchableOpacity>
    </View>
  );
}
