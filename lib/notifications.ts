import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Pet Care Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
};

export type RecurringType = "daily" | "weekly" | "monthly" | "yearly" | undefined;

export const scheduleNotification = async (
  id: string,
  title: string,
  body: string,
  scheduledDate: Date,
  recurring?: RecurringType
): Promise<void> => {
  try {
    // Cancel existing notification with same ID
    await cancelNotification(id);

    // Don't schedule if date is in the past
    if (scheduledDate <= new Date()) {
      return;
    }

    // For non-recurring reminders, use standard scheduling
    if (!recurring) {
      await Notifications.scheduleNotificationAsync({
        identifier: id,
        content: {
          title,
          body,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          date: scheduledDate,
        },
      });
      console.log(`One-time notification scheduled for ${scheduledDate.toISOString()}`);
      return;
    }

    // For recurring reminders, schedule the first occurrence
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title,
        body,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { recurring, originalDate: scheduledDate.toISOString() },
      },
      trigger: {
        date: scheduledDate,
      },
    });
    
    console.log(`Recurring (${recurring}) notification scheduled for ${scheduledDate.toISOString()}`);
  } catch (error) {
    console.error('Failed to schedule notification:', error);
  }
};

export const cancelNotification = async (id: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to cancel all notifications:', error);
  }
};

export const getScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to get scheduled notifications:', error);
    return [];
  }
};