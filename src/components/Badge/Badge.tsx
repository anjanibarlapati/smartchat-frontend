import React from 'react';
import {Text, View} from 'react-native';
import {Badgestyles} from './Badge.styles';
import {Theme} from '../../utils/themes';
import {useAppTheme} from '../../hooks/appTheme';

type BadgeProps = {
  value?: string;
  size: 'small' | 'big'
};

export function Badge({value, size}: BadgeProps) {
  const theme: Theme = useAppTheme();
  const styles = Badgestyles(theme);
  if (!value) {
    return null;
  }
  return (
    <View style={size === 'big' ? styles.container : styles.smallContainer}>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}
