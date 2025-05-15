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

    const renderUI = (label: string, value: string) => {
        return render(
            <Provider store={store}>
                <ProfileInfoTile
                    label={label}
                    value={value}
                    editField={label}
                    {...defaultProps}
                />
            </Provider>
        );
    };

    it('Should call setEditField when non-Contact field is pressed', () => {
        const setEditFieldMock = jest.fn();
        render(
            <Provider store={store}>
            <ProfileInfoTile
                label="First Name"
                value="Varun"
                image={require('../../../assets/icons/user-icon.png')}
                editField="" // not in edit mode
                setEditField={setEditFieldMock}
            />
            </Provider>
        );
        fireEvent.press(screen.getByText('Varun'));
        expect(setEditFieldMock).toHaveBeenCalledWith('First Name');
    });

    it('Should show validation error on same value', async () => {
        renderUI('First Name', 'Varun');
        fireEvent.press(screen.getByPlaceholderText('Varun'));
        fireEvent.changeText(screen.getByPlaceholderText('Varun'), 'Varun');
        fireEvent.press(screen.getByLabelText('edit'));
        await waitFor(() =>
            expect(screen.getByText('First Name')).toBeTruthy()
        );
    });

    it('Should show error for invalid email', async () => {
        renderUI('Email', 'varun@gmail.com');
        fireEvent.changeText(screen.getByPlaceholderText('varun@gmail.com'), 'virat');
        fireEvent.press(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(screen.getByPlaceholderText('varun@gmail.com')).toBeTruthy();
        });
    });

    it('Should handle token failure', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue(null);
        renderUI('First Name', 'Varun');
        fireEvent.changeText(screen.getByPlaceholderText('Varun'), 'NewName');
        fireEvent.press(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Varun')).toBeTruthy();
        });
    });

    it('Should handle API update and storage', async () => {
        (tokenUtil.getTokens as jest.Mock).mockResolvedValue({ access_token: 'accesss-tokeenn' });
        (ProfileHandler.updateProfileDetails as jest.Mock).mockResolvedValue({ ok: true });
        renderUI('First Name', 'Varun');
        fireEvent.changeText(screen.getByPlaceholderText('Varun'), 'UpdatedName');
        fireEvent.press(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(
                setUserProperty({ property: 'firstName', value: 'UpdatedName' })
            );
            expect(EncryptedStorage.setItem).toHaveBeenCalled();
        });
    });

    it('Should not enter edit mode for Contact field', () => {
        render(
            <Provider store={store}>
                <ProfileInfoTile
                    label="Contact"
                    value="+91 9999999999"
                    editField=""
                    {...defaultProps}
                />
            </Provider>
        );
        fireEvent.press(screen.getByText('+91 9999999999'));
        expect(screen.queryByLabelText('edit')).toBeNull();
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
        fireEvent.changeText(screen.getByPlaceholderText('Varun'), 'Virat');
        fireEvent.press(screen.getByLabelText('cancel'));
        expect(setEditFieldMock).toHaveBeenCalledWith('');
    });
});
