import {
  Text,
  View,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotification";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Duration, intervalToDuration, isBefore } from "date-fns";

const timeStamp = Date.now() + 10 * 1000;
type CountDownStatus = {
  isOverDue: boolean;
  distance: Duration;
};
export default function CounterScreen() {
  const [status, setStatus] = useState<CountDownStatus>({
    isOverDue: false,
    distance: {},
  });

  console.log(status);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const isOverDue = isBefore(timeStamp, Date.now());
      const distance = intervalToDuration(
        isOverDue
          ? {
              start: timeStamp,
              end: Date.now(),
            }
          : {
              start: Date.now(),
              end: timeStamp,
            }
      );
      setStatus({ isOverDue, distance });
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const scheduleNotification = async () => {
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      console.log("Permission granted");
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "You have a new notification",
          body: "Here is the body of the notification",
          data: { data: "goes here" },
        },
        trigger: { seconds: 5 },
      });
    } else {
      Alert.alert("Unable to schedule the notification");
    }
    console.log(result);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>Schedule Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
  },
  button: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
