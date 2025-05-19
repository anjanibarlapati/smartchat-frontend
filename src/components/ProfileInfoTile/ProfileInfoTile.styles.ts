import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
  box: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    gap: 20,
  },
  image: {
    height: 30,
    width: 30,
  },
  detailBox: {
    display: 'flex',
    gap: 5,
  },
  headerText: {
    fontSize: 16,
    color: theme.primaryTextColor,
    fontFamily: 'Nunito-SemiBold',
  },
  valueText: {
    fontSize: 14,
    color: theme.secondaryTextColor,
    fontFamily: 'Nunito-Regular',
  },
  inputBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#008080',
    padding: 2,
    width: '60%',
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: theme.secondaryTextColor,
  },
  tickImage: {
    height: 20,
    width: 20,
  },
  closeImage: {
    height: 16,
    width: 16,
  },
  editTileBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  statusBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editTextIcon: {
    width:15,
    height:15,
  },
  fieldBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
});
