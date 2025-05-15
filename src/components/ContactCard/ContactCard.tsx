import { Image, Pressable, Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/appTheme';
import { Theme } from '../../utils/themes';
import {getStyles} from './ContactCard';
import { Contact } from '../../types/Contacts';
import { sendSmsInvite } from '../../utils/sendSmsInvite';

function ContactCard ({contact}: {contact: Contact}):React.JSX.Element {

    const theme: Theme = useAppTheme();
    const styles = getStyles(theme);
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <Image
                    style={styles.profileIcon}
                    source={contact.profilePicture ? {uri: contact.profilePicture}
                    : require('../../../assets/images/profileImage.png') }
                    accessibilityLabel="profile-image"
                    resizeMode="cover"
                />
                <View style={styles.contactContainer}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactNumber}>{contact.mobileNumber}</Text>
                </View>
            </View>
            { !contact.doesHaveAccount && <Pressable onPress= {()=> sendSmsInvite(contact.mobileNumber)}>
                <Text style={styles.inviteText}>Invite</Text>
            </Pressable> }
        </View>
    );
}

export { ContactCard };



