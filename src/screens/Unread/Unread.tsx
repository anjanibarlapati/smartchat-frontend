import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useAppTheme } from '../../hooks/appTheme';
import { AllChatsTabScreenNavigationProps, ContactScreenNavigationProps } from '../../types/Navigations';
import { Theme } from '../../utils/themes';
import { getStyles } from '../Home/Home.styles';
import { ChatCard } from '../../components/ChatCard/ChatCard';
import { useUnreadChats } from '../../hooks/unreadChats';
import { HomeChats } from '../../hooks/homechats';

export function Unread(): React.JSX.Element {

  const {width} = useWindowDimensions();
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme, width);
  const navigation = useNavigation<ContactScreenNavigationProps>();
  const navigationToAllChats = useNavigation<AllChatsTabScreenNavigationProps>();
  const unreadChats: HomeChats[] = useUnreadChats();
  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
          {unreadChats.length === 0 ? (
            <View style={styles.unreadTextContainer}>

                <Image
                  source={theme.images.unreadImageIcon}
                  style={styles.homeImageStyles}
                  accessibilityLabel="unread-image"
                />
              <Text style={styles.unReadBodyText}>
                No unread chats here
              </Text>
              <TouchableOpacity onPress={() => navigationToAllChats.navigate('AllChatsTab')}>
                <Text style={styles.viewText}>View all chats</Text>
              </TouchableOpacity>
            </View>
           ) : (
              <View style={styles.homeChatsContainer}>
                <FlatList
                    data={unreadChats}
                    keyExtractor={(item) => item.contact.mobileNumber}
                    renderItem={({ item }) => (
                    <ChatCard
                      contact={item.contact}
                      message={item.lastMessage}
                      unreadCount={item.unreadCount}
                    />
                    )}
                  />
                </View>
        )}
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
