import { Image, Modal, Pressable, Text, View } from 'react-native';
import React from 'react';
import { styles } from './ProfilePicturePickerModal.styles';


interface ProfilePicturePickerModalProps {
    isEditingProfilePicture: boolean;
    close: () => void;
    profilePicture: string,
    openedFrom: 'registration' | 'profile';
}

export function ProfilePicutrePickerModal(props: ProfilePicturePickerModalProps): React.JSX.Element{

    return (
        <Modal visible={props.isEditingProfilePicture} transparent={true} animationType="slide">
                <View style={styles.container}>
                    <View style={styles.body}>
                        <View style={styles.bar}><View style={styles.subBar}/></View>
                        <View style={styles.header}>
                            <Pressable onPress={props.close}>
                                <Image source={require('../../../assets/icons/close-icon.png')} style={styles.cancelIcon} accessibilityLabel="cancel-icon"/>
                            </Pressable>
                            <Text style={styles.text}>Profile Photo</Text>
                        </View>
                        <View style={styles.icons}>
                            <View style={styles.iconContainer}>
                                <Image source={require('../../../assets/icons/camera-icon.png')} style={styles.icon} accessibilityLabel="camera-icon" />
                                <Text style={styles.iconText}>Camera</Text>
                            </View>
                            <View style={styles.iconContainer}>
                                <Image source={require('../../../assets/icons/gallery-icon.png')} style={styles.icon} accessibilityLabel="gallery-icon" />
                                <Text style={styles.iconText}>Gallery</Text>
                            </View>
                            { props.profilePicture &&
                                <View style={styles.iconContainer}>
                                    <Image source={require('../../../assets/icons/delete-icon.png')} style={styles.icon} accessibilityLabel="delete-icon" />
                                    <Text style={styles.iconText}>Remove</Text>
                                </View>
                            }
                    </View>
                    </View>
                </View>
        </Modal>
    );
}
