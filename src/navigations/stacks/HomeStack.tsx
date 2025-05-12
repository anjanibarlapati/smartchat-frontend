import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Contact } from '../../screens/Contact/Contact';
import { Home } from '../../screens/Home/Home';
import { HomeStackParamList } from '../../types/Navigations';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/appTheme';
import { Theme } from '../../utils/themes';
import { getStyles } from '../../screens/Home/Home.styles';

const Stack = createNativeStackNavigator<HomeStackParamList>();


function GetHomeScreenOptions () {
    const theme: Theme = useAppTheme();
    const styles = getStyles(theme);
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
export function HomeStack (): React.JSX.Element{
    return(

        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={GetHomeScreenOptions()}/>
            <Stack.Screen name="Contact" component={Contact} />
        </Stack.Navigator>
    );
}
