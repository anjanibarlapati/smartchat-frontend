import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {styles} from './SendButton.styles';

export function SendButton() {
  return (
    <View>
      <TouchableOpacity>
        <Image
          source={require('../../../assets/icons/send.png')}
          style={styles.sendButtonIcon}
        />
      </TouchableOpacity>
    </View>
  );
}
