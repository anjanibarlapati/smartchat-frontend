import React from 'react';
import {Text, View} from 'react-native';
import {Badgestyles} from './Badge.styles';
import {Theme} from '../../utils/themes';
import {useAppTheme} from '../../hooks/appTheme';

type BadgeProps = {
  value?: string;
};

export function Badge({value}: BadgeProps) {
  const theme: Theme = useAppTheme();
  const styles = Badgestyles(theme);
  if (!value) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}
