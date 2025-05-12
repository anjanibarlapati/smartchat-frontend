import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor:theme.primaryBackground,
  },
  header: {
    marginTop: '20%',
    display: 'flex',
    flexDirection: 'row',
    height: '5%',
    gap:'40%',
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
    height: 25,
    width:30,
  },
  switchTabs: {
    backgroundColor: theme.secondaryBackgroundColor,
    height: '8%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    height:2,
    width:'100%',
    backgroundColor:theme.primaryColor,
  },
});

