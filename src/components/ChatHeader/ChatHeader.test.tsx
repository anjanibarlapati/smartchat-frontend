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
                <ChatHeader name={contact.name} originalNumber={contact.originalNumber} profilePic={null} isSelfChat={false} isOnline={false}/>
            </Provider>
        );
    };

    it('Should render all fields in the Chat Header component', () => {
        renderChatHeader();
        expect(screen.getByText(contact.name)).toBeTruthy();
        expect(screen.getByLabelText('Back-Icon')).toBeTruthy();
        expect(screen.getByLabelText('Profile-Image')).toBeTruthy();
        expect(screen.getByLabelText('Profile-Image').props.source).toEqual(require('../../../assets/images/profileImage.png'));
    });

    it('Should render the contact profile Image', () => {
        render(
            <Provider store={store}>
                <ChatHeader name={contact.name} originalNumber={contact.originalNumber} profilePic={contact.profilePic} isSelfChat={false} isOnline={false}/>
            </Provider>
        );
        expect(screen.getByLabelText('Profile-Image').props.source).toEqual({uri: contact.profilePic});
    });

    it('Should append (You) to contact name for self chat', () => {
        render(
            <Provider store={store}>
                <ChatHeader name={contact.name} originalNumber={contact.originalNumber} profilePic={contact.profilePic} isSelfChat={true} isOnline={false}/>
            </Provider>
        );
        expect(screen.getByText(contact.name + ' (You)')).toBeTruthy();

    });
    it('Should not render contact number for unsaved contacts', () => {
        render(
            <Provider store={store}>
                <ChatHeader name={'+91 86395 38322'} originalNumber={'+91 86395 38322'} profilePic={contact.profilePic} isSelfChat={false} isOnline={false}/>
            </Provider>
        );
        expect(screen.getByText('+91 86395 38322')).toBeTruthy();

    });

    it('Should call navigation.goBack when back button is pressed', () => {
        renderChatHeader();
        fireEvent.press(screen.getByLabelText('Back-Icon'));
        expect(mockReplace).toHaveBeenCalledTimes(1);
    });
    it('Should display "Online" status when isOnline is true and isSelfChat is false', () => {
        render(
            <Provider store={store}>
               <ChatHeader
                  name={contact.name}
                  originalNumber={contact.originalNumber}
                  profilePic={contact.profilePic}
                  isSelfChat={false}
                  isOnline={true}
                 />
            </Provider>
        );
       expect(screen.getByText('Online')).toBeTruthy();
});


});
