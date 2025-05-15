import React, {useEffect, useState} from 'react';
import {getStyles} from './Contact.styles';
import { Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Theme} from '../../utils/themes';
import {useAppTheme} from '../../hooks/appTheme';
import { ContactCard } from '../../components/ContactCard/ContactCard.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { requestPermission } from '../../permissions/permissions.ts';
import Contacts from 'react-native-contacts';
import { setContacts } from '../../redux/reducers/contacts.reducer.ts';
import { storeState } from '../../redux/store.ts';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Contact as ContactType } from '../../types/Contacts.ts';
import { getContactsDetails } from '../../utils/getContactsDetails.ts';
import LoadingScreen from '../Loading/Loading.tsx';


export function Contact(): React.JSX.Element {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const [selectedTab, setSelectedTab] = useState('Contacts');
  const dispatch = useDispatch();
  const contacts = useSelector((state: storeState)=> state.contacts.contacts);
  const user = useSelector((state: storeState)=> state.user);
  const [filteredContacts, setFilteredContacts] = useState<ContactType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadContacts = async () => {
        const hasPermission = await requestPermission('contacts');
        if (!hasPermission) {
          Alert.alert('Permission for contacts was denied');
          return;
        }
        const tokens = await EncryptedStorage.getItem(user.mobileNumber);
        if (!tokens) {
          Alert.alert('Something went wrong while loading contacts from device. Please try again');
          return;
        }
        const parsedTokens = JSON.parse(tokens);
        try {
          const deviceContacts = await Contacts.getAll();
          const resultantContacts = await getContactsDetails(deviceContacts, parsedTokens.access_token);
          dispatch(setContacts(resultantContacts));
        } catch (error) {
          Alert.alert('Something went wrong while loading contacts from device. Please try again');
        } finally{
          setIsLoading(false);
        }
    };
        loadContacts();
  }, [dispatch, user.mobileNumber]);


  useEffect(() => {
    const filterContacts = (userContacts: ContactType[])=> {
      if(userContacts.length === 0) {
        return [];
      }
      if (selectedTab === 'Contacts') {
          setFilteredContacts(userContacts.filter(contact => contact.doesHaveAccount));
      } else {
          setFilteredContacts(userContacts.filter(contact => !contact.doesHaveAccount));
      }
    };
    filterContacts(contacts);
  }, [contacts, selectedTab]);

  if(isLoading) {
    return(
      <LoadingScreen/>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.switchTabs}>
          <TouchableOpacity onPress={() => setSelectedTab('Contacts')}>
            <Text
              style={
                selectedTab === 'Contacts'
                  ? styles.activeText
                  : styles.inActiveText
              }>
              Contacts on SmartChat
            </Text>
            {selectedTab === 'Contacts' && <View style={styles.line} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab('Invite')}>
            <Text
              style={
                selectedTab === 'Invite'
                  ? styles.activeText
                  : styles.inActiveText
              }>
              Invite to SmartChat
            </Text>
            {selectedTab === 'Invite' && <View style={styles.line} />}
          </TouchableOpacity>
        </View>
        <View style={styles.contactsContainer}>
          <ScrollView contentContainerStyle={styles.contactsBody}>
            {
              filteredContacts.map((contact: ContactType) => (
                <ContactCard key={contact.mobileNumber} contact={contact}/>
              ))
            }
          </ScrollView>

        </View>
      </View>
    </>
  );
}

