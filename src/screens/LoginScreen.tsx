import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { storeData } from "../utils/storage";

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
    <View>
      <Text>LoginScreen</Text>

      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          setProviderUsername(text);
        }}
        placeholder="Enter your username"
      />

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
