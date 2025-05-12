import React from 'react';
import { Alert, Image, Modal, Pressable, Text, View } from 'react-native';
import { getStyles } from './ProfilePicturePickerModal.styles';
import { UploadImage } from '../../types/UploadImage';
import { openPhotoLibrary } from '../../utils/openPhotoLibrary';
import { openCamera } from '../../utils/openCamera';
import { Theme } from '../../utils/themes';
import { useAppTheme } from '../../hooks/appTheme';
import { ProfilePicturePickerModalProps } from '../../types/ProfilePicturePickerModalProps';


export function ProfilePicturePickerModal(props: ProfilePicturePickerModalProps): React.JSX.Element{

    const theme: Theme = useAppTheme();
    const styles = getStyles(theme);

    const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];

    const selectPicture = async() => {
        const selectedPicture = await openPhotoLibrary();
        if(selectedPicture === null) {
            Alert.alert('You do not have permissions to select the picture');
            return;
        }
        if(!validFileTypes.find(type => type === selectedPicture.mime)) {
            Alert.alert('File should be JPG/PNG/JPEG format');
            return;
        }
        props.close();
        props.setProfilePic({
            uri: selectedPicture.path,
            type: selectedPicture.mime,
            name: selectedPicture.filename,
        } as UploadImage);
    };

    const removePicture = () => {
        if(props.openedFrom === 'registration') {
            props.setProfilePic(null);
            props.close();
        }
    };

    const capturePicture = async() => {
        const selectedPicture = await openCamera();
        if(selectedPicture === null) {
            Alert.alert('You do not have permissions to select the picture');
            return;
        }
        if(!validFileTypes.find(type => type === selectedPicture.mime)) {
            Alert.alert('File should be JPG/PNG/JPEG format');
            return;
        }
        props.close();
        props.setProfilePic({
            uri: selectedPicture.path,
            type: selectedPicture.mime,
            name: selectedPicture.filename,
        } as UploadImage);
    };

    return (
        <Modal visible={props.isEditingProfilePicture} transparent={true} animationType="slide">
                <View style={styles.container}>
                    <View style={styles.body}>
                        <View style={styles.bar}><View style={styles.subBar}/></View>
                        <View style={styles.header}>
                            <Pressable onPress={props.close}>
                                <Image source={theme.images.close} style={styles.cancelIcon} accessibilityLabel="cancel-icon"/>
                            </Pressable>
                            <Text style={styles.text}>Profile Photo</Text>
                        </View>
                        <View style={styles.icons}>
                            <Pressable style={styles.iconContainer} onPress={capturePicture}>
                                <Image source={theme.images.camera} style={styles.icon} accessibilityLabel="camera-icon" />
                                <Text style={styles.iconText}>Camera</Text>
                            </Pressable>
                            <Pressable style={styles.iconContainer} onPress={selectPicture}>
                                <Image source={theme.images.gallery} style={styles.icon} accessibilityLabel="gallery-icon" />
                                <Text style={styles.iconText}>Gallery</Text>
                            </Pressable>
                            { props.profilePicture &&
                                <Pressable style={styles.iconContainer} onPress={removePicture}>
                                    <Image source={theme.images.delete} style={styles.icon} accessibilityLabel="delete-icon" />
                                    <Text style={styles.iconText}>Remove</Text>
                                </Pressable>
                            }
                        </View>
                    </View>
                </View>
        </Modal>
    );
}
