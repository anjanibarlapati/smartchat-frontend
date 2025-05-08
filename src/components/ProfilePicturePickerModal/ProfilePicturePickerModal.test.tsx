import { Alert } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { ProfilePicturePickerModal } from './ProfilePicturePickerModal';
import { UploadImage } from '../../types/UploadImage';
import * as CameraUtil from '../../utils/openCamera';
import * as GalleryUtil from '../../utils/openPhotoLibrary';

const handleClose = jest.fn(() => {});

jest.mock('../../utils/openCamera', () => ({
    openCamera: jest.fn(),
}));

jest.mock('../../utils/openPhotoLibrary', () => ({
    openPhotoLibrary: jest.fn(),
}));

const renderModal = (isEditing:boolean, close: ()=>void, profilePicture:string, setProfilePic: React.Dispatch<React.SetStateAction<string | UploadImage | null>>, openedFrom: 'registration' | 'profile') => {
    return render(
      <ProfilePicturePickerModal isEditingProfilePicture={isEditing} close={close} profilePicture={profilePicture} openedFrom={openedFrom} setProfilePic={setProfilePic}/>
    );
  };

describe('Profile Picture Picker Modal', ()=> {
    const setProfilePic = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    });

    test('Should render elements correctly', ()=> {
        const { getByText, getByLabelText} = renderModal(true, handleClose, '/image.jpg', setProfilePic, 'registration');
        expect(getByText('Profile Photo')).toBeTruthy();
        expect(getByLabelText('cancel-icon')).toBeTruthy();
        expect(getByLabelText('camera-icon')).toBeTruthy();
        expect(getByLabelText('gallery-icon')).toBeTruthy();
        expect(getByLabelText('delete-icon')).toBeTruthy();
        expect(getByText('Camera')).toBeTruthy();
        expect(getByText('Gallery')).toBeTruthy();
        expect(getByText('Remove')).toBeTruthy();
    });

    test('Should hide delete icon when profile picture is not there', () => {
        const { queryByLabelText, queryByText} = renderModal(true, handleClose, '', setProfilePic, 'registration');
        expect(queryByLabelText('delete-icon')).toBeNull();
        expect(queryByText('Remove')).toBeNull();
    });

    test('Should close modal when isEditingProfilePicture is false', () => {
        const { queryByLabelText} = renderModal(false, handleClose, '', setProfilePic, 'registration');
        expect(queryByLabelText('Profile Photo')).toBeNull();
    });

    test('Should click on close icon', () => {
        const { getByLabelText } = renderModal(true, handleClose, '', setProfilePic, 'registration');
        fireEvent.press(getByLabelText('cancel-icon'));
        expect(handleClose).toHaveBeenCalled();
    });

    test('Should capture the picture from camera', async() => {
        (CameraUtil.openCamera as jest.Mock).mockResolvedValue({
            path: 'src/cameraPicture.jpg',
            mime: 'image/jpeg',
            filename: 'cameraPicture.jpg',
        });
        const { getByLabelText } = renderModal(true, handleClose, '', setProfilePic, 'registration');
        fireEvent.press(getByLabelText('camera-icon'));
        expect(CameraUtil.openCamera).toHaveBeenCalled();
        await waitFor(() => {
            expect(setProfilePic).toHaveBeenCalledWith({
                uri: 'src/cameraPicture.jpg',
                type: 'image/jpeg',
                name: 'cameraPicture.jpg',
            });
        });
    });

    test('Should select picture from the gallery', async() => {
        (GalleryUtil.openPhotoLibrary as jest.Mock).mockResolvedValue({
            path: 'src/pic.jpg',
            mime: 'image/jpeg',
            filename: 'pic.jpg',
        });
        const { getByLabelText } = renderModal(true, handleClose, '', setProfilePic, 'registration');
        fireEvent.press(getByLabelText('gallery-icon'));
        expect(GalleryUtil.openPhotoLibrary).toHaveBeenCalled();
        await waitFor(() => {
            expect(setProfilePic).toHaveBeenCalledWith({
                uri: 'src/pic.jpg',
                type: 'image/jpeg',
                name: 'pic.jpg',
            });
        });
    });

    test('Should remove picture when remove button is clicked', () => {
        const { getByLabelText } = renderModal(true, handleClose, '/image.jpg', setProfilePic, 'registration');
        fireEvent.press(getByLabelText('delete-icon'));
        expect(setProfilePic).toHaveBeenCalledWith(null);
    });

    test('Should show alert when permissions are denied for camera', async () => {
        (CameraUtil.openCamera as jest.Mock).mockResolvedValue(null);
        const { getByLabelText } = renderModal(true, handleClose, '', setProfilePic, 'registration');
        fireEvent.press(getByLabelText('camera-icon'));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('You do not have permissions to select the picture');
        });
    });

    test('Should show alert when permissions are denied for gallery', async () => {
        (GalleryUtil.openPhotoLibrary as jest.Mock).mockResolvedValue(null);
        const { getByLabelText } = renderModal(true, handleClose, '', setProfilePic, 'registration');
        fireEvent.press(getByLabelText('gallery-icon'));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('You do not have permissions to select the picture');
        });
    });

    test('Should show alert when invalid file type is selected from camera', async () => {
        (CameraUtil.openCamera as jest.Mock).mockResolvedValue({
            path: 'invalid-file.txt',
            mime: 'text/plain',
            filename: 'invalid-file.txt',
        });
        const { getByLabelText } = renderModal(true, handleClose, '', setProfilePic, 'registration');
        fireEvent.press(getByLabelText('camera-icon'));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('File should be JPG/PNG/JPEG format');
        });
    });

    test('Should show alert when invalid file type is selected from gallery', async () => {
        (GalleryUtil.openPhotoLibrary as jest.Mock).mockResolvedValue({
            path: 'invalid-file.txt',
            mime: 'text/plain',
            filename: 'invalid-file.txt',
        });
        const { getByLabelText } = renderModal(true, handleClose, '', setProfilePic, 'registration');
        fireEvent.press(getByLabelText('gallery-icon'));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('File should be JPG/PNG/JPEG format');
        });
    });
});
