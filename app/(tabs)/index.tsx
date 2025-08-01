import { ParallaxScrollView, ThemedButton, ThemedText } from "@/components";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ParallaxScrollView>
        <ThemedText
          style={[
            {
              textAlign: "center",
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 20,
            },
          ]}
        >
          Login to one of the following profiles
        </ThemedText>
        <ThemedButton
          onPress={() => router.push("/(expert)?profile=1")}
          title="Expert 1"
        />
        <ThemedButton
          onPress={() => router.push("/(expert)?profile=2")}
          title="Expert 2"
        />
        <ThemedButton
          onPress={() => router.push("/(patient)?profile=1")}
          title="Patient 1"
        />
        <ThemedButton
          onPress={() => router.push("/(patient)?profile=2")}
          title="Patient 2"
        />
        <ThemedButton
          onPress={() => router.push("/(patient)?profile=3")}
          title="Patient 3"
        />
        <ThemedButton
          onPress={() => router.push("/(patient)?profile=4")}
          title="Patient 4"
        />
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },

  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
