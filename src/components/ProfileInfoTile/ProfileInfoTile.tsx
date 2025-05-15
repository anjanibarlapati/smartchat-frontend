import { useState } from 'react';
import { Alert, Image, ImageSourcePropType, Text, TextInput, TouchableOpacity, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '../../hooks/appTheme';
import { getStyles } from './ProfileInfoTile.styles';
import { storeState } from '../../redux/store';
import { setUserProperty } from '../../redux/userReducer';
import { updateProfileDetails } from '../../screens/Profile/Profile.handler';
import { User } from '../../types/User';
import { getTokens } from '../../utils/getTokens';
import { Properties } from '../../utils/Properties';
import { Theme } from '../../utils/themes';
interface ProfileInfoTileProps {
  label: string;
  value: string;
  image: ImageSourcePropType;
  editField: string;
  setEditField: React.Dispatch<React.SetStateAction<string>>;
}

export const ProfileInfoTile = (props: ProfileInfoTileProps) => {

  const userDetails = useSelector((state: storeState) => state.user);
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const dispatch = useDispatch();
  const [newValue, setValue] = useState('');
  const isEdit = props.editField === props.label;

  const updateDetails = async() => {
    if(!newValue.trim() || newValue.trim() === props.value) {
      Alert.alert('Give appropriate value');
      return;
    }
    if(props.label === 'Email' && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(newValue)) {
      Alert.alert('Invalid email format');
      setValue('');
      return;
    }
    const field = Properties[props.label as keyof typeof Properties] as keyof User;
    const tokens = await getTokens(userDetails.mobileNumber);
    console.log(tokens);
    if(!tokens) {
      Alert.alert('Invalid Access tokens');
      setValue('');
      return;
    }
    const response = await updateProfileDetails(field, newValue, userDetails.mobileNumber, tokens.access_token);
    console.log(response);
    if(response.ok) {
      const updatedUser = {
          ...userDetails,
          [field]: newValue,
      };
      dispatch(setUserProperty({
          property: field,
          value: newValue,
      }));
      await EncryptedStorage.setItem('User Data', JSON.stringify(updatedUser));
    }
    props.setEditField('');
  };

  return (
    <View style={styles.box}>
      <Image source={props.image} resizeMode="contain" style={styles.image} accessibilityLabel={props.label} />
      <View style={styles.detailBox}>
        <Text style={styles.headerText}>{props.label}</Text>
        {!isEdit ? (
          <TouchableOpacity
            onPress={() => {
              if (props.label !== 'Contact') {
                props.setEditField(props.label);
                setValue('');
              }
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
              <TouchableOpacity onPress={() => {updateDetails();}}>
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
                  props.setEditField('');
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
