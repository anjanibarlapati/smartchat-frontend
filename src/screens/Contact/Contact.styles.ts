import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme, width: number, height: number) => StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: theme.primaryBackground,
    display:'flex',
    gap:4,
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  backIcon: {
    height: 30,
    width:30,
  },
  headerTitle: {
    fontSize: width < 360 ? 18 : 20,
    color: theme.primaryColor,
    fontFamily: 'Nunito-Bold',
  },
  userIcon: {
    height: 30,
    width:30,
  },
  switchTabs: {
    backgroundColor: theme.secondaryBackgroundColor,
    height: width > 600 ? '8%' : '7%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  content: {
    alignItems: 'center',
  },
  activeText:{
    color: theme.primaryColor,
    padding:width < 400 ? 12 : 15,
    fontSize:width < 360 ? 13 : 15,
    fontFamily:'Nunito-Bold',
  },
  inActiveText:{
    color: theme.secondaryTextColor,
    padding:width < 400 ? 12 : 15,
    fontSize:width < 360 ? 13 : 15,
    fontFamily:'Nunito-Bold',
  },
  line:{
    height: 4,
    width: width > 600 ? '120%' : '100%',
    backgroundColor:theme.primaryColor,
  },
  contactsContainer:{
    flex:1,
  },
  contactsBody:{
    display:'flex',
    flexDirection:'column',
    paddingBottom: height * 0.2,

  },
  messageContainer:{
    display:'flex',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    padding:20,
  },
  messageText:{
    color: theme.primaryColor,
    fontSize:width < 360 ? 14 : 16,
    fontFamily:'Nunito-Bold',
  },
});

