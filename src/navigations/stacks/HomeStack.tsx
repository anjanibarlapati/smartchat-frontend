import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {Contact} from '../../screens/Contact/Contact';
import {getStyles} from '../../screens/Contact/Contact.styles';
import {Home} from '../../screens/Home/Home';
import {
  ContactScreenNavigationProps,
  HomeStackParamList,
} from '../../types/Navigations';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Theme} from '../../utils/themes';
import {useAppTheme} from '../../hooks/appTheme';
import '../../screens/Contact/Contact.styles';
import {getStyles as getHomeScreenStyles} from '../../screens/Home/Home.styles';
import {IndividualChat} from '../../screens/IndividualChat/IndividualChat';

const Stack = createNativeStackNavigator<HomeStackParamList>();

function GetHomeScreenOptions() {
  const theme: Theme = useAppTheme();
  const styles = getHomeScreenStyles(theme);
  return {
    headerStyle: {
      backgroundColor: theme.primaryBackground,
    },
    headerTitle: '',
    headerLeft: () => (
      <View>
        <Text style={styles.headerText}>SmartChat</Text>
      </View>
    ),
  };
}

function getContactScreenOptions(
  navigation: ContactScreenNavigationProps,
  theme: Theme,
): NativeStackNavigationOptions {
  const styles = getStyles(theme);

    const handleNavigation = () =>{
      navigation.goBack();
    };
    return {
        headerShown: true,
        headerStyle: {
        backgroundColor: '#FFFFF',
        },
        headerTitle: '',
        headerLeft: () => (
            <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleNavigation}>
                <Image
                    style={styles.backIcon}
                    source={require('../../../assets/images/chevron.png')}
                />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Select contact</Text>
            </View>
        ),
        headerRight: () => (
            <Image
                style={styles.userIcon}
                source={theme.images.contactUser}
            />
        ),
    };
}

export function HomeStack(): React.JSX.Element {
  const theme: Theme = useAppTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={GetHomeScreenOptions()}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={({navigation}) => getContactScreenOptions(navigation, theme)}
      />
      <Stack.Screen name="IndividualChat" component={IndividualChat} />
    </Stack.Navigator>
  );
}
