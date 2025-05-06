import { fireEvent, render } from '@testing-library/react-native';
import { ProfilePicutrePickerModal } from './ProfilePicturePickerModal';

const handleClose = () => {};

const renderModal = (isEditing:boolean, close: ()=>void, profilePicture:string, openedFrom: 'registration' | 'profile') => {
    return render(
      <ProfilePicutrePickerModal isEditingProfilePicture={isEditing} close={close} profilePicture={profilePicture} openedFrom={openedFrom}/>
    );
  };

describe('Profile Picture Picker Modal', ()=> {
    test('Should render elements correctly', ()=> {
        const { getByText, getByLabelText} = renderModal(true, handleClose, '/image.jpg', 'registration');
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
        const { queryByLabelText, queryByText} = renderModal(true, handleClose, '', 'registration');
        expect(queryByLabelText('delete-icon')).toBeNull();
        expect(queryByText('Remove')).toBeNull();
    });
    test('Should close modal when isEditingProfilePicture is false', () => {
        const { queryByLabelText} = renderModal(false, handleClose, '', 'registration');
        expect(queryByLabelText('Profile Photo')).toBeNull();
    });
    test('Should click on close icon', () => {
        const { getByLabelText } = renderModal(true, handleClose, '', 'registration');
        fireEvent.press(getByLabelText('cancel-icon'));
    });
});
