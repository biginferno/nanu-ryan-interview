import {
  ParallaxScrollView,
  ThemedButton,
  ThemedText,
  ThemedView,
} from "@/components";
import SettingsTree from "@/components/ui/SettingsTree";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "@/utils/supabase";

export default function PatientScreen() {
  const router = useRouter();
  const { profile } = useGlobalSearchParams();
  const [settings, setSettings] = useState<any>({});
  const [loadedProfiled, setLoadedProfiled] = useState<object>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("patient_id", profile);

    setSettings(data?.[0]["settings"] || {});
    setLoadedProfiled(data?.[0] || {});
    setLoading(false);
  };
  const saveSettings = async () => {
    const { error } = await supabase
      .from("settings")
      .upsert({ ...loadedProfiled, settings: settings, patient_id: profile });
    if (error) {
      console.error("Error saving settings:", error);
    }
  };
  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <ParallaxScrollView>
      <ThemedText style={[styles.title]}>Settings</ThemedText>

      {loading ? (
        <ThemedText style={{ textAlign: "center", marginVertical: 20 }}>
          Loading settings...
        </ThemedText>
      ) : (
        <SettingsTree
          settings={settings}
          setSettings={setSettings}
          adjustable={true}
        />
      )}

      <ThemedView
        style={[{ flexDirection: "row", justifyContent: "center", gap: "15%" }]}
      >
        <ThemedButton title="Save Settings" onPress={saveSettings} />
        <ThemedButton
          backgroundColor="red"
          title="Logout"
          onPress={() => router.replace("/(tabs)")}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
  },
});
