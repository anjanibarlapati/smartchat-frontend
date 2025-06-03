import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Image, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useAppTheme } from '../../hooks/appTheme';
import { Contact } from '../../screens/Contact/Contact';
import '../../screens/Contact/Contact.styles';
import { getStyles } from '../../screens/Contact/Contact.styles';
import { Home } from '../../screens/Home/Home';
import { getStyles as getHomeScreenStyles } from '../../screens/Home/Home.styles';
import { IndividualChat } from '../../screens/IndividualChat/IndividualChat';
import { Unread } from '../../screens/Unread/Unread';
import { ContactScreenNavigationProps, HomeStackParamList } from '../../types/Navigations';
import { Theme } from '../../utils/themes';

const Stack = createNativeStackNavigator<HomeStackParamList>();

function GetHomeScreenOptions() {
  const {width} = useWindowDimensions();
  const theme: Theme = useAppTheme();
  const styles = getHomeScreenStyles(theme, width );
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
  width: number,
  height:number,
): NativeStackNavigationOptions {
  const styles = getStyles(theme, width, height);

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
                    accessibilityLabel="chevronIcon"
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

export function HomeStack({ showUnread = false }: { showUnread?: boolean }): React.JSX.Element {
  const {width, height} = useWindowDimensions();
  const theme: Theme = useAppTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
       component={showUnread ? Unread : Home}
       options={GetHomeScreenOptions()}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={({navigation}) => getContactScreenOptions(navigation, theme, width, height)}
      />
      <Stack.Screen name="IndividualChat" component={IndividualChat} />
    </Stack.Navigator>
  );
}
