import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useSelector } from 'react-redux';
import { useRealmReset } from '../../contexts/RealmContext';
import { useAppTheme } from '../../hooks/appTheme';
import { useAlertModal } from '../../hooks/useAlertModal';
import { storeState } from '../../redux/store';
import { updatePassword } from '../../screens/Profile/Profile.services';
import { getTokens } from '../../utils/getTokens';
import { Theme } from '../../utils/themes';
import { CustomAlert } from '../CustomAlert/CustomAlert';
import { getStyles } from './ChangePasswordModal.styles';
import { EyeIcon } from '../EyeIcon/EyeIcon';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
}) => {

  const { width, height } = useWindowDimensions();
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme, width, height);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [errors, setErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    allFields?: string;
  }>({});
  const {alertVisible, alertMessage, alertType, showAlert, hideAlert} = useAlertModal();
  const {resetRealm} = useRealmReset();

  const userDetails = useSelector((state: storeState) => state.user);

  const handleSave = async () => {
    const newErrors: typeof errors = {};

    const allFieldsEmpty =
      !oldPassword.trim() && !newPassword.trim() && !confirmPassword.trim();

    if (allFieldsEmpty) {
      setErrors({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        allFields: 'All fields are required',
      });
      return;
    }

    if (!oldPassword) {
      newErrors.oldPassword = 'Old password is required';
    }
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        newErrors.newPassword =
          'Must be at least 8 characters, include uppercase, lowercase, number, and at least one special character';
      }
    }
    if (!newErrors.newPassword) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onClose();
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});

    try {
      const tokens = await getTokens(userDetails.mobileNumber);
      if (!tokens) {
        await EncryptedStorage.clear();
        resetRealm();
        return;
      }
      const response = await updatePassword(
        userDetails.mobileNumber,
        oldPassword,
        newPassword,
        tokens.access_token,
      );

      if (response.ok) {
        showAlert('Updated password successfully', 'success');
        onClose();
        handleClose();
      } else if (response.status === 400) {
        showAlert('Please give a different value', 'info');
      } else if (response.status === 401) {
        showAlert('Old password is incorrect', 'error');
      } else {
        const result = await response.json();
        showAlert(result.message || 'Failed to update password. Please try again later', 'error');
      }
    } catch (error) {
      showAlert('Something went wrong. Please try again later', 'error');
    }
  };

  const handleClose = () => {
    setErrors({});
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <>
      <Modal
      accessibilityLabel="change-password-modal"
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Change Password</Text>
            {errors.allFields ? (
              <Text style={styles.allFields}>{errors.allFields}</Text>
            ) : null}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Old Password"
                placeholderTextColor={theme.changePasswordModalPlaceholderColor}
                style={styles.input}
                secureTextEntry={!showOldPassword}
                value={oldPassword}
                onChangeText={text => {
                  setOldPassword(text);
                  if (errors.oldPassword || errors.allFields) {
                    setErrors(prev => ({
                      ...prev,
                      oldPassword: '',
                      allFields: '',
                    }));
                  }
                }}
              />
              <EyeIcon showPassword={showOldPassword} togglePasswordVisibility={()=>setShowOldPassword(prev => !prev)}/>
            </View>
            {errors.oldPassword && (
              <Text style={styles.error}>{errors.oldPassword}</Text>
            )}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="New Password"
                placeholderTextColor={theme.changePasswordModalPlaceholderColor}
                style={styles.input}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={text => {
                  setNewPassword(text);
                  if (errors.newPassword || errors.allFields) {
                    setErrors(prev => ({
                      ...prev,
                      newPassword: '',
                      allFields: '',
                    }));
                  }
                }}
              />
              <EyeIcon showPassword={showNewPassword} togglePasswordVisibility={()=>setShowNewPassword(prev => !prev)}/>
            </View>
            {errors.newPassword && (
              <Text style={styles.error}>{errors.newPassword}</Text>
            )}

            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={theme.changePasswordModalPlaceholderColor}
              style={styles.confirmPasswordinput}
              secureTextEntry
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                if (errors.confirmPassword || errors.allFields) {
                  setErrors(prev => ({
                    ...prev,
                    confirmPassword: '',
                    allFields: '',
                  }));
                }
              }}
            />

            {errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={hideAlert}
      />
    </>
  );
};
