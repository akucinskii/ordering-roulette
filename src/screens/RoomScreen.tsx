import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { generateCode } from "../utils/generateCode";
import { RootStackParamList } from "../types";

type RoomScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Room">;

const RoomScreen = ({ navigation }: { navigation: RoomScreenNavigationProp }) => {
  const [roomCode, setRoomCode] = useState<string>("");

  const handleCreateRoom = () => {
    const code = generateCode();
    console.log(`Creating room ${code}`);
    navigation.navigate("WheelOfFortune", { room: code });
  };

  const handleJoinRoom = () => {
    console.log(`Joining room ${roomCode}`);
    navigation.navigate("WheelOfFortune", { room: roomCode });
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <Text>RoomScreen</Text>

      <Text>Join room</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          setRoomCode(text);
        }}
        placeholder="Enter room name"
      ></TextInput>

      <Button onPress={handleJoinRoom} title="Join room"></Button>

      <Button onPress={handleCreateRoom} title="Create room" />
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

export default RoomScreen;
