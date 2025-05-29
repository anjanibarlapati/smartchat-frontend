import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme, width: number, height:number) => StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: theme.primaryBackground,
  },
  body: {
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: width > 600 ? 40 : 10,
    gap: 10,
    paddingTop: height > 700 ? 30 : 50,
  },
  profileImageBox: {
    position: 'relative',
  },
  profileImg: {
    height: width > 600 ? 120 : 100,
    width: width > 600 ? 120 : 100,
    borderRadius: width > 600 ? 60 : 50,
  },
  editProfileImgBox: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 15,
    backgroundColor: '#009090',
    height: width > 600 ? 35 : 30,
    width: width > 600 ? 35 : 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    height: width > 600 ? 18 : 15,
    width: width > 600 ? 18 : 15,
  },
  detailsContainer: {
    display: 'flex',
    paddingTop: 20,
    padding: 2,
    gap: 2,
    width: width > 700 ? '70%' : '90%',
    paddingRight: width > 600 ? 50 : 30,

  },
  image: {
    height: 30,
    width: 30,
  },
  deleteImg: {
    height: 26,
    width: 28,
  },
  deleteText: {
    fontSize: width > 600 ? 17 : 15,
    color: theme.primaryErrorText,
    fontFamily: 'Nunito-SemiBold',
  },
  valueText: {
    fontSize: width > 600 ? 17 : 15,
    color: theme.primaryTextColor,
    fontFamily: 'Nunito-SemiBold',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    maxWidth: '100%',
    padding: width > 600 ? 10 : 10,
    gap: width > 600 ? 20 : 20,
  },
  headerBackgroundColor: {
    backgroundColor: theme.primaryBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.primaryInputBackground,
  },
  headerTitleStyle: {
    color: theme.primaryColor,
    fontSize: width > 600 ? 22 : 20,
    fontFamily:'Nunito-Bold',
  },
});
