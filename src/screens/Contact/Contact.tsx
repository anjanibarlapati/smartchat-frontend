import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Text, TouchableOpacity, View} from 'react-native';
import Contacts from 'react-native-contacts';
import EncryptedStorage from 'react-native-encrypted-storage';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {ContactCard} from '../../components/ContactCard/ContactCard.tsx';
import LoadingIndicator from '../../components/Loading/Loading.tsx';
import {getStyles} from './Contact.styles';
import {useAppTheme} from '../../hooks/appTheme';
import {requestPermission} from '../../permissions/permissions.ts';
import {setContacts} from '../../redux/reducers/contacts.reducer.ts';
import {storeState} from '../../redux/store.ts';
import {Contact as ContactType} from '../../types/Contacts.ts';
import {RootStackParamList} from '../../types/Navigations.ts';
import {getContactsDetails} from '../../utils/getContactsDetails.ts';
import {getTokens} from '../../utils/getTokens.ts';
import {Theme} from '../../utils/themes';

export function Contact(): React.JSX.Element {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedTab, setSelectedTab] = useState('Contacts');
  const dispatch = useDispatch();
  const contacts = useSelector((state: storeState) => state.contacts.contacts);
  const user = useSelector((state: storeState) => state.user);
  const [filteredContacts, setFilteredContacts] = useState<ContactType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setIsLoading(true);
        const hasPermission = await requestPermission('contacts');
        if (!hasPermission) {
          Alert.alert('Permission for contacts was denied');
          return;
        }
        const tokens = await getTokens(user.mobileNumber);
        if (!tokens) {
          await EncryptedStorage.clear();
          navigation.reset({
            index: 0,
            routes: [{name: 'WelcomeScreen'}],
          });
          return;
        }
        const deviceContacts = await Contacts.getAll();
        if (deviceContacts.length === 0) {
          dispatch(setContacts([]));
          return;
        }
        const resultantContacts = await getContactsDetails(
          deviceContacts,
          tokens.access_token,
        );
        dispatch(setContacts(resultantContacts));
      } catch (error) {
        Alert.alert(
          'Something went wrong while fetching contacts details. Please try again',
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadContacts();
  }, [dispatch, navigation, user.mobileNumber]);

  useEffect(() => {
    const filterContacts = (userContacts: ContactType[]) => {
      if (userContacts.length === 0) {
        return [];
      }
      if (selectedTab === 'Contacts') {
        setFilteredContacts(
          userContacts.filter(contact => contact.doesHaveAccount),
        );
      } else {
        setFilteredContacts(
          userContacts.filter(contact => !contact.doesHaveAccount),
        );
      }
    };
    filterContacts(contacts);
  }, [contacts, selectedTab]);

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
              keyExtractor={item => item.mobileNumber}
              contentContainerStyle={styles.contactsBody}
              initialNumToRender={10}
              renderItem={({item}) => <ContactCard contact={item} />}
            />
          )}
        </View>
      </View>
    </>
  );
}
