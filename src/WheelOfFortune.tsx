import React, { useState } from "react";
import { View, TouchableOpacity, Animated, Easing, Text } from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";

const DEFAULT_SPIN_VALUE = 360 * 3;

const WheelOfFortune = ({ numberOfPartitions = 8 }) => {
  const [spinValue, setSpinValue] = useState(new Animated.Value(0));

  const spinWheel = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 5000, // Adjust the duration as needed
      easing: Easing.inOut(Easing.cubic), // This easing function starts fast and slows down towards the end
      useNativeDriver: true,
    }).start();
  };
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", `${DEFAULT_SPIN_VALUE}deg`],
  });

  const wheelSize = 300;
  const wheelRadius = wheelSize / 2;
  const centerX = wheelRadius;
  const centerY = wheelRadius;

  const calculatePartitionPath = (index: number) => {
    const angle = (2 * Math.PI) / numberOfPartitions;
    const startAngle = index * angle;
    const endAngle = startAngle + angle;

    const x1 = centerX + wheelRadius * Math.sin(startAngle);
    const y1 = centerY - wheelRadius * Math.cos(startAngle);
    const x2 = centerX + wheelRadius * Math.sin(endAngle);
    const y2 = centerY - wheelRadius * Math.cos(endAngle);

    return `M${centerX},${centerY} L${x1},${y1} A${wheelRadius},${wheelRadius} 0 0,1 ${x2},${y2} Z`;
  };

  const calculateTextPosition = (index: number) => {
    const angle = (2 * Math.PI) / numberOfPartitions;
    const textAngle = index * angle + angle / 2;

    const x = centerX + (wheelRadius / 2) * Math.sin(textAngle);
    const y = centerY - (wheelRadius / 2) * Math.cos(textAngle);

    return { x, y };
  };

  const partitions = new Array(numberOfPartitions).fill(null);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Svg height={wheelSize} width={wheelSize}>
          {partitions.map((_, index) => (
            <Path
              key={index}
              d={calculatePartitionPath(index)}
              fill={index % 2 === 0 ? "#FFC107" : "#FF5722"}
            />
          ))}
          {partitions.map((_, index) => {
            const { x, y } = calculateTextPosition(index);
            return (
              <SvgText
                key={index}
                x={x}
                y={y}
                fill="white"
                fontSize="20"
                fontWeight="bold"
                textAnchor="middle"
              >
                {`Prize ${index + 1}`}
              </SvgText>
            );
          })}
        </Svg>
      </Animated.View>
      <TouchableOpacity onPress={spinWheel}>
        <Text>Spin the Wheel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WheelOfFortune;
