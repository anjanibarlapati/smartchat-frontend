import React, {useState} from 'react';
import {getStyles} from './Contact.styles';
import { Text, TouchableOpacity, View} from 'react-native';
import {Theme} from '../../utils/themes';
import {useAppTheme} from '../../hooks/appTheme';


export function Contact(): React.JSX.Element {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const [selectedTab, setSelectedTab] = useState('Contacts');

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
      </View>
    </>
  );
}
