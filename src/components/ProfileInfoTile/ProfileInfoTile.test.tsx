import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Provider } from 'react-redux';
import { setUserProperty } from '../../redux/reducers/user.reducer';
import { store } from '../../redux/store';
import * as ProfileServices from '../../screens/Profile/Profile.services';
import * as tokenUtil from '../../utils/getTokens';
import { ProfileInfoTile } from './ProfileInfoTile';

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
    updateProfileDetails: jest.fn(),
}));

const mockDispatch = jest.fn();

const mockUser = {
    firstName: 'Varun',
    email: 'varun@gmail.com',
    mobileNumber: '9999999999',
};

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: () => mockUser,
    useDispatch: () => mockDispatch,
}));

describe('Tests related to the Profile Info Tile component', () => {
    const defaultProps = {
        image: require('../../../assets/icons/user-icon.png'),
        setEditField: jest.fn(),
        setLoading: jest.fn(),
    };
    const mockReset = jest.fn();
    beforeEach(() => {
        jest.resetAllMocks();
        (useNavigation as jest.Mock).mockReturnValue({
            reset: mockReset,
        });
    });

    const renderUI = (label: string, value: string, editField: string = '') => {
        return render(
            <NavigationContainer>
                <Provider store={store}>
                    <ProfileInfoTile
                        label={label}
                        value={value}
                        editField={editField}
                        {...defaultProps}
                    />
                </Provider>
            </NavigationContainer>
        );
    };

    it('Should show validation error on same value', async () => {
        renderUI('First Name', 'Varun', 'First Name');
        const firstNameValue = screen.getByPlaceholderText('Varun');
        expect(firstNameValue).toBeTruthy();
        fireEvent.changeText(firstNameValue, 'Varun');
        fireEvent.press(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(screen.getByText('First Name')).toBeTruthy();
        });
    });


    it('Should handle token failure', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue(null);

        renderUI('First Name', 'Varun', 'First Name');

        const input = screen.getByPlaceholderText('Varun');
        fireEvent.changeText(input, 'ChangedName');
        fireEvent.press(screen.getByLabelText('edit'));

        await waitFor(() => {
            expect(EncryptedStorage.clear).toHaveBeenCalled();
        });
    });

    it('Should update details, dispatch action and set encrypted storage on success', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'access-token' });
        (ProfileServices.updateProfileDetails as jest.Mock).mockResolvedValue({ ok: true });
        renderUI('First Name', 'Varun', 'First Name');
        const firtsNameValue = screen.getByPlaceholderText('Varun');
        fireEvent.changeText(firtsNameValue, 'Virat');
        fireEvent.press(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(
                setUserProperty({ property: 'firstName', value: 'Virat' })
            );
            expect(EncryptedStorage.setItem).toHaveBeenCalled();
            expect(screen.getByText('Updated first name successfully')).toBeTruthy();
        });
    });
    it('Should not update the user details if response is not ok', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        (ProfileServices.updateProfileDetails as jest.Mock).mockResolvedValue({ ok: false});
        renderUI('First Name', 'Varun', 'First Name');
        const firtsNameValue = screen.getByPlaceholderText('Varun');
        fireEvent.changeText(firtsNameValue, 'Virat');
        fireEvent.press(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(defaultProps.setEditField).toHaveBeenCalled();
        });
    });
    it('Should display an alert if error occurs while updating any profile detail', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        (ProfileServices.updateProfileDetails as jest.Mock).mockRejectedValue(new Error('Failed'));
        renderUI('First Name', 'Varun', 'First Name');
        const firtsNameValue = screen.getByPlaceholderText('Varun');
        fireEvent.changeText(firtsNameValue, 'Virat');
        fireEvent.press(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(screen.getByText('Something went wrong while updating. Please try again')).toBeTruthy();
        });
    });
    it('Should not enter edit mode for Contact field', () => {
        renderUI('Contact', '+91 9999999999');
        const editIcon = screen.queryByLabelText('edit-text');
        expect(editIcon).toBeNull();
    });

    it('Should not enter edit mode for Email field', () => {
        renderUI('Email', 'anjanibarlapati@gmail.com');
        const editIcon = screen.queryByLabelText('edit-text');
        expect(editIcon).toBeNull();
    });

    it('Should set editField to its label value', () => {
        renderUI('First Name', 'Varun');
        const editIcon = screen.getByLabelText('edit-text');
        expect(editIcon).toBeTruthy();
        fireEvent.press(editIcon);
        expect(defaultProps.setEditField).toHaveBeenCalled();
    });

    it('Should cancel editing when close button is pressed', async () => {
        const setEditFieldMock = jest.fn();
        const setLoading = jest.fn();
        render(
            <NavigationContainer>
                <Provider store={store}>
                    <ProfileInfoTile
                        label="First Name"
                        value="Varun"
                        editField="First Name"
                        setEditField={setEditFieldMock}
                        setLoading={setLoading}
                        image={require('../../../assets/icons/user-icon.png')}
                    />
                </Provider>
            </NavigationContainer>
        );
        const value = screen.getByPlaceholderText('Varun');
        fireEvent.changeText(value, 'Virat');
        fireEvent.press(screen.getByLabelText('cancel'));
        await waitFor(() => {
            expect(setEditFieldMock).toHaveBeenCalledWith('');
        });
    });

    it('Should display an alert if unappropriate value is given', async () => {
        const setEditFieldMock = jest.fn();
        const setLoading = jest.fn();
        render(
            <NavigationContainer>
                <Provider store={store}>
                    <ProfileInfoTile
                        label="First Name"
                        value="Varun"
                        editField="First Name"
                        setEditField={setEditFieldMock}
                        setLoading={setLoading}
                        image={require('../../../assets/icons/user-icon.png')}
                    />
                </Provider>
            </NavigationContainer>
        );
        const firtsNameValue = screen.getByPlaceholderText('Varun');
        fireEvent.changeText(firtsNameValue, '');
        fireEvent.press(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(screen.getByText('Please give a different value')).toBeTruthy();
        });
        fireEvent.press(screen.getByText(/ok/i));
        await waitFor(() => {
            expect(setEditFieldMock).toHaveBeenCalledWith('');
        });
    });

});
