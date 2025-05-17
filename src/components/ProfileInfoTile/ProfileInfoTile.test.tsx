import EncryptedStorage from 'react-native-encrypted-storage';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { ProfileInfoTile } from './ProfileInfoTile';
import { store } from '../../redux/store';
import { setUserProperty } from '../../redux/reducers/user.reducer';
import * as ProfileHandler from '../../screens/Profile/Profile.handler';
import * as tokenUtil from '../../utils/getTokens';

jest.mock('react-native-encrypted-storage', () => ({
    setItem: jest.fn(),
}));

jest.mock('../../utils/getTokens', () => ({
    getTokens: jest.fn(),
}));

jest.mock('../../screens/Profile/Profile.handler', () => ({
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
    };

    const renderUI = (label: string, value: string, editField: string = '') => {
        return render(
            <Provider store={store}>
                <ProfileInfoTile
                    label={label}
                    value={value}
                    editField={editField}
                    {...defaultProps}
                />
            </Provider>
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

    it('Should show error for invalid email', async () => {
        renderUI('Email', 'varun@gmail.com', 'Email');
        const email = screen.getByPlaceholderText('varun@gmail.com');
        expect(email).toBeTruthy();
        fireEvent.changeText(email, 'email');
        fireEvent.press(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(email.props.value).toBe('');
        });
    });

    it('Should handle token failure', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue(null);

        renderUI('First Name', 'Varun', 'First Name');

        const input = screen.getByPlaceholderText('Varun');
        fireEvent.changeText(input, 'ChangedName');
        fireEvent.press(screen.getByLabelText('edit'));

        await waitFor(() => {
            expect(input.props.value).toBe('');
        });
    });

    it('Should update details, dispatch action and set encrypted storage on success', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'access-token' });
        (ProfileHandler.updateProfileDetails as jest.Mock).mockResolvedValue({ ok: true });
        renderUI('First Name', 'Varun', 'First Name');
        const firtsNameValue = screen.getByPlaceholderText('Varun');
        fireEvent.changeText(firtsNameValue, 'Virat');
        fireEvent.press(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(
                setUserProperty({ property: 'firstName', value: 'Virat' })
            );
            expect(EncryptedStorage.setItem).toHaveBeenCalled();
        });
    });
    it('Should not update the user details if response is not ok', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'RGUKT BASAR' });
        (ProfileHandler.updateProfileDetails as jest.Mock).mockResolvedValue({ ok: false});
        renderUI('First Name', 'Varun', 'First Name');
        const firtsNameValue = screen.getByPlaceholderText('Varun');
        fireEvent.changeText(firtsNameValue, 'Virat');
        fireEvent.press(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(defaultProps.setEditField).toHaveBeenCalled();
        });
    });
    it('Should not enter edit mode for Contact field', () => {
        renderUI('Contact', '+91 9999999999');
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
        render(
            <Provider store={store}>
                <ProfileInfoTile
                    label="First Name"
                    value="Varun"
                    editField="First Name"
                    setEditField={setEditFieldMock}
                    image={require('../../../assets/icons/user-icon.png')}
                />
            </Provider>
        );
        const value = screen.getByPlaceholderText('Varun');
        fireEvent.changeText(value, 'Virat');
        fireEvent.press(screen.getByLabelText('cancel'));
        await waitFor(() => {
            expect(setEditFieldMock).toHaveBeenCalledWith('');
        });
    });
});
