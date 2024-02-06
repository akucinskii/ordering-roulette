import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import RoomScreen from "./src/screens/RoomScreen";
import WheelOfFortuneScreen from "./src/screens/WheelOfFortuneScreen";
import { getData } from "./src/utils/storage";
import { RootStackParamList } from "./src/types";
import { NativeBaseProvider } from "native-base";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const loadUsername = async () => {
      const storedUsername = await getData("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    loadUsername();
  }, []);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {username == null ? (
            // No username set, show the login screen
            <Stack.Screen name="Login">{(props) => <LoginScreen {...props} setUsername={setUsername} />}</Stack.Screen>
          ) : (
            // Username set, show other screens
            <>
              <Stack.Screen
                name="Room"
                options={{
                  title: "Create or join a room",
                }}
                component={RoomScreen}
              />

              <Stack.Screen
                options={{
                  title: "Wheel of Fortune",
                }}
                name="WheelOfFortune"
                component={WheelOfFortuneScreen}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
