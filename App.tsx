import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import WheelOfFortune from "./src/WheelOfFortune";

export default function App() {
  return (
    <View style={styles.container}>
      <WheelOfFortune />
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
});
