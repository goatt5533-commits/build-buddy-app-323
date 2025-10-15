import { LocalNotifications } from '@capacitor/local-notifications';

export const notifyFocus = async () => {
  await LocalNotifications.schedule({
    notifications: [
      {
        title: "FocusForge Reminder",
        body: "Time to focus! Avoid doom scrolling.",
        id: Date.now(),
        schedule: { at: new Date(Date.now() + 1000) },
      },
    ],
  });
};

export const notifyStreak = async (days: number) => {
  await LocalNotifications.schedule({
    notifications: [
      {
        title: "🔥 Streak Alert!",
        body: `You’re on a ${days}-day streak! Keep going!`,
        id: Date.now(),
        schedule: { at: new Date(Date.now() + 1000) },
      },
    ],
  });
};
