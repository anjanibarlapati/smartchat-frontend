import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Profile } from './Profile';
import { store } from '../../redux/store';
import { User } from '../../types/User';
import { setUserDetails } from '../../redux/reducers/user.reducer';

jest.mock('../../utils/openCamera', () => ({
  openCamera: jest.fn(),
}));

jest.mock('../../utils/openPhotoLibrary', () => ({
  openPhotoLibrary: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
  };
});

describe('Tests related to the Profile Screen', () => {
    const user: User = {
        firstName: 'Varun',
        lastName: 'Kumar',
        email: 'varun@gmail.com',
        profilePicture: 'imagelink',
        countryCode: '+91',
        mobileNumber: '6303522765',
    };
    const navigation = { setOptions: jest.fn() };

    const RenderProfileScreen = () => {
        store.dispatch(setUserDetails(user));
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
        expect(screen.getByLabelText('ProfilePicture').props.source).toEqual({uri: user.profilePicture});
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

});
