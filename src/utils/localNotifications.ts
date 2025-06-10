import notifee, {AndroidImportance} from '@notifee/react-native';

export async function initNotifications() {
  try {
    await notifee.requestPermission();
    await notifee.createChannel({
      id: 'messages',
      name: 'Messages Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  } catch (err) {
    console.error('Notification init error:', err);
  }
}
