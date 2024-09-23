import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
        <Tabs.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            title: "Shooping List",
            tabBarIcon: ({ color, size }) => {
              return <Feather name="list" size={size} color={color} />;
            },
          }}
        />
        <Tabs.Screen
          name="counter"
          options={{
            headerShown: false,

            title: "Counter",
            tabBarIcon: ({ color, size }) => {
              return (
                <AntDesign name="clockcircleo" size={size} color={color} />
              );
            },
          }}
        />
        <Tabs.Screen
          name="idea"
          options={{
            title: "Idea",
            tabBarIcon: ({ color, size }) => {
              return (
                <FontAwesome5 name="lightbulb" size={size} color={color} />
              );
            },
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
