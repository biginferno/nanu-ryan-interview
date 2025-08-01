import {
  ThemedButton,
  ThemedText,
  ThemedView,
  ParallaxScrollView,
} from "@/components";
import CalendarPicker from "@/components/ui/CalendarPicker";
import {
  useFocusEffect,
  useGlobalSearchParams,
} from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/utils/supabase";
type Log = {
  id?: string;
  notes: string;
  date: Date;
};
const CalendarTab = () => {
  const { profile } = useGlobalSearchParams();

  console.log("Profile ID:", profile);
  const [logs, setLogs] = useState<Log[]>([]);
  const [showAddLog, setShowAddLog] = useState<boolean>(false);
  const [newLog, setNewLog] = useState<Partial<Log>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleAddDate = (date: Date) => {
    console.log("Selected date:", date);
    setNewLog((prev) => {
      return { ...prev, date: date };
    });
  };
  const handleNoteChange = (text: string) => {
    setNewLog((prev) => {
      return { ...prev, notes: text };
    });
  };
  const handleSaveLog = async () => {
    if (newLog?.notes && newLog?.date) {
      const logToSave = {
        notes: newLog.notes,
        date: newLog.date.toISOString(),
        expert_id: profile,
        patient_id: profile,
      };

      const { error: dbError } = await supabase.from("logs").insert(logToSave);

      if (dbError) {
        console.error("Supabase insert error:", dbError);
        setError("Failed to save log. Please try again.");
        return;
      }

      setLogs((prev) => [
        ...prev,
        { ...newLog, id: Date.now().toString() } as Log,
      ]);
      setNewLog({});
      setShowAddLog(false);
      setError(null);
    } else {
      setError("Please fill in all fields before saving.");
    }
  };
  const fetchLogs = async () => {
    setLoading(true); // ⬅️ Start loading
    
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .eq("patient_id", profile)
      .order("date", { ascending: false });

    if (error) {
      console.error("Failed to fetch logs:", error);
      setError("Failed to load logs.");
    } else {
      const parsedLogs = data.map((log) => ({
        ...log,
        date: new Date(log.date),
      }));
      setLogs(parsedLogs);
    }

    setLoading(false); // ⬅️ End loading
  };

  useFocusEffect(
    React.useCallback(() => {
      setNewLog({});
      setError(null);
      setLogs([]);
      setShowAddLog(false);
      fetchLogs();
    }, [profile])
  );
  return (
    <SafeAreaView style={[{ flex: 1 }]}>
      <ParallaxScrollView>
        <ThemedText style={styles.title}>Log your daily notes</ThemedText>

        {showAddLog ? (
          <ThemedView
            style={[
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <ThemedButton
              title={"Save Log"}
              onPress={handleSaveLog}
              style={{ fontSize: 20 }}
            />
            <ThemedButton
              title={"Cancel"}
              onPress={() => {
                setNewLog({});
                setShowAddLog((prev) => !prev);
              }}
              style={{ fontSize: 20 }}
            />
          </ThemedView>
        ) : (
          <ThemedButton
            title={"Create Log"}
            onPress={() => {
              setShowAddLog((prev) => !prev);
            }}
            style={{ fontSize: 20 }}
          />
        )}
        {error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : null}
        {!showAddLog && loading ? (
          <ThemedText style={styles.placeholderText}>
            Loading logs...
          </ThemedText>
        ) : !showAddLog && logs.length === 0 ? (
          <ThemedText style={styles.placeholderText}>
            No logs available. Create a new log to get started.
          </ThemedText>
        ) : null}
        {showAddLog ? (
          <>
            <ThemedView style={[{ flex: 1 }]}>
              <ThemedText style={styles.placeholderText}>
                {newLog?.date
                  ? `Selected Date: ${newLog.date.toLocaleDateString()}`
                  : "No date selected"}
              </ThemedText>
              <TextInput
                style={styles.noteInput}
                placeholder="Enter your notes..."
                value={newLog.notes || ""}
                onChangeText={handleNoteChange}
                multiline
                numberOfLines={3}
                placeholderTextColor="#888"
              />
            </ThemedView>
            <ThemedView style={styles.calendarPlaceholder}>
              <CalendarPicker
                date={newLog?.date ? newLog.date : new Date()}
                chooseDate={handleAddDate}
              />
            </ThemedView>
          </>
        ) : null}
        {!showAddLog && logs.length > 0 ? (
          <ThemedView style={{ marginTop: 20 }}>
            {logs.map((log, idx) => (
              <ThemedView key={idx} style={{ marginBottom: 16 }}>
                <ThemedText style={{ fontWeight: "bold" }}>
                  {log.date.toLocaleDateString()}
                </ThemedText>
                <ThemedText>{log.notes}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        ) : null}
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 16,
  },
  calendarPlaceholder: {
    flex: 4,
    marginBottom: 24,
  },
  placeholderText: {
    fontSize: 16,
    color: "black",

    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#222",
    maxHeight: 200,
    textAlignVertical: "top",
  },
});

export default CalendarTab;
