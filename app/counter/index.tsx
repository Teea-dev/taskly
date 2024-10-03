import {
  Text,
  View,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotification";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Duration, intervalToDuration, isBefore } from "date-fns";
import { TimeSegment } from "@/components/timeSegments";
import { getStorage, setStorage } from "@/utils/storage";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";

const frequency = 14 * 24 * 60 * 60 * 1000;

export const countdownStorageKey = "countdownData";

export type PersistedData = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
};
type CountDownStatus = {
  isOverDue: boolean;
  distance: Duration;
};
export default function CounterScreen() {
  const { width } = useWindowDimensions();
  const ConfettiRef = useRef<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [countDownState, setCountDownState] = useState<PersistedData>({
    currentNotificationId: undefined,
    completedAtTimestamps: [],
  });
  const [status, setStatus] = useState<CountDownStatus>({
    isOverDue: false,
    distance: {},
  });

  const lastCompletedTimestamp = countDownState?.completedAtTimestamps[0];
  useEffect(() => {
    const init = async () => {
      const value = await getStorage(countdownStorageKey);
      setCountDownState(value);
    };
    init();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeStamp = lastCompletedTimestamp
        ? lastCompletedTimestamp + frequency
        : Date.now();
      if (lastCompletedTimestamp) {
        setIsLoading(false);
      }
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
  }, [lastCompletedTimestamp]);

  const scheduleNotification = async () => {
    ConfettiRef?.current?.start();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "The thing is due",
          body: "Here is the body of the notification",
          data: { data: "goes here" },
        },
        trigger: { seconds: frequency / 1000 },
      });
    } else {
      Alert.alert("Unable to schedule the notification");
    }
    if (countDownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        countDownState.currentNotificationId
      );
    }
    const newCountDownState: PersistedData = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countDownState
        ? [Date.now(), ...countDownState.completedAtTimestamps]
        : [Date.now()],
    };
    // console.log(result);
    setCountDownState(newCountDownState);
    await setStorage(countdownStorageKey, newCountDownState);
  };

  if (isLoading) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        status.isOverDue
          ? { backgroundColor: "red" }
          : { backgroundColor: "white" },
      ]}
    >
      {status.isOverDue ? (
        <Text style={[styles.heading, styles.whiteText]}>Thing Overdue by</Text>
      ) : (
        <Text style={[styles.heading, styles.whiteText]}>Thing due in...</Text>
      )}
      <View style={styles.row}>
        <TimeSegment
          unit="Days"
          number={status.distance.days ?? 0}
          textStyle={status.isOverDue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="Hours"
          number={status.distance.hours ?? 0}
          textStyle={status.isOverDue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="Minutes"
          number={status.distance.minutes ?? 0}
          textStyle={status.isOverDue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="Seconds"
          number={status.distance.seconds ?? 0}
          textStyle={status.isOverDue ? styles.whiteText : undefined}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>I've done the thing </Text>
      </TouchableOpacity>
      <ConfettiCannon
        ref={ConfettiRef}
        count={50}
        fadeOut
        autoStart={false}
        origin={{ x: width / 2, y: 0 }}
      />
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
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  whiteText: {
    color: "#fff",
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
