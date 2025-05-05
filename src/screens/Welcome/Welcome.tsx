import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {styles} from './Welcome';

const WelcomeScreen = ():React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Image
        testID="app-logo"
        style={styles.logoStyles}
        source={require('/Users/admin/Documents/internal-project-smartchat/project-smartchat-frontend/smartchat-frontend/assets/images/Applogo.png')}
      />
      <View style={styles.appnameTagline}>
        <Text style={styles.appname}>SmartChat</Text>
        <Text style={styles.apptagline}>Where conversations evolve</Text>
      </View>
      <Pressable style={styles.getstartButton}>
        <View style={styles.buttonContent}>
          <Text style={styles.getstartText}>Let's Get Started</Text>
          <Image
            testID="chevronIcon"
            style={styles.chevronIconStyles}
            source={require('/Users/admin/Documents/internal-project-smartchat/project-smartchat-frontend/smartchat-frontend/assets/icons/rightChevron.png')}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default WelcomeScreen;
