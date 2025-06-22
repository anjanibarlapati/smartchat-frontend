import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Platform } from 'react-native';
import { Contact } from 'react-native-contacts';
import { fetchContacts } from '../screens/Contact/Contact.service';
import { Contact as ContactType, UserContact } from '../types/Contacts';
import { sha256 } from 'js-sha256';
import EncryptedStorage from 'react-native-encrypted-storage';

const defaultCountryCode = 'IN';
const MAX_SYNC_TIME = 24 * 60 * 60 * 1000;

export function normalizeNumber(number: string): string | null {
  if (!number) {
    return null;
  }
  const parsedNumber = parsePhoneNumberFromString(number, defaultCountryCode);
  if (!parsedNumber || !parsedNumber.isValid()) {
    return null;
  }
  return parsedNumber.formatInternational();
}


export const getContactsDetails = async (contacts: Contact[], access_token: string, shouldSync?: boolean) => {
  try {

    const deviceContacts = Platform.OS === 'ios' ? contacts.flatMap(contact => {
      const name = `${contact.givenName} ${contact.middleName} ${contact.familyName}`.trim();
      return (contact.phoneNumbers || []).map(phone => {
        const normalizedPhoneNumber = normalizeNumber(phone.number);
        return {
          name,
          originalNumber: phone.number,
          mobileNumber: normalizedPhoneNumber,
        };
      });
    }) : contacts.map(contact => {
      const name = `${contact.givenName} ${contact.middleName || ''} ${contact.familyName || ''}`.trim();
      const phone = (contact.phoneNumbers && contact.phoneNumbers[0]) || { number: '' };
      const normalizedPhoneNumber = normalizeNumber(phone.number);
      return {
        name,
        originalNumber: phone.number,
        mobileNumber: normalizedPhoneNumber,
      };
    });
    const previousHash = await EncryptedStorage.getItem('contacts_hash');

    const contactHashInput = deviceContacts.filter(c => c.mobileNumber)
      .map(contact => `${contact.name}_${contact.mobileNumber}`)
      .sort()
      .join('|');

    const currentHash = sha256(contactHashInput);

    const lastSyncedAt = await EncryptedStorage.getItem('contacts_last_sync');
    const twentyFourHoursAgo = Date.now() - MAX_SYNC_TIME;
    const lastSyncedTime = lastSyncedAt ? new Date(lastSyncedAt).getTime() : 0;
    const shouldSyncDueToTime = lastSyncedTime <= twentyFourHoursAgo;

    if (!shouldSync && previousHash && previousHash === currentHash && !shouldSyncDueToTime) {
      console.log('Device Contacts were not changed. Skipping syncing contacts.');
      return [];
    }

    const phoneNumbers = deviceContacts.map(contact => contact.mobileNumber).filter((mobileNumber): mobileNumber is string => mobileNumber !== null && mobileNumber !== undefined);

    const response = await fetchContacts(phoneNumbers, access_token);
    const result = await response.json();


    const resultantContacts: ContactType[] = [];

    const uniqueContacts = new Set<string>();

    deviceContacts.forEach(contact => {
      const data = result.find((resultantContact: UserContact) => resultantContact.mobileNumber === contact.mobileNumber);

      const name = contact.name;
      const mobileNumber = data ? data.mobileNumber : contact.originalNumber;
      if (!name || !mobileNumber) {
        return;
      }
      const uniqueKey = `${name}_${mobileNumber}`;

      if (!uniqueContacts.has(uniqueKey)) {
        uniqueContacts.add(uniqueKey);
        resultantContacts.push({
          name,
          originalNumber: contact.originalNumber,
          mobileNumber,
          doesHaveAccount: data ? data.doesHaveAccount : false,
          profilePicture: data ? data.profilePicture : null,
        });
      }
    });
    resultantContacts.sort((a, b) => a.name.localeCompare(b.name));
    await EncryptedStorage.setItem('contacts_hash', currentHash);
    await EncryptedStorage.setItem('contacts_last_sync', new Date().toISOString());
    return resultantContacts;
  } catch (error) {
    throw new Error('Something went wrong while fetching contacts details');
  }
};
