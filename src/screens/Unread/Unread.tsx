import { getStyles } from '../Home/Home.styles';
import {useAppTheme} from '../../hooks/appTheme';
import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AllChatsTabScreenNavigationProps, ContactScreenNavigationProps} from '../../types/Navigations';
import {Theme} from '../../utils/themes';
import {getStyles as UnreadStyles} from './Unread.styles';

export function Unread(): React.JSX.Element {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const Ustyles = UnreadStyles(theme);
  const navigation = useNavigation<ContactScreenNavigationProps>();
  const navigationToAllChats = useNavigation<AllChatsTabScreenNavigationProps>();
  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <View style={styles.textContainer}>
            <Text style={Ustyles.bodyText}>
              No unread chats here
            </Text>
            <TouchableOpacity onPress={() => navigationToAllChats.navigate('AllChatsTab')}>
            <Text style={Ustyles.viewText}>View all chats</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => navigation.navigate('Contact')}
          style={styles.addContactContainer}>
          <Image
            source={theme.images.contactsAddcon}
            style={styles.addContactImage}
            accessibilityLabel="addContact"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
