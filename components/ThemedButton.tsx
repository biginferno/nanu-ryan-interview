import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

export function ThemedButton({
  onPress,
  title,
  style,
  backgroundColor = "#45CB85",
}: {
  onPress: () => void;
  title: string;
  style?: React.CSSProperties | undefined;
  backgroundColor?: string;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: backgroundColor  },
        style as ViewStyle,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: "white" }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    maxWidth: "60%",
    alignSelf: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
