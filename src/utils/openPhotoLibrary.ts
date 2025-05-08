import ImagePicker from 'react-native-image-crop-picker';
import { requestPermission } from '../permissions/permissions';

export const openPhotoLibrary = async() => {
    const isPermissionGranted = await requestPermission('media');
    if(!isPermissionGranted) {
        return null;
    }
    const image = await ImagePicker.openPicker({
        mediaType:'photo',
        cropping: true,
        freeStyleCropEnabled: true,
    });
    return image;
};
