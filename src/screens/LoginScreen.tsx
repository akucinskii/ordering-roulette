import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { storeData } from "../utils/storage";
import { FormControl, Input } from "native-base";

const LoginScreen = ({ setUsername }: { setUsername: (username: string) => void }) => {
  const [providedUsername, setProviderUsername] = useState<string | null>(null);

  const handleLogin = async () => {
    if (providedUsername == null) {
      return;
    }
    await storeData("username", providedUsername);
    setUsername(providedUsername);
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        width: "100%",
      }}
    >
      <FormControl w="75%" maxW="300px">
        <FormControl.Label>Username</FormControl.Label>
        <Input
          onChangeText={(text) => {
            setProviderUsername(text);
          }}
          placeholder="Enter your username"
        />
      </FormControl>

      <Button onPress={handleLogin} title="Login" />
    </View>
  );
};

const styles = {
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
};

export default LoginScreen;
