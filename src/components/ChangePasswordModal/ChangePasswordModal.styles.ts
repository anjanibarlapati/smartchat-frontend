import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme, width: number, height: number) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: theme.changePasswordModalBackground,
    padding: height > 900 ? 24 : 20,
    borderRadius: 12,
    width: width > 600 ?  '70%' : '84%',
    elevation: 10,
    gap: 8,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
    color : theme.changePasswordModalTitleColor,
    fontFamily: 'Nunito-Bold',
  },
  inputContainer:{
    flexDirection: 'row',
    alignItems:'center',
    gap:15,
    justifyContent:'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#008080',
    borderRadius: 8,
    // padding: height > 900 ? 8 : 8,
    marginBottom: 10,
  },
  input:{
    flex: 1,
    fontSize: width > 600 ? 16 : 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontFamily: 'Nunito-Regular',
    color: theme.ChangePasswordModalInputColor,
  },
  confirmPasswordinput: {
    borderBottomWidth: 1,
    borderBottomColor: '#008080',
    borderRadius: 8,
    padding: height > 900 ? 8 : 8,
    marginBottom: 15,
    fontSize: width > 600 ? 16 : 14,
    fontFamily: 'Nunito-Regular',
    color: theme.ChangePasswordModalInputColor,
  },
  error: {
    color: theme.primaryErrorText,
    marginBottom: 1,
    paddingLeft:5,
    fontFamily: 'Nunito-Regular',

  },
  allFields: {
    color: theme.primaryErrorText,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  cancelText: {
    color: '#333',
    fontFamily: 'Nunito-Bold',
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#008080',
  },
  saveText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
  },
});
