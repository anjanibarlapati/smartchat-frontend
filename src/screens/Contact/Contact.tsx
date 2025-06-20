import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Contacts from 'react-native-contacts';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ContactCard } from '../../components/ContactCard/ContactCard.tsx';
import { CustomAlert } from '../../components/CustomAlert/CustomAlert.tsx';
import LoadingIndicator from '../../components/Loading/Loading.tsx';
import { useRealmReset } from '../../contexts/RealmContext.tsx';
import { useAppTheme } from '../../hooks/appTheme';
import { useAlertModal } from '../../hooks/useAlertModal.ts';
import { requestPermission } from '../../permissions/permissions.ts';
import { getRealmInstance } from '../../realm-database/connection.ts';
import { clearAllContactsInRealm } from '../../realm-database/operations/clearContacts.ts';
import { getContactsFromRealm } from '../../realm-database/operations/getContacts.ts';
import { insertContactsInRealm } from '../../realm-database/operations/insertContacts.ts';
import { storeState } from '../../redux/store.ts';
import { Contact as ContactType } from '../../types/Contacts.ts';
import { RootStackParamList } from '../../types/Navigations.ts';
import { getContactsDetails } from '../../utils/getContactsDetails.ts';
import { getTokens } from '../../utils/getTokens.ts';
import { Theme } from '../../utils/themes';
import { getStyles } from './Contact.styles';


export function Contact(): React.JSX.Element {
  const theme: Theme = useAppTheme();

  const { width, height} = useWindowDimensions();
  const styles = getStyles(theme, width, height);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedTab, setSelectedTab] = useState('Contacts');
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const user = useSelector((state: storeState)=> state.user);
  const {
      alertVisible, alertMessage, alertType, showAlert, hideAlert,
    } = useAlertModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {resetRealm} = useRealmReset();

  useEffect(() => {
    const loadContacts = async () => {
      const db =  getRealmInstance();
      try {
        setIsLoading(true);
        const hasPermission = await requestPermission('contacts');
        if (!hasPermission) {
          showAlert('Permission for contacts was denied', 'warning');
          return;
        }
        const tokens = await getTokens(user.mobileNumber);
        if (!tokens) {
          await EncryptedStorage.clear();
          resetRealm();
          return;
        }

        const netState = await NetInfo.fetch();
        const isOnline = netState.isConnected;
        if (!isOnline) {
          const dbContacts = getContactsFromRealm(db);
          setContacts(dbContacts);
          return;
        }

        const deviceContacts = await Contacts.getAll();
        if (!deviceContacts || deviceContacts.length === 0) {
          clearAllContactsInRealm(db);
          setContacts([]);
          return;
        }
        const resultantContacts = await getContactsDetails(deviceContacts, tokens.access_token);
        clearAllContactsInRealm(db);
        insertContactsInRealm(db, resultantContacts);
        setContacts(resultantContacts);
      } catch (error) {
          showAlert('Something went wrong while fetching contacts details. Please try again', 'error');
        } finally{
          setIsLoading(false);
        }
    };
    loadContacts();
  }, [navigation, resetRealm, showAlert, user.mobileNumber]);

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
            />
          )}
        </View>
        <CustomAlert visible={alertVisible} message={alertMessage} type={alertType} onClose={hideAlert} />
      </View>
    </>
  );
}
