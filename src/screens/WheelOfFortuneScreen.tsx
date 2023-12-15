import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
import { View, TouchableOpacity, Animated, Easing, Text } from "react-native";
import Svg, { Path, Polygon, Text as SvgText } from "react-native-svg";
import io from "socket.io-client";
import { RootStackParamList } from "../types";
import { getData } from "../utils/storage";

const DEFAULT_SPIN_VALUE = 360 * 3;
const socket = io("http://localhost:3000");

type WheelOfFortuneNavigationProp = NativeStackNavigationProp<RootStackParamList, "Room">;

const WheelOfFortune = ({
  route: {
    params: { room },
  },
}: {
  route: RouteProp<RootStackParamList, "WheelOfFortune">;
  navigation: WheelOfFortuneNavigationProp;
}) => {
  const [spinValue] = useState(new Animated.Value(0));
  const [showWinner, setShowWinner] = useState(false);

  const [whichIndexWon, setWhichIndexWon] = useState(0);
  const [partitions, setPartitions] = useState([]);

  const arcOfOnePartition = useMemo(() => 360 / partitions.length, [partitions]);

  const [randomNumber, setRandomNumber] = useState(0);

  useEffect(() => {
    socket.on("winnerData", (data) => {
      setWhichIndexWon(data.winner);
      setRandomNumber(data.randomNumber);

      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 5000,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        setShowWinner(true);
      }, 5000);
    });

    // Listen for room size response
    socket.on("updateUserList", (data) => {
      setPartitions(data);
    });

    return () => {
      socket.off("winnerData");
      socket.off("updateUserList");
    };
  }, []);

  const startLottery = () => {
    // Send an event to the server to start the lottery
    socket.emit("startLottery", room);
  };

  const joinRoom = async () => {
    const username = await getData("username");
    console.log(room, username);
    socket.emit("joinRoom", {
      room,
      username,
    });
  };

  useEffect(() => {
    joinRoom();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", `${DEFAULT_SPIN_VALUE + 450 - randomNumber}deg`],
  });

  const wheelSize = 300;
  const wheelRadius = wheelSize / 2;
  const centerX = wheelRadius;
  const centerY = wheelRadius;

  const calculatePartitionPath = (index: number) => {
    if (partitions.length === 1) {
      // return whole circle
      return `M${centerX},${centerY} m${-wheelRadius},0 a${wheelRadius},${wheelRadius} 0 1,0 ${wheelSize},0 a${wheelRadius},${wheelRadius} 0 1,0 ${-wheelSize},0`;
    }
    const angle = (2 * Math.PI) / partitions.length;
    const startAngle = index * angle;
    const endAngle = startAngle + angle;

    const x1 = centerX + wheelRadius * Math.sin(startAngle);
    const y1 = centerY - wheelRadius * Math.cos(startAngle);
    const x2 = centerX + wheelRadius * Math.sin(endAngle);
    const y2 = centerY - wheelRadius * Math.cos(endAngle);

    return `M${centerX},${centerY} L${x1},${y1} A${wheelRadius},${wheelRadius} 0 0,1 ${x2},${y2} Z`;
  };

  const calculateTextPosition = (index: number) => {
    const angle = (2 * Math.PI) / partitions.length;
    const textAngle = index * angle + angle / 2;

    const x = centerX + (wheelRadius / 1.3) * Math.sin(textAngle);
    const y = centerY - (wheelRadius / 1.3) * Math.cos(textAngle);
    const rotation = (textAngle * 180) / Math.PI - 90; // Convert radians to degrees and adjust

    return { x, y, rotation };
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Text>Room {room}</Text>
      {whichIndexWon === 0 ? (
        <Text>Spin the wheel to win a prize!</Text>
      ) : (
        showWinner && <Text>{partitions[whichIndexWon - 1]} is the winner!</Text>
      )}
      <View
        style={{
          position: "relative",
          width: wheelSize,
          height: wheelSize,
        }}
      >
        <Svg
          height={20}
          width={20}
          style={{
            transform: [
              {
                translateX: -10,
              },
              {
                translateY: -10,
              },
            ],
            position: "absolute",
            zIndex: 1,
            left: "100%",
            top: "50%",
          }}
        >
          <Polygon points={`0,10 20,20 20,0`} fill="white" stroke="black" strokeWidth="3" />
        </Svg>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Svg height={wheelSize} width={wheelSize}>
            {partitions.map((_, index) => (
              <Path
                key={index}
                d={calculatePartitionPath(index)}
                fill={`hsl(${index * arcOfOnePartition}, 90%, 50%)`}
                stroke={"black"}
              />
            ))}
            {partitions.map((username, index) => {
              const { x, y, rotation } = calculateTextPosition(index);
              return (
                <SvgText
                  key={index}
                  x={x}
                  y={y}
                  transform={`rotate(${rotation}, ${x}, ${y})`}
                  fill="black"
                  fontSize={partitions.length > 10 ? 10 : 20 - partitions.length}
                  textAnchor="middle"
                >
                  {username}
                </SvgText>
              );
            })}
          </Svg>
        </Animated.View>
      </View>
      <TouchableOpacity onPress={startLottery}>
        <Text>Spin the Wheel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WheelOfFortune;
