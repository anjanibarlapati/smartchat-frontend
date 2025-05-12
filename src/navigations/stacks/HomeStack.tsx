import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Contact } from '../../screens/Contact/Contact';
import { Home } from '../../screens/Home/Home';
import { HomeStackParamList } from '../../types/Navigations';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack (): React.JSX.Element{
    return(

        <Stack.Navigator >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Contact" component={Contact} />
        </Stack.Navigator>
    );
}
