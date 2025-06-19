import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';


export async function initNotifications() {
  try {
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

export async function sendLocalNotification(title: string, body: string, profilePic?: string) {
  try {
    console.log('kk', profilePic);
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'messages',
        pressAction: { id: 'default' },
        smallIcon: 'ic_launcher_round',
        color: '#008080',
        ...(profilePic ? { largeIcon: profilePic } : { largeIcon: require('../../assets/images/profileImage.png')}),
        circularLargeIcon: true,
      },
      ios: {
        attachments: [
          {
            url: profilePic ?? require('../../assets/images/profileImage.png'),
          },
        ],
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
          smallIcon: 'ic_launcher_round',
          color: '#008080',
        },
      },
      trigger
    );
  } catch (err) {
    console.error('Notification schedule error:', err);
  }
}

