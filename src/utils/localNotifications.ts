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

export async function sendLocalNotification(title: string, body: string) {
  try {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'messages',
        pressAction: { id: 'default' },
      },
    });
  } catch (err) {
    console.error('Notification display error:', err);
  }
}
