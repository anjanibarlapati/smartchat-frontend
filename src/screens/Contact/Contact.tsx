import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ContactCard } from '../../components/ContactCard/ContactCard.tsx';
import { CustomAlert } from '../../components/CustomAlert/CustomAlert.tsx';
import LoadingIndicator from '../../components/Loading/Loading.tsx';
import { useAppTheme } from '../../hooks/appTheme';
import { useAlertModal } from '../../hooks/useAlertModal.ts';
import { getRealmInstance } from '../../realm-database/connection.ts';
import { getContactsFromRealm } from '../../realm-database/operations/getContacts.ts';
import { storeState } from '../../redux/store.ts';
import { Contact as ContactType } from '../../types/Contacts.ts';
import { Theme } from '../../utils/themes';
import { getStyles } from './Contact.styles';
import { syncContacts } from '../../utils/syncContacts.ts';


export function Contact(): React.JSX.Element {
  const theme: Theme = useAppTheme();

  const { width, height} = useWindowDimensions();
  const styles = getStyles(theme, width, height);
  const [selectedTab, setSelectedTab] = useState('Contacts');
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const user = useSelector((state: storeState)=> state.user);
  const {
      alertVisible, alertMessage, alertType, showAlert, hideAlert,
    } = useAlertModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadContacts = useCallback(() => {
      const db = getRealmInstance();
      const contactsFromDb = getContactsFromRealm(db);
      contactsFromDb.sort((a, b) => a.name.localeCompare(b.name));
      setContacts(contactsFromDb);
  }, []);

  useEffect(()=>{
    const syncUserContacts = async() =>{
      try{
        const result = await syncContacts(user.mobileNumber, true);
        if(result === false) {
          showAlert('Permission for contacts was denied', 'warning');
        } else{
          loadContacts();
        }
      } catch(error){
        showAlert('Failed to sync contacts', 'error');
      } finally{
        setRefreshing(false);
      }
    };
    if(refreshing){
      syncUserContacts();
    }
  }, [loadContacts, refreshing, user.mobileNumber, showAlert]);


  useEffect(() => {
    const loadInitialContacts = async () => {
      try {
        setIsLoading(true);
        loadContacts();
      } catch (error) {
        showAlert('Something went wrong while fetching contacts details. Please try again', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialContacts();
  }, [loadContacts, showAlert]);

const filteredContacts = useMemo(() => {
  if (contacts.length === 0) {
    return [];
  }
  return selectedTab === 'Contacts' ? contacts.filter(contact => contact.doesHaveAccount) : contacts.filter(contact => !contact.doesHaveAccount);
}, [contacts, selectedTab]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.switchTabs} accessibilityLabel="switch-tabs">
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
          <LoadingIndicator visible={isLoading} />
        </View>
        <View style={styles.contactsContainer}>
          {contacts.length === 0 ? (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>
                Add your friends to contacts and invite them to SmartChat
              </Text>
            </View>
          ) : filteredContacts.length === 0 ? (
            selectedTab === 'Contacts' ? (
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>
                  Invite your contacts to SmartChat and start your conversations
                </Text>
              </View>
            ) : (
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>
                  All your contacts are on SmartChat. Continue your
                  conversations with them
                </Text>
              </View>
            )
          ) : (
            <FlatList
              data={filteredContacts}
              keyExtractor={item => `${item.originalNumber}+${item.name}`}
              contentContainerStyle={styles.contactsBody}
              initialNumToRender={10}
              renderItem={({item}) => <ContactCard contact={item} isSelfContact={user.mobileNumber === item.mobileNumber} />}
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
              }}
              accessibilityLabel="contacts-list"
            />
          )}
        </View>
        <CustomAlert visible={alertVisible} message={alertMessage} type={alertType} onClose={hideAlert} />
      </View>
    </>
  );
}
