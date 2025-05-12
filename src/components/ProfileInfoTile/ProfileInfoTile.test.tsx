import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ProfileInfoTile } from './ProfileInfoTile';
import { store } from '../../redux/store';


describe('Tests related to the Profile Info Tile', () => {

    const renderUI = (label: string, value: string) => {
        return render(
            <Provider store={store}>
                <ProfileInfoTile label={label} value={value} image={require('../../../assets/icons/user-icon.png')} />
            </Provider>
        );
    };

    it('Should check all fields', () => {
        renderUI('First Name', 'Varun');
        expect(screen.getByText('First Name')).toBeTruthy();
        expect(screen.getByText('Varun')).toBeTruthy();
        expect(screen.getByLabelText('First Name')).toBeTruthy();
        fireEvent.press(screen.getByText('Varun'));
        expect(screen.getByLabelText('edit')).toBeTruthy();
        expect(screen.getByLabelText('cancel')).toBeTruthy();
    });

    it('Should able to edit the field', () => {
        renderUI('First Name', 'Varun');
        fireEvent.press(screen.getByText('Varun'));
        expect(screen.getByPlaceholderText('Varun')).toBeTruthy();
        fireEvent.changeText(screen.getByPlaceholderText('Varun'), 'VarunKumar');
        fireEvent.press(screen.getByLabelText('cancel'));
        expect(screen.getByText('Varun')).toBeTruthy();
    });

    it('Should not able to edit the Mobile Number field', () => {
        renderUI('Contact', '+91 9999999999');
        fireEvent.press(screen.getByText('+91 9999999999'));
        expect(screen.queryByLabelText('edit')).not.toBeVisible();
        expect(screen.queryByLabelText('cancel')).not.toBeVisible();
    });
});
