import { Provider } from 'react-redux';
import { render, screen , fireEvent} from '@testing-library/react-native';
import { ChatHeader } from './ChatHeader';
import { store } from '../../redux/store';

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
  }));

const contact = {
    name: 'Virat',
    mobileNumber: '+91 9393939393',
    profilePic: 'https://amazon.s3.bucket.profile-images/my-pic.png',
};

describe('Tests related to the ChatHeader component', () => {
    const mockGoBack = jest.fn();
    beforeEach(() => {
        require('@react-navigation/native').useNavigation.mockReturnValue({
            goBack: mockGoBack,
        });
    });
    const renderChatHeader = () => {
        return render(
            <Provider store={store}>
                <ChatHeader name={contact.name} mobileNumber={contact.mobileNumber} />
            </Provider>
        );
    };

    it('Should render all fields in the Chat Header component', () => {
        renderChatHeader();
        expect(screen.getByText(contact.name)).toBeTruthy();
        expect(screen.getByText(contact.mobileNumber)).toBeTruthy();
        expect(screen.getByLabelText('Back-Icon')).toBeTruthy();
        expect(screen.getByLabelText('Profile-Image')).toBeTruthy();
        expect(screen.getByLabelText('Profile-Image').props.source).toEqual(require('../../../assets/images/profileImage.png'));
    });

    it('Should render the contact profile Image', () => {
        render(
            <Provider store={store}>
                <ChatHeader name={contact.name} mobileNumber={contact.mobileNumber} profilePic={contact.profilePic}/>
            </Provider>
        );
        expect(screen.getByLabelText('Profile-Image').props.source).toEqual({uri: contact.profilePic});
    });

    it('Should call navigation.goBack when back button is pressed', () => {
        renderChatHeader();
        fireEvent.press(screen.getByLabelText('Back-Icon'));
        expect(mockGoBack).toHaveBeenCalledTimes(1);
    });

});
