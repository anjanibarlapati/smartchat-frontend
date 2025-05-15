import { Contact } from 'react-native-contacts';
import { fetchContacts } from '../screens/Contact/Contact.service';
import { Contact as ContactType } from '../types/Contacts';

export const getContactsDetails = async (contacts: Contact[], access_token: string) => {
      const deviceContacts = contacts.flatMap(contact => {
        const name = `${contact.givenName} ${contact.middleName} ${contact.familyName}`.trim();
        return (contact.phoneNumbers || []).map(phone => ({
          name,
          mobileNumber: phone.number.replace('+91', '').replace(/\s|[-]/g, ''),
        }));
      });

      const phoneNumbers = deviceContacts.map(contact => contact.mobileNumber);

      const response = await fetchContacts(phoneNumbers, access_token);
      const result = await response.json();

      const resultantContacts: ContactType[] = deviceContacts.map(contact => {
          const data = result.find( (resultantContact:any) => resultantContact.mobileNumber === contact.mobileNumber);
          return {
            ...contact,
            doesHaveAccount: data ? data.doesHaveAccount : false as boolean,
            profilePicture: data ? data.profilePicture : null,
          };
      });
      return resultantContacts;
};
