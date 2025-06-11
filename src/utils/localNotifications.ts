import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';


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
export async function scheduleNotification(
  title: string,
  body: string,
  delayInSeconds: number
) {
  try {
    const date = new Date(Date.now() + delayInSeconds * 1000);
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };
    await notifee.createTriggerNotification(
      {
        title,
        body,
        android: {
          channelId: 'messages',
          pressAction: { id: 'default' },
        },
      },
      trigger
    );
  } catch (err) {
    console.error('Notification schedule error:', err);
  }
}

