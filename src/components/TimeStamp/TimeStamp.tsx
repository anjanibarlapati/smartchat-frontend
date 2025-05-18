import { differenceInCalendarDays, format, isToday, isYesterday } from 'date-fns';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/appTheme';
import { Theme } from '../../utils/themes';
import { getStyles } from './TimeStamp.styles';

export function TimeStamp({from, date }: {from: 'chat-card' | 'chat-screen', date: Date | string}): React.JSX.Element {
    const theme: Theme = useAppTheme();
    const styles = getStyles(theme);

    const messageDate = new Date(date);

    let displayTime = '';
    if (isToday(messageDate)) {
        if(from === 'chat-card') {
            const time = format(messageDate, 'hh:mm a');
            const [timePart, meridiem] = time.split(' ');
            displayTime = `${timePart} ${meridiem}`;
        } else{
            displayTime = 'Today';
        }
    } else if (isYesterday(messageDate)) {
        displayTime = 'Yesterday';
    } else if(from === 'chat-screen' && differenceInCalendarDays(new Date(), messageDate) < 7) {
        displayTime = format(messageDate, 'EEEE');
    } else {
        if (from === 'chat-card') {
            displayTime = format(messageDate, 'dd/MM/yy');
        } else {
            const day = format(messageDate, 'dd');
            const month = format(messageDate, 'MMM');
            const year = format(messageDate, 'yyyy');
            displayTime = `${day} ${month} ${year}`;
        }
    }

    return(
        <View >
            <Text style={from === 'chat-card' ? styles.timeStamp : styles.timeStampBold}>{displayTime}</Text>
        </View>
    );
}
