import React from 'react';
import {Image, Pressable, Text,View} from 'react-native';
import {styles} from './Welcome.styles';
import { useTranslation } from 'react-i18next';
const WelcomeScreen = ():React.JSX.Element => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        style={styles.logoStyles}
        source={require('../../../assets/images/Applogo.png')}
        accessibilityLabel="appLogo"
      />
      <View style={styles.appnameTagline}>
        <Text style={styles.appname}>{t('SmartChat')}</Text>
        <Text style={styles.apptagline}>{t('Where conversations evolve')}</Text>
      </View>
      <Pressable style={styles.getstartButton}>
        <View style={styles.buttonContent}>
          <Text style={styles.getstartText}>{t("Let's Get Started")}</Text>
          <Image
            style={styles.chevronIconStyles}
            source={require('../../../assets/icons/rightArrowIcon.png')}
            accessibilityLabel="chevronIcon"
          />
        </View>
      </Pressable>
    </View>
  );
};

export default WelcomeScreen;
