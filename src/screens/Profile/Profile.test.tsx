import { Alert } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Profile } from './Profile';
import { store } from '../../redux/store';
import * as ProfileHandler from '../../screens/Profile/Profile.handler';
import { User } from '../../types/User';
import * as tokenUtil from '../../utils/getTokens';
import { openPhotoLibrary } from '../../utils/openPhotoLibrary';

jest.mock('react-native-encrypted-storage', () => ({
    setItem: jest.fn(),
    clear: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
  };
});

jest.mock('../../utils/getTokens', () => ({
    getTokens: jest.fn(),
}));

jest.mock('../../screens/Profile/Profile.handler', () => ({
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
        countryCode: '+91',
        mobileNumber: '6303522765',
};

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: () => mockUser,
    useDispatch: () => mockDispatch,
}));

describe('Tests related to the Profile Screen', () => {
    const navigation = { setOptions: jest.fn(), navigate: jest.fn() };

    const RenderProfileScreen = () => {
        return render(
            <NavigationContainer>
                <Provider store={store}>
                    <Profile />
                </Provider>
            </NavigationContainer>
        );
    };

    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('Should check all the elements', async() => {
        (useNavigation as jest.Mock).mockReturnValue(navigation);
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
        (useNavigation as jest.Mock).mockReturnValue(navigation);
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
        (useNavigation as jest.Mock).mockReturnValue(navigation);
        await waitFor(() => {
            RenderProfileScreen();
        });
        expect(navigation.setOptions).toHaveBeenCalledWith({
            headerTitle: 'Profile',
            headerTitleStyle: expect.any(Object),
            headerStyle: expect.any(Object),
        });
    });

    it('Should open profile picture modal on edit icon press', async() => {
        (useNavigation as jest.Mock).mockReturnValue(navigation);
        RenderProfileScreen();
        const editIcon = await waitFor(() => screen.getByLabelText('editIcon'));
        fireEvent.press(editIcon);
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
    });

    it('Should show alert if tokens are invalid during upload', async() => {
        (useNavigation as jest.Mock).mockReturnValue(navigation);
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue(null);
        RenderProfileScreen();
        fireEvent.press(screen.getByLabelText('editIcon'));
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
    });

    it('Should delete account and navigate to welcome screen', async() => {
        (useNavigation as jest.Mock).mockReturnValue({
            ...navigation,
            navigate: jest.fn(),
        });
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        (ProfileHandler.deleteAccount as jest.Mock).mockResolvedValue({ ok: true });
        RenderProfileScreen();
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Delete Account'));
        });
        await waitFor(() => {
            expect(EncryptedStorage.clear).toHaveBeenCalled();
        });
    });

    it('Should show alert if tokens are invalid during delete account', async() => {
        (useNavigation as jest.Mock).mockReturnValue({
            ...navigation,
            navigate: jest.fn(),
        });
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue(null);
        RenderProfileScreen();
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Delete Account'));
        });
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Invalid Access tokens');
        });
    });

    it('Should not delete account when the response is not ok and show alert with message Failed to delete', async() => {
        (useNavigation as jest.Mock).mockReturnValue({
            ...navigation,
            navigate: jest.fn(),
        });
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        (ProfileHandler.deleteAccount as jest.Mock).mockResolvedValue({ ok: false });
        RenderProfileScreen();
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Delete Account'));
        });
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Failed to delete');
        });
    });

    it('Should not delete account when error occurs during deletion and displays an alert', async() => {
        (useNavigation as jest.Mock).mockReturnValue({
            ...navigation,
            navigate: jest.fn(),
        });
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        (ProfileHandler.deleteAccount as jest.Mock).mockRejectedValue(new Error('Failed'));
        RenderProfileScreen();
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Delete Account'));
        });
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Failed to delete!');
        });
    });

    it('Should go to Welcome screen upon clicking on sign out', async() => {
        (useNavigation as jest.Mock).mockReturnValue({
            ...navigation,
            navigate: jest.fn(),
        });
        RenderProfileScreen();
        await waitFor(async() => {
            fireEvent.press(await screen.findByText('Sign out'));
        });
        await waitFor(() => {
            expect(EncryptedStorage.clear).toHaveBeenCalled();
        });
    });

    it('Should remove profile picture and update the store', async () => {
        (useNavigation as jest.Mock).mockReturnValue(navigation);
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        (ProfileHandler.removeProfilePic as jest.Mock).mockResolvedValue({
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
            expect(Alert.alert).toHaveBeenCalledWith('Successfully Removed');
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'user/setUserProperty',
                    payload: { property: 'profilePicture', value: '' },
                })
            );
        });
    });

    it('Should display alert message when invalid access tokens are used while removing the profile picture', async() => {
        (useNavigation as jest.Mock).mockReturnValue(navigation);
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue(null);
        RenderProfileScreen();
        fireEvent.press(screen.getByLabelText('editIcon'));
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Remove'));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalled();
        });
    });

    it('Should upload profile picture successfully', async () => {
        (useNavigation as jest.Mock).mockReturnValue(navigation);
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
                user: { profilePicture: imageUri },
            }),
        };
        (openPhotoLibrary as jest.Mock).mockResolvedValue(mockImage);
        (ProfileHandler.updateProfilePic as jest.Mock).mockResolvedValue(mockResponse);
        RenderProfileScreen();
        await waitFor(() => {
            fireEvent.press(screen.getByLabelText('editIcon'));
        });
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Gallery'));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Profile picture updated');
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
    });

    it('Should not upload new profile picture when valid access tokens are not used', async () => {
        (useNavigation as jest.Mock).mockReturnValue(navigation);
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
            expect(Alert.alert).toHaveBeenCalled();
        });
    });

    it('Should show alert message when response is not ok while uploading new profile image', async () => {
        (useNavigation as jest.Mock).mockReturnValue(navigation);
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
        (ProfileHandler.updateProfilePic as jest.Mock).mockResolvedValue(mockResponse);
        RenderProfileScreen();
        await waitFor(() => {
            fireEvent.press(screen.getByLabelText('editIcon'));
        });
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Gallery'));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Image size exceeded');
        });
    });

    it('Should not update new Profile picture when error occurs while uploading new profile picture', async () => {
        (useNavigation as jest.Mock).mockReturnValue(navigation);
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        const mockImage = {
            path: 'src/pic.jpg',
            mime: 'image/jpeg',
            filename: 'pic.jpg',
        };
        (openPhotoLibrary as jest.Mock).mockResolvedValue(mockImage);
        (ProfileHandler.updateProfilePic as jest.Mock).mockRejectedValue(new Error('Failed'));
        RenderProfileScreen();
        await waitFor(() => {
            fireEvent.press(screen.getByLabelText('editIcon'));
        });
        await waitFor(() => {
            expect(screen.getByText('Profile Photo')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Gallery'));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Upload failed', 'Please try again later!');
        });
    });
});
