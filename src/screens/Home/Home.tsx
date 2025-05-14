import React from 'react';
import { Image, ScrollView, Text,  TouchableOpacity, View } from 'react-native';
import { getStyles } from './Home.styles';
import { useAppTheme } from '../../hooks/appTheme';
import { Theme } from '../../utils/themes';
import { useNavigation } from '@react-navigation/native';
import { ContactScreenNavigationProps } from '../../types/Navigations';


export function Home(): React.JSX.Element {
    const theme : Theme = useAppTheme();
    const styles = getStyles(theme);
    const navigation = useNavigation<ContactScreenNavigationProps >();
  return (
      <View style={styles.container}>
 
        <View style={styles.totalContainer}>
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            <View style={styles.textContainer}>
            <Text style={styles.bodyText}>Start Conversations with your closed ones</Text>
            </View>
          </ScrollView>
            <TouchableOpacity onPress={() => navigation.navigate('Contact')} style={styles.addContactContainer}>
              <Image source= {require('../../../assets/icons/contacts-add-icon.png')} style={styles.addContactImage} accessibilityLabel="addContact"/>
            </TouchableOpacity>
        </View>
      </View>
  );
}

