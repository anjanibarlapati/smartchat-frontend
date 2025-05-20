import { Contact } from 'react-native-contacts';
import { fetchContacts } from '../screens/Contact/Contact.service';
import { Contact as ContactType, UserContact } from '../types/Contacts';
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import * as RNLocalize from 'react-native-localize';

const defaultCountryCode = RNLocalize.getCountry() as CountryCode || 'IN';

function normalizeNumber(number: string): string | null {
    if (!number) {
      return null;
    }
    const parsedNumber = parsePhoneNumberFromString(number, defaultCountryCode);
    if (!parsedNumber || !parsedNumber.isValid()) {
      return null;
    }
    return parsedNumber.formatInternational();
}


export const getContactsDetails = async (contacts: Contact[], access_token: string) => {
      const deviceContacts = contacts.flatMap(contact => {
        const name = `${contact.givenName} ${contact.middleName} ${contact.familyName}`.trim();
        return (contact.phoneNumbers || []).map(phone => {
            const normalizedPhoneNumber = normalizeNumber(phone.number);
            return {
              name,
              originalNumber: phone.number,
              mobileNumber: normalizedPhoneNumber,
            };
        });
      });

      const phoneNumbers = deviceContacts.map(contact => contact.mobileNumber).filter((mobileNumber): mobileNumber is string => mobileNumber !== null && mobileNumber !== undefined);


      const response = await fetchContacts(phoneNumbers, access_token);
      const result = await response.json();

      const resultantContacts: ContactType[] = deviceContacts.map(contact => {
          const data = result.find( (resultantContact: UserContact) => resultantContact.mobileNumber === contact.mobileNumber);
          return {
            name: contact.name,
            mobileNumber: contact.originalNumber,
            doesHaveAccount: data ? data.doesHaveAccount : false,
            profilePicture: data ? data.profilePicture : null,
          };
      });
      return resultantContacts;
};
