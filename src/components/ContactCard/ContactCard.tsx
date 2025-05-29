import { Image, Pressable, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './ContactCard.styles';
import { useAppTheme } from '../../hooks/appTheme';
import { Contact } from '../../types/Contacts';
import { ContactScreenNavigationProps } from '../../types/Navigations';
import { sendSmsInvite } from '../../utils/sendSmsInvite';
import { Theme } from '../../utils/themes';


function ContactCard ({contact}: {contact: Contact}):React.JSX.Element {

    const {width} = useWindowDimensions();
    const theme: Theme = useAppTheme();
    const styles = getStyles(theme, width);
    const navigation = useNavigation<ContactScreenNavigationProps>();

    return (
        <TouchableOpacity style={styles.body} accessibilityLabel="contact-card"
            onPress={()=> {
                contact.doesHaveAccount ?
                navigation.replace('IndividualChat', {name: contact.name, originalNumber: contact.originalNumber, mobileNumber: contact.mobileNumber, profilePic: contact.profilePicture ? contact.profilePicture : ''})
                : sendSmsInvite(contact.originalNumber);}
            }
        >
            <Image
                style={styles.profileIcon}
                source={contact.profilePicture ? {uri: contact.profilePicture}
                : require('../../../assets/images/profileImage.png') }
                accessibilityLabel="profile-image"
                resizeMode="cover"
            />
            <View style={styles.contactContainer}>
                <View style={styles.nameInviteContainer}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.contactName}>{contact.name}</Text>
                    { !contact.doesHaveAccount && <Pressable onPress= {()=> sendSmsInvite(contact.originalNumber)}>
                        <Text style={styles.inviteText}>Invite</Text>
                    </Pressable> }
                </View>
                <Text style={styles.contactNumber}>{contact.originalNumber}</Text>
            </View>
        </TouchableOpacity>
    );
}

export { ContactCard };



