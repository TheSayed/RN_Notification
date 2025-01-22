import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const requestPermissions = async () => {
    const { granted } = await Notifications.requestPermissionsAsync();
    if (!granted) {
      alert("Permission to show notifications is required!");
    }
  };

  requestPermissions();
  const handleNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Notification",
          body: "This is a notification",
          data: { userName: "Kotp" },
        },
        trigger: {
          type: "timeInterval", // Specifies a time interval-based trigger
          seconds: 2, // Fires after 2 seconds
          repeats: false, // Set to true for recurring notifications
        },
      });
      console.log("Notification scheduled!");
    } catch (error) {
      console.error("Failed to schedule notification:", error);
    }
  };

  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
        const userName = notification.request.content.data.userName;
        console.log("User name:", userName);
      }
    );
    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification response received:", response);
      }
    );
    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNotification} style={styles.btn}>
        <Text>Press for a notification</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
  },
});
