import { useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Image, ImageSourcePropType, Text, TextInput, TouchableOpacity, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '../../hooks/appTheme';
import { useAlertModal } from '../../hooks/useAlertModal';
import { setUserProperty } from '../../redux/reducers/user.reducer';
import { storeState } from '../../redux/store';
import { updateProfileDetails } from '../../screens/Profile/Profile.services';
import { RootStackParamList } from '../../types/Navigations';
import { User } from '../../types/User';
import { getTokens } from '../../utils/getTokens';
import { Properties } from '../../utils/Properties';
import { Theme } from '../../utils/themes';
import { CustomizableAlert } from '../Alert/CustomizableAlert';
import { getStyles } from './ProfileInfoTile.styles';
interface ProfileInfoTileProps {
  label: string;
  value: string;
  image: ImageSourcePropType;
  editField: string;
  setEditField: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProfileInfoTile = (props: ProfileInfoTileProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const userDetails = useSelector((state: storeState) => state.user);
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const dispatch = useDispatch();
  const {
      alertVisible, alertMessage, alertType, showAlert, hideAlert,
    } = useAlertModal();
  const [newValue, setValue] = useState('');
  const isEdit = props.editField === props.label;
  const setLoading = props.setLoading;

  const updateDetails = async() => {
    if(!newValue.trim() || newValue.trim() === props.value) {
      showAlert('Please give a different value', 'info');
      return;
    }
    if(props.label === 'Email' && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(newValue)) {
      showAlert('Invalid email format', 'warning');
      setValue('');
      return;
    }
    const field = Properties[
      props.label as keyof typeof Properties
    ] as keyof User;
    const tokens = await getTokens(userDetails.mobileNumber);
    if (!tokens) {
      await EncryptedStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{name: 'WelcomeScreen'}],
      });
      return;
    }
    try {
      setLoading(true);
      const response = await updateProfileDetails(
        field,
        newValue,
        userDetails.mobileNumber,
        tokens.access_token,
      );
      if (response.ok) {
        const updatedUser = {
          ...userDetails,
          [field]: newValue,
        };
        dispatch(
          setUserProperty({
            property: field,
            value: newValue,
          }),
        );
        await EncryptedStorage.setItem(
          'User Data',
          JSON.stringify(updatedUser),
        );
        if(props.label === 'Change Password') {
          showAlert('Updated password successfully', 'success');
        } else {
          showAlert(`Updated ${props.label.toLowerCase()} successfully`, 'success');
        }
      }
      props.setEditField('');
    } catch (error) {
        showAlert('Something went wrong while updating. Please try again', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.box}>
      <Image
        source={props.image}
        resizeMode="contain"
        style={styles.image}
        accessibilityLabel={props.label}
      />
      <View style={styles.fieldBox}>
        <View style={styles.detailBox}>
          <Text style={styles.headerText}>{props.label}</Text>
          {!isEdit ? (
            <Text
              style={styles.valueText}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {props.value}
            </Text>
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
                <TouchableOpacity
                  onPress={() => {
                    updateDetails();
                  }}>
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
        {props.label !== 'Contact' && !isEdit && (
          <TouchableOpacity
            onPress={() => {
              props.setEditField(props.label);
              setValue('');
            }}>
            <Image
              source={require('../../../assets/icons/edit-text-icon.png')}
              style={styles.editTextIcon}
              accessibilityLabel="edit-text"
            />
          </TouchableOpacity>
        )}
      </View>
      <CustomizableAlert visible={alertVisible} message={alertMessage} type={alertType} onClose={hideAlert} />
    </View>
  );
};
