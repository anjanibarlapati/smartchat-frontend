import { useNavigation } from '@react-navigation/native';
import { fireEvent, render} from '@testing-library/react-native';
import { ContactCard } from './ContactCard.tsx';
import { store } from '../../redux/store';
import { Provider } from 'react-redux';
import { Contact } from '../../types/Contacts.ts';
import { sendSmsInvite } from '../../utils/sendSmsInvite.ts';

jest.mock('../../permissions/permissions.ts', () => ({
  requestPermission: jest.fn(),
}));

const renderContactCard = (contact: Contact) => {
    return render(
        <Provider store={store}>
             <ContactCard contact={contact}/>
        </Provider>
    );
};
jest.mock('../../utils/sendSmsInvite.ts',()=> ({
  sendSmsInvite: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

const contact:Contact = {
    name:'Anjani',
    originalNumber: '8639523822',
    mobileNumber:'+91 86395 23822',
    profilePicture:'/image.jpg',
    doesHaveAccount: false,
};

describe('Contact Card Component', () => {

    const mockReplace = jest.fn();

    beforeEach(() => {
      jest.resetAllMocks();
      (useNavigation as jest.Mock).mockReturnValue({
        replace: mockReplace,
      });
    });

   test('Should render the elements correctly', () => {
      const {getByLabelText, getByText} = renderContactCard(contact);
      expect(getByLabelText('profile-image').props.source).toEqual({uri: contact.profilePicture});
      expect(getByText(contact.name)).toBeTruthy();
      expect(getByText(contact.originalNumber)).toBeTruthy();
      expect(getByText(/invite/i)).toBeTruthy();
   });

    test('Should render empty image when profile picture', () => {
      const {getByLabelText, getByText} = renderContactCard({...contact, profilePicture:''});
      expect(getByLabelText('profile-image').props.source).toEqual(require('../../../assets/images/profileImage.png'));
      expect(getByText(contact.name)).toBeTruthy();
      expect(getByText(contact.originalNumber)).toBeTruthy();
      expect(getByText(/invite/i)).toBeTruthy();
   });

     test('should send sms invite on clicking invite button', async () => {
        const { getByText } = renderContactCard(contact);
        const inviteButton = getByText(/invite/i);
         expect(inviteButton).toBeTruthy();
        fireEvent.press(inviteButton);
        expect(sendSmsInvite).toHaveBeenCalledWith(contact.originalNumber);
    });

    test('Should send sms invite on clicking contact who are not on app', async () => {
        const { getByLabelText } = renderContactCard(contact);
        const contactCard = getByLabelText(/contact-card/i);
        fireEvent.press(contactCard);
        expect(sendSmsInvite).toHaveBeenCalledWith(contact.originalNumber);
    });

    test('Should navigate to individual screen on clicking contact who are on app', async () => {
        const contactWithAccount = {
          ...contact,
          doesHaveAccount: true,
        };
        const { getByLabelText } = renderContactCard(contactWithAccount);
        const contactCard = getByLabelText(/contact-card/i);
        fireEvent.press(contactCard);
        expect(mockReplace).toHaveBeenCalledWith('IndividualChat', {
          name: contact.name,
          originalNumber: contact.originalNumber,
          mobileNumber: contact.mobileNumber,
          profilePic: contact.profilePicture,
        });
    });

    test('Should navigate to individual screen with empty profile picture on clicking contact who are on app', async () => {
        const contactWithEmptyPic = {
          ...contact,
          doesHaveAccount: true,
          profilePicture: '',
        };
        const { getByLabelText } = renderContactCard(contactWithEmptyPic);
        const contactCard = getByLabelText(/contact-card/i);
        fireEvent.press(contactCard);
        expect(mockReplace).toHaveBeenCalledWith('IndividualChat', {
          name: contact.name,
          originalNumber: contact.originalNumber,
          mobileNumber: contact.mobileNumber,
          profilePic: '',
        });
    });

});
