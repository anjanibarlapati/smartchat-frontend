import { StyleSheet } from 'react-native';

export const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.34)',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: height * 0.15,
    },
    imageWrapper: {
      width: width * 0.7,
      height: height * 0.32,
      borderRadius: 12,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: 'lightgray',
    },
    fullImage: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
    },
    nameContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'rgba(20, 7, 7, 0.14)',
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    contactName: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
  });


