import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { generateCode } from "../utils/generateCode";
import { RootStackParamList } from "../types";
import { Button, FormControl, Input, Text } from "native-base";
import { getData } from "../utils/storage";
import { useFocusEffect } from "@react-navigation/native";

type RoomScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Room">;

type Lottery = {
  id: number;
  date: string;
  room: string;
  participants: string;
  winner: string;
};

const RoomScreen = ({ navigation }: { navigation: RoomScreenNavigationProp }) => {
  const [roomCode, setRoomCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [oldLotteries, setOldLotteries] = useState<Lottery[]>([]);

  useFocusEffect(
    useCallback(() => {
      const getLotteries = async () => {
        const username = await getData("username");

        fetch(`http://192.168.1.140:3000/lotteries/${username}`)
          .then((response) => response.json())
          .then((data) => {
            setOldLotteries(data);
          });
      };
      getLotteries();
    }, [])
  );

  const handleCreateRoom = () => {
    const code = generateCode();
    console.log(`Creating room ${code}`);
    navigation.navigate("WheelOfFortune", { room: code });
  };

  const handleJoinRoom = () => {
    if (roomCode.length !== 6) {
      setError("Room code must be 6 characters long");
      return;
    }
    console.log(`Joining room ${roomCode}`);
    navigation.navigate("WheelOfFortune", { room: roomCode });
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
      <FormControl isInvalid={!!error} w="75%" maxW="300px">
        <FormControl.Label>Enter room code provided by friend</FormControl.Label>
        <Input
          onChangeText={(text) => {
            setRoomCode(text);
          }}
          placeholder="Enter room code"
        ></Input>
        <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
      </FormControl>

      <Button w="75%" maxW="300px" onPress={handleJoinRoom}>
        Join room
      </Button>

      <Text>Or</Text>
      <Button w="75%" maxW="300px" onPress={handleCreateRoom}>
        Create new Room
      </Button>

      <Text>Your previous lotteries:</Text>
      {oldLotteries.map((lottery) => (
        <Text key={lottery.id}>
          {new Date(lottery.date).toLocaleString()}- Winner: {lottery.winner}
        </Text>
      ))}
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
