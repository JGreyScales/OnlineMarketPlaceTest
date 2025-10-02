// Custom button component

import { TouchableOpacity, Text } from "react-native";
import { GlobalStyles } from "./globalStyleSheet";

export const CustomButton = ({ text, onPress }) => (
    <TouchableOpacity style={GlobalStyles.button} onPress={onPress}>
      <Text style={GlobalStyles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );