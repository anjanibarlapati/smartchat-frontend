import ImagePicker from 'react-native-image-crop-picker';
import { requestPermission } from '../permissions/permissions';

export const openCamera = async() => {
    const isPermissionGranted = await requestPermission('camera');
    if(!isPermissionGranted) {
        return null;
    }
    const image = await ImagePicker.openCamera({
        mediaType:'photo',
        cropping: true,
        freeStyleCropEnabled: true,
    });
    return image;
};
