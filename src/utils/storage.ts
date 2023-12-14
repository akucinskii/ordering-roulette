// storage.js
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: string) => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (e) {
    // saving error
    throw new Error("Error saving value", { cause: e });
  }
};

export const getData = async (key: string) => {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    // error reading value
    throw new Error("Error reading value", { cause: e });
  }
};
