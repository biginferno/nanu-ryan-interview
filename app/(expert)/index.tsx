import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  ParallaxScrollView,
  ThemedButton,
  ThemedText,
  ThemedView,
} from "@/components";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/utils/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsTree from "@/components/ui/SettingsTree";
export default function ExpertScreen() {
  const { profile } = useLocalSearchParams();

  const [patientInfo, setPatientInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) router.replace("/(tabs)");
    setLoading(true);
    supabase
      .from("settings")
      .select("*")
      .eq("expert_id", profile)
      .then(({ data, error }) => {
        if (error) {
          setPatientInfo([]);
        } else {
          setPatientInfo(data || []);
        }
        setLoading(false);
      });
  }, [profile]);

  if (!profile) {
    return (
      <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
        No profile selected.
      </ThemedText>
    );
  }
  console.log("Patient Info:", patientInfo.length);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ParallaxScrollView>
        <ThemedText
          style={[{ fontSize: 24, fontWeight: "bold", textAlign: "center" }]}
        >
          Client Dashboard
        </ThemedText>
        <ThemedText
          style={[{ fontSize: 20, fontWeight: "600", textAlign: "center" }]}
        >
          Expert Profile: {profile}
        </ThemedText>
        {loading ? (
          <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
            ...Loading...
          </ThemedText>
        ) : patientInfo?.length > 0 ? (
          <>
            {patientInfo.map((element, index) => (
              <ThemedView key={index}>
                <ThemedText
                  style={{
                    textAlign: "center",
                    marginTop: 10,
                    fontSize: 18,
                    fontWeight: "500",
                  }}
                >
                  Patient Info: {JSON.stringify(element.patient_id)}
                </ThemedText>
                <SettingsTree
                  settings={element.settings}
                  setSettings={() => null}
                  adjustable={false}
                />
              </ThemedView>
            ))}
          </>
        ) : (
          <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
            No patient info available.
          </ThemedText>
        )}

        <ThemedButton
          backgroundColor="red"
          title="Logout"
          onPress={() => router.replace("/(tabs)")}
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
