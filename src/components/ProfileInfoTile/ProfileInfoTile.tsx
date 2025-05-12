import { useState } from 'react';
import { Image, ImageSourcePropType, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../hooks/appTheme';
import { getStyles } from './ProfileInfoTile.styles';
import { Theme } from '../../utils/themes';

interface ProfileInfoTileProps {
  label: string;
  value: string;
  image: ImageSourcePropType;
}

export const ProfileInfoTile = (props: ProfileInfoTileProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newValue, setValue] = useState('');
  const theme: Theme = useAppTheme();
    const styles = getStyles(theme);

  return (
    <View style={styles.box}>
      <Image source={props.image} resizeMode="contain" style={styles.image} accessibilityLabel={props.label} />
      <View style={styles.detailBox}>
        <Text style={styles.headerText}>{props.label}</Text>
        {!isEdit ? (
          <TouchableOpacity
            onPress={() => {
              props.label !== 'Contact' && setIsEdit(true);
            }}>
            <Text style={styles.valueText}>{props.value}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editTileBox}>
            <TextInput
              value={newValue}
              onChangeText={value => {
                setValue(value);
              }}
              placeholder={props.value}
              style={styles.inputBox}
            />
            <View style={styles.statusBox}>
              <TouchableOpacity>
                <Image
                  source={require('../../../assets/icons/tick.png')}
                  resizeMode="contain"
                  style={styles.tickImage}
                  accessibilityLabel="edit"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setValue('');
                  setIsEdit(false);
                }}>
                <Image
                  source={require('../../../assets/icons/close.png')}
                  resizeMode="contain"
                  style={styles.closeImage}
                  accessibilityLabel="cancel"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
