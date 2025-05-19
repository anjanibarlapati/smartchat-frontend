import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor:theme.primaryBackground,
    display:'flex',
    gap:15,
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginLeft: '1%',
  },
  headerRight:{
  },
  backIcon: {
    height: 30,
    width:30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primaryColor,
    fontFamily: 'Nunito',
  },
  userIcon: {
    height: 30,
    width:30,
  },
  switchTabs: {
    backgroundColor: theme.secondaryBackgroundColor,
    height: '8%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
  },

  activeText:{
    color: theme.primaryColor,
    padding:16,
    fontSize:15,
    fontFamily:'Nunito',
    fontWeight:'bold',
  },
  inActiveText:{
    color: theme.secondaryTextColor,
    padding:16,
    fontSize:15,
    fontFamily:'Nunito',
    fontWeight:'bold',
  },
  line:{
    height:4,
    width:'100%',
    backgroundColor:theme.primaryColor,
  },
  contactsContainer:{
    flex:1,
  },
  contactsBody:{
    display:'flex',
    flexDirection:'column',
    paddingBottom:'20%',
  },
  messageContainer:{
    display:'flex',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    padding:25,
  },
  messageText:{
    color: theme.primaryColor,
    fontSize:16,
    fontFamily:'Nunito',
    fontWeight:'800',
  },
});

