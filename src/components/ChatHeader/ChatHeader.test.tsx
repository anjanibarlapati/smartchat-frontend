import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { store } from '../../redux/store';
import { ChatHeader } from './ChatHeader';

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
  }));

const contact = {
    name: 'Virat',
    originalNumber: '+91 93939 939393',
    profilePic: 'https://amazon.s3.bucket.profile-images/my-pic.png',
};

describe('Tests related to the ChatHeader component', () => {
    const mockReplace = jest.fn();
    beforeEach(() => {
        require('@react-navigation/native').useNavigation.mockReturnValue({
            replace: mockReplace,
        });
    });
    const renderChatHeader = () => {
        return render(
            <Provider store={store}>
                <ChatHeader name={contact.name} originalNumber={contact.originalNumber} profilePic={null}/>
            </Provider>
        );
    };

    it('Should render all fields in the Chat Header component', () => {
        renderChatHeader();
        expect(screen.getByText(contact.name)).toBeTruthy();
        expect(screen.getByText(contact.originalNumber)).toBeTruthy();
        expect(screen.getByLabelText('Back-Icon')).toBeTruthy();
        expect(screen.getByLabelText('Profile-Image')).toBeTruthy();
        expect(screen.getByLabelText('Profile-Image').props.source).toEqual(require('../../../assets/images/profileImage.png'));
    });

    it('Should render the contact profile Image', () => {
        render(
            <Provider store={store}>
                <ChatHeader name={contact.name} originalNumber={contact.originalNumber} profilePic={contact.profilePic}/>
            </Provider>
        );
        expect(screen.getByLabelText('Profile-Image').props.source).toEqual({uri: contact.profilePic});
    });

    it('Should call navigation.goBack when back button is pressed', () => {
        renderChatHeader();
        fireEvent.press(screen.getByLabelText('Back-Icon'));
        expect(mockReplace).toHaveBeenCalledTimes(1);
    });

});
