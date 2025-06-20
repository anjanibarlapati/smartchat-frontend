import { useNavigation } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { Contact } from '../../types/Contacts.ts';
import { sendSmsInvite } from '../../utils/sendSmsInvite.ts';
import { ContactCard } from './ContactCard.tsx';

jest.mock('../../permissions/permissions.ts', () => ({
  requestPermission: jest.fn(),
}));

const renderContactCard = (contact: Contact, isSelfContact: boolean) => {
  return render(
    <Provider store={store}>
      <ContactCard contact={contact} isSelfContact={isSelfContact}/>
    </Provider>,
  );
};
jest.mock('../../utils/sendSmsInvite.ts', () => ({
  sendSmsInvite: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

const contact: Contact = {
  name: 'Anjani',
  originalNumber: '8639523822',
  mobileNumber: '+91 86395 23822',
  profilePicture: '/image.jpg',
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
    const {getByLabelText, getByText} = renderContactCard(contact, false);
    expect(getByLabelText('profile-image').props.source).toEqual({
      uri: contact.profilePicture,
    });
    expect(getByText(contact.name)).toBeTruthy();
    expect(getByText(contact.originalNumber)).toBeTruthy();
    expect(getByText(/invite/i)).toBeTruthy();
  });

  test('Should render empty image when profile picture', () => {
    const {getByLabelText, getByText} = renderContactCard({
      ...contact,
      profilePicture: null,
    }, false);
    expect(getByLabelText('profile-image').props.source).toEqual(
      require('../../../assets/images/profileImage.png'),
    );
    expect(getByText(contact.name)).toBeTruthy();
    expect(getByText(contact.originalNumber)).toBeTruthy();
    expect(getByText(/invite/i)).toBeTruthy();
  });

  test('should send sms invite on clicking invite button', async () => {
    const {getByText} = renderContactCard(contact, false);
    const inviteButton = getByText(/invite/i);
    expect(inviteButton).toBeTruthy();
    fireEvent.press(inviteButton);
    expect(sendSmsInvite).toHaveBeenCalledWith(contact.originalNumber);
  });

  test('Should send sms invite on clicking contact who are not on app', async () => {
    const {getByLabelText} = renderContactCard(contact, false);
    const contactCard = getByLabelText(/contact-card/i);
    fireEvent.press(contactCard);
    expect(sendSmsInvite).toHaveBeenCalledWith(contact.originalNumber);
  });

  test('Should navigate to individual screen on clicking contact who are on app', async () => {
    const contactWithAccount = {
      ...contact,
      doesHaveAccount: true,
    };
    const {getByLabelText} = renderContactCard(contactWithAccount, false);
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
      profilePicture: null,
    };
    const {getByLabelText} = renderContactCard(contactWithEmptyPic, false);
    const contactCard = getByLabelText(/contact-card/i);
    fireEvent.press(contactCard);
    expect(mockReplace).toHaveBeenCalledWith('IndividualChat', {
      name: contact.name,
      originalNumber: contact.originalNumber,
      mobileNumber: contact.mobileNumber,
      profilePic: null,
    });
  });

  test('Should append (You) for self contact', () => {
    const {getByText} = renderContactCard(contact, true);
    expect(getByText(`${contact.name} (You)`)).toBeTruthy();
  });
  test('Should apply styles based on the width of the screen', () => {
    const {getByLabelText} = renderContactCard(contact, false);
    const contactName = getByLabelText('contact-container').parent;
    expect(contactName?.props.style.width).toBe('85%');
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({width: 10, height: 100});
    renderContactCard(contact, false);
    const smallScreenContactName =
      screen.getByLabelText('contact-container').parent;
    expect(smallScreenContactName?.props.style.width).toBe('80%');
  });
});
