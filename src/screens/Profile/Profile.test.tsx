import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { User } from '../../types/User';
import * as tokenUtil from '../../utils/getTokens';
import { openPhotoLibrary } from '../../utils/openPhotoLibrary';
import { Profile } from './Profile';
import * as ProfileServices from './Profile.services';

jest.mock('react-native-encrypted-storage', () => ({
    setItem: jest.fn(),
    clear: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

jest.mock('../../utils/getTokens', () => ({
    getTokens: jest.fn(),
}));

jest.mock('../../screens/Profile/Profile.services', () => ({
    updateProfilePic: jest.fn(),
    removeProfilePic: jest.fn(),
    deleteAccount: jest.fn(),
}));

jest.mock('../../utils/openCamera', () => ({
  openCamera: jest.fn(),
}));

jest.mock('../../utils/openPhotoLibrary', () => ({
  openPhotoLibrary: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockUser: User = {
        firstName: 'Varun',
        lastName: 'Kumar',
        email: 'varun@gmail.com',
        profilePicture: 'imagelink',
        mobileNumber: '+91 6303522765',
};

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: () => mockUser,
    useDispatch: () => mockDispatch,
}));

describe('Tests related to the Profile Screen', () => {
    const RenderProfileScreen = () => {
        return render(
            <NavigationContainer>
                <Provider store={store}>
                    <Profile />
                </Provider>
            </NavigationContainer>
        );
    };

    const mockReset = jest.fn();
    const mockSetOptions = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        (useNavigation as jest.Mock).mockReturnValue({
            reset: mockReset,
            setOptions: mockSetOptions,
        });
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('Should check all the elements', async() => {
        await waitFor(() => {
            RenderProfileScreen();
        });
        expect(screen.getByLabelText('ProfilePicture')).toBeTruthy();
        expect(screen.getByLabelText('editIcon')).toBeTruthy();
        expect(screen.getByText('First Name')).toBeTruthy();
        expect(screen.getByText('Last Name')).toBeTruthy();
        expect(screen.getByText('Email')).toBeTruthy();
        expect(screen.getByText('Contact')).toBeTruthy();
        expect(screen.getByText('Change Password')).toBeTruthy();
        expect(screen.getByText('Delete Account')).toBeTruthy();
        expect(screen.getByText('Sign out')).toBeTruthy();
    });

    it('Should render all the user details', async() => {
        await waitFor(() => {
            RenderProfileScreen();
        });
        expect(screen.getByText('Varun')).toBeTruthy();
        expect(screen.getByText('Kumar')).toBeTruthy();
        expect(screen.getByText('varun@gmail.com')).toBeTruthy();
        expect(screen.getByText('+91 6303522765')).toBeTruthy();
        expect(screen.getByLabelText('ProfilePicture').props.source).toEqual({uri: mockUser.profilePicture});
    });

    it('Should set the navigation options correctly', async() => {
        await waitFor(() => {
            RenderProfileScreen();
        });
        expect(mockSetOptions).toHaveBeenCalledWith({
            headerTitle: 'Profile',
            headerTitleStyle: expect.any(Object),
            headerStyle: expect.any(Object),
        });
    });

    it('Should open profile picture modal on edit icon press', async() => {
        RenderProfileScreen();
        const editIcon = await waitFor(() => screen.getByLabelText('editIcon'));
        fireEvent.press(editIcon);
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
    });

    it('Should delete account, clear stack and navigate to welcome screen', async() => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        (ProfileServices.deleteAccount as jest.Mock).mockResolvedValue({ ok: true });
        RenderProfileScreen();
        const editTextIcon = await screen.findAllByLabelText('edit-text');
        fireEvent.press(editTextIcon[0]);
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Delete Account'));
        });
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Delete'));
        });
        await waitFor(() => {
            expect(EncryptedStorage.clear).toHaveBeenCalled();
            expect(mockReset).toHaveBeenCalledWith({
                index: 0,
                routes: [{ name: 'WelcomeScreen' }],
            });
        });
    });

    it('Should clear encrypted storage, clear stack and navigate to welcome screen if tokens are invalid during delete account', async() => {

        (tokenUtil.getTokens as jest.Mock).mockResolvedValue(null);
        RenderProfileScreen();
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Delete Account'));
        });
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Delete'));
        });
        await waitFor(() => {
            expect(EncryptedStorage.clear).toHaveBeenCalled();
            expect(mockReset).toHaveBeenCalledWith({
                index: 0,
                routes: [{ name: 'WelcomeScreen' }],
            });
        });
    });

    it('Should go back to profile screen when clicks on No in delete modal', async() => {
        RenderProfileScreen();
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Delete Account'));
        });
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('No'));
        });
        await waitFor(() => {
            expect(screen.findByText('Delete Account')).toBeTruthy();
        });
    });

    it('Should not delete account when the response is not ok and show alert with message Failed to delete', async() => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        (ProfileServices.deleteAccount as jest.Mock).mockResolvedValue({ ok: false });
        RenderProfileScreen();
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Delete Account'));
        });
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Delete'));
        });
        await waitFor(() => {
            expect(screen.getByText('Failed to delete account')).toBeTruthy();
        });
    });

    it('Should not delete account when error occurs during deletion and displays an alert', async() => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        (ProfileServices.deleteAccount as jest.Mock).mockRejectedValue(new Error('Failed'));
        RenderProfileScreen();
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Delete Account'));
        });
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Delete'));
        });
        await waitFor(() => {
            expect(screen.getByText('Something went wrong while deleting account. Please try again')).toBeTruthy();
        });
    });

    it('Should display an alert when error occurs while signing out', async() => {
        (EncryptedStorage.clear as jest.Mock).mockRejectedValue(new Error('Failed'));
        RenderProfileScreen();
        const editTextIcon = await screen.findAllByLabelText('edit-text');
        fireEvent.press(editTextIcon[0]);
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Sign out'));
        });
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Yes'));
        });
        await waitFor(() => {
            expect(screen.getByText('Something went wrong while signing out. Please try again')).toBeTruthy();
        });
    });

    it('Should clear encrypted storage and stack and navigate to welcome screen upon clicking on sign out', async() => {
        RenderProfileScreen();
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Sign out'));
        });
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Yes'));
        });
        await waitFor(() => {
            expect(EncryptedStorage.clear).toHaveBeenCalled();
            expect(mockReset).toHaveBeenCalledWith({
                index: 0,
                routes: [{ name: 'WelcomeScreen' }],
            });
        });
    });

    it('Should go back to profile screen when clicks on Cancel in signout modal', async() => {
        RenderProfileScreen();
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Sign out'));
        });
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Cancel'));
        });
        await waitFor(() => {
            expect(screen.findByText('Sign out')).toBeTruthy();
        });
    });

    it('Should display an alert if error occurs while removing profile picture', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        (ProfileServices.removeProfilePic as jest.Mock).mockRejectedValue(new Error('Failed'));
        RenderProfileScreen();
        fireEvent.press(screen.getByLabelText('editIcon'));
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Remove'));
        await waitFor(() => {
            expect(screen.getByText('Something went wrong while removing profile picture. Please try again')).toBeTruthy();
        });
    });

    it('Should remove profile picture and update the store', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        (ProfileServices.removeProfilePic as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Deleted' }),
        });
        RenderProfileScreen();
        fireEvent.press(screen.getByLabelText('editIcon'));
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Remove'));
        await waitFor(() => {
            expect(screen.getByText('Successfully Removed Profile')).toBeTruthy();
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'user/setUserProperty',
                    payload: { property: 'profilePicture', value: '' },
                })
            );
        });
    });

    it('Should clear encrypted storage, clear stack and navigate to welcome screen when invalid access tokens are used while removing the profile picture', async() => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue(null);
        RenderProfileScreen();
        fireEvent.press(screen.getByLabelText('editIcon'));
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Remove'));
        await waitFor(() => {
            expect(EncryptedStorage.clear).toHaveBeenCalled();
            expect(mockReset).toHaveBeenCalledWith({
                index: 0,
                routes: [{ name: 'WelcomeScreen' }],
             });
        });
    });

    it('Should upload profile picture successfully', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        const imageUri = 'https:aws.amaozn.s3bucket/profile.jpg';
        const mockImage = {
            path: 'src/pic.jpg',
            mime: 'image/jpeg',
            filename: 'pic.jpg',
        };
        const mockResponse = {
            ok: true,
            json: async () => ({
                profilePicture: imageUri,
            }),
        };
        (openPhotoLibrary as jest.Mock).mockResolvedValue(mockImage);
        (ProfileServices.updateProfilePic as jest.Mock).mockResolvedValue(mockResponse);
        RenderProfileScreen();
        await waitFor(() => {
            fireEvent.press(screen.getByLabelText('editIcon'));
        });
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Gallery'));
        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'user/setUserProperty',
                    payload: {
                        property: 'profilePicture',
                        value: imageUri,
                    },
                })
            );
        });
        await waitFor(() => {
            expect(screen.getByText('Profile picture updated')).toBeTruthy();
        });
    });

    it('Should clear encrypted storage, clear stack and navigate to welcome screen when valid access tokens are not used while uploading new profile picture', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue(null);
        const mockImage = {
            path: 'src/pic.jpg',
            mime: 'image/jpeg',
            filename: 'pic.jpg',
        };
        (openPhotoLibrary as jest.Mock).mockResolvedValue(mockImage);
        RenderProfileScreen();
        await waitFor(() => {
            fireEvent.press(screen.getByLabelText('editIcon'));
        });
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Gallery'));
        await waitFor(() => {
            expect(EncryptedStorage.clear).toHaveBeenCalled();
            expect(mockReset).toHaveBeenCalledWith({
                index: 0,
                routes: [{ name: 'WelcomeScreen' }],
            });
        });
    });

    it('Should show alert message when response is not ok while uploading new profile image', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        const mockImage = {
            path: 'src/pic.jpg',
            mime: 'image/jpeg',
            filename: 'pic.jpg',
        };
        const mockResponse = {
            ok: false,
            json: async () => ({
                message: 'Image size exceeded',
            }),
        };
        (openPhotoLibrary as jest.Mock).mockResolvedValue(mockImage);
        (ProfileServices.updateProfilePic as jest.Mock).mockResolvedValue(mockResponse);
        RenderProfileScreen();
        await waitFor(() => {
            fireEvent.press(screen.getByLabelText('editIcon'));
        });
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Gallery'));
        await waitFor(() => {
            expect(screen.getByText('Image size exceeded')).toBeTruthy();
        });
    });

    it('Should not update new Profile picture when error occurs while uploading new profile picture', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        const mockImage = {
            path: 'src/pic.jpg',
            mime: 'image/jpeg',
            filename: 'pic.jpg',
        };
        (openPhotoLibrary as jest.Mock).mockResolvedValue(mockImage);
        (ProfileServices.updateProfilePic as jest.Mock).mockRejectedValue(new Error('Failed'));
        RenderProfileScreen();
        await waitFor(() => {
            fireEvent.press(screen.getByLabelText('editIcon'));
        });
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Gallery'));
        await waitFor(() => {
            expect(screen.getByText('Profile upload failed. Please try again later')).toBeTruthy();
        });
    });
});
