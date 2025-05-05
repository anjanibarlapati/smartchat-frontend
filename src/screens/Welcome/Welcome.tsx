import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {styles} from './Welcome';

const WelcomeScreen = ():React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Image
        testID="app-logo"
        style={styles.logoStyles}
        source={require('../../../assets/images/Applogo.png')}
      />
      <View style={styles.appnameTagline}>
        <Text style={styles.appname}>SmartChat</Text>
        <Text style={styles.apptagline}>Where conversations evolve</Text>
      </View>
      <Pressable style={styles.getstartButton}>
        <View style={styles.buttonContent}>
          <Text style={styles.getstartText}>Let's Get Started</Text>
          <Image
            style={styles.chevronIconStyles}
            source={require('../../../assets/icons/rightChevron.png')}
            accessibilityLabel="chevronIcon"
          />
        </View>
      </Pressable>
    </View>
  );
};

export default WelcomeScreen;
