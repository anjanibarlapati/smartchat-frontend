import { Alert } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { ProfilePicturePickerModal } from './ProfilePicturePickerModal';
import { UploadImage } from '../../types/UploadImage';
import * as CameraUtil from '../../utils/openCamera';
import * as GalleryUtil from '../../utils/openPhotoLibrary';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

const handleClose = jest.fn(() => {});
const handleRemove = jest.fn(() => {});

jest.mock('../../utils/openCamera', () => ({
    openCamera: jest.fn(),
}));

jest.mock('../../utils/openPhotoLibrary', () => ({
    openPhotoLibrary: jest.fn(),
}));

const renderModal = (isEditing:boolean, close: ()=>void, profilePicture:string | null, setProfilePic: React.Dispatch<React.SetStateAction<string | UploadImage | null>>, remove: () => void) => {
    return render(
      <Provider store={store}>
        <ProfilePicturePickerModal isEditingProfilePicture={isEditing} close={close} profilePicture={profilePicture} setProfilePic={setProfilePic} remove={remove}/>
      </Provider>
    );
  };

describe('Profile Picture Picker Modal', ()=> {
    const setProfilePic = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    });

    test('Should render elements correctly', ()=> {
        const { getByText, getByLabelText} = renderModal(true, handleClose, '/image.jpg', setProfilePic, handleRemove);
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
        const { queryByLabelText, queryByText} = renderModal(true, handleClose, null, setProfilePic, handleRemove);
        expect(queryByLabelText('delete-icon')).toBeNull();
        expect(queryByText('handleRemove')).toBeNull();
    });

    test('Should close modal when isEditingProfilePicture is false', () => {
        const { queryByLabelText} = renderModal(false, handleClose, null, setProfilePic, handleRemove);
        expect(queryByLabelText('Profile Photo')).toBeNull();
    });

    test('Should click on close icon', () => {
        const { getByLabelText } = renderModal(true, handleClose, null, setProfilePic, handleRemove);
        fireEvent.press(getByLabelText('cancel-icon'));
        expect(handleClose).toHaveBeenCalled();
    });

    test('Should capture the picture from camera', async() => {
        (CameraUtil.openCamera as jest.Mock).mockResolvedValue({
            path: 'src/cameraPicture.jpg',
            mime: 'image/jpeg',
            filename: 'cameraPicture.jpg',
        });
        const { getByLabelText } = renderModal(true, handleClose, null, setProfilePic, handleRemove);
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
        const { getByLabelText } = renderModal(true, handleClose, null, setProfilePic, handleRemove);
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

    test('Should handleRemove picture when handleRemove button is clicked', () => {
        const { getByLabelText } = renderModal(true, handleClose, '/image.jpg', setProfilePic, handleRemove);
        fireEvent.press(getByLabelText('delete-icon'));
        expect(handleRemove).toHaveBeenCalled();
    });

    test('Should show alert when permissions are denied for camera', async () => {
        (CameraUtil.openCamera as jest.Mock).mockResolvedValue(null);
        const { getByLabelText, getByText } = renderModal(true, handleClose, null, setProfilePic, handleRemove);
        fireEvent.press(getByLabelText('camera-icon'));
        await waitFor(() => {
            expect(getByText('You do not have permissions to select the picture')).toBeTruthy();
        });
    });

    test('Should show alert when permissions are denied for gallery', async () => {
        (GalleryUtil.openPhotoLibrary as jest.Mock).mockResolvedValue(null);
        const { getByLabelText, getByText } = renderModal(true, handleClose, null, setProfilePic, handleRemove);
        fireEvent.press(getByLabelText('gallery-icon'));
        await waitFor(() => {
            expect(getByText('You do not have permissions to select the picture')).toBeTruthy();
        });
    });

    test('Should show alert when invalid file type is selected from camera', async () => {
        (CameraUtil.openCamera as jest.Mock).mockResolvedValue({
            path: 'invalid-file.txt',
            mime: 'text/plain',
            filename: 'invalid-file.txt',
        });
        const { getByLabelText, getByText } = renderModal(true, handleClose, null, setProfilePic, handleRemove);
        fireEvent.press(getByLabelText('camera-icon'));
        await waitFor(() => {
            expect(getByText('File should be JPG/PNG/JPEG format')).toBeTruthy();
        });
    });

    test('Should show alert when invalid file type is selected from gallery', async () => {
        (GalleryUtil.openPhotoLibrary as jest.Mock).mockResolvedValue({
            path: 'invalid-file.txt',
            mime: 'text/plain',
            filename: 'invalid-file.txt',
        });
        const { getByLabelText, getByText } = renderModal(true, handleClose, null, setProfilePic, handleRemove);
        fireEvent.press(getByLabelText('gallery-icon'));
        await waitFor(() => {
            expect(getByText('File should be JPG/PNG/JPEG format')).toBeTruthy();
        });
    });
});
