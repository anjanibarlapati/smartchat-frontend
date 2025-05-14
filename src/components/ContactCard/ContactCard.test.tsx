import { render } from '@testing-library/react-native';
import { ContactCard } from './ContactCard.tsx';
import { store } from '../../redux/store';
import { Provider } from 'react-redux';
import { Contact } from '../../types/Contacts.ts';


const renderContactCard = (contact: Contact) => {
    return render(
        <Provider store={store}>
             <ContactCard contact={contact}/>
        </Provider>
    );
};

const contact:Contact = {
    name:'Anjani',
    mobileNumber:'8639523822',
    profilePicture:'/image.jpg',
    doesHaveAccount: false,
};

describe('Contact Card Component', () => {
   test('Should render the elements correctly', () => {
      const {getByLabelText, getByText} = renderContactCard(contact);
      expect(getByLabelText('profile-image').props.source).toEqual({uri: contact.profilePicture});
      expect(getByText(contact.name)).toBeTruthy();
      expect(getByText(contact.mobileNumber)).toBeTruthy();
      expect(getByText(/invite/i)).toBeTruthy();
   });

    test('Should render empty image when profile picture', () => {
      const {getByLabelText, getByText} = renderContactCard({...contact, profilePicture:''});
      expect(getByLabelText('profile-image').props.source).toEqual(require('../../../assets/images/profileImage.png'));
      expect(getByText(contact.name)).toBeTruthy();
      expect(getByText(contact.mobileNumber)).toBeTruthy();
      expect(getByText(/invite/i)).toBeTruthy();
   });
});
