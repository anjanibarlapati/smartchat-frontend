import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: theme.primaryBackground,
  },
  body: {
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    gap: 10,
    paddingTop: 50,
  },
  profileImageBox: {
    position: 'relative',
  },
  profileImg: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  editProfileImgBox: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 15,
    backgroundColor: '#009090',
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    height: 15,
    width: 15,
  },
  detailsContainer: {
    display: 'flex',
    paddingTop: 20,
    padding: 2,
    gap: 2,
    width: '90%',
    paddingRight: 30,
  },
  image: {
    height: 30,
    width: 30,
  },
  deleteImg: {
    height: 28,
    width: 28,
  },
  deleteText: {
    fontSize: 15,
    color: theme.primaryErrorText,
    fontFamily: 'Nunito',
  },
  valueText: {
    fontSize: 15,
    color: theme.primaryTextColor,
    fontFamily: 'Nunito',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    maxWidth: '100%',
    padding: 10,
    gap: 20,
  },
  headerBackgroundColor: {
    backgroundColor: theme.primaryBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.primaryInputBackground,
  },
  headerTitleStyle: {
    color: theme.primaryColor,
    fontSize: 20,
    fontWeight: '700',
  },
});
