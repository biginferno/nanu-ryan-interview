// The following components allow a transition between Headers and Base Values
// Headers can be toggled to replace all lower bound values.
// NOTE: This component does not allow for non-boolean values in the json structure
// This wouldn't be difficult to change, but was a design choice based on initial requirements.

import React, { useState } from "react";
import { StyleSheet, Switch, TextStyle, TouchableOpacity } from "react-native";
import { ThemedText, ThemedView } from "@/components";
type CollapsibleToggleProps = {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
  adjustable?: boolean;
};
//Helper to set all subsuquent settings to true or false
function setAllBooleans(obj: any, value: boolean): any {
  if (typeof obj === "boolean") return value;
  if (typeof obj === "object" && obj !== null) {
    const updated: Record<string, any> = {};
    for (const key in obj) {
      updated[key] = setAllBooleans(obj[key], value);
    }
    return updated;
  }
  return obj;
}

// Utility to capitalize the first letter, more OCD styling than not
function capitalizeFirst(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// The adjustable value is used here to disallow non-patient users from modifying values
const CollapsibleToggle: React.FC<CollapsibleToggleProps> = ({
  label,
  value,
  onChange,
  adjustable,
}) => (
  <ThemedView style={styles.item}>
    <ThemedText style={styles.label}>{capitalizeFirst(label)}</ThemedText>
    {adjustable ? (
      <Switch value={value} onValueChange={onChange} />
    ) : value ? (
      <ThemedText>Enabled</ThemedText>
    ) : (
      <ThemedText>Disabled</ThemedText>
    )}
  </ThemedView>
);

type NestedToggleProps = {
  data: Record<string, any>;
  path?: string[];
  onUpdate: React.Dispatch<React.SetStateAction<any>>;
  adjustable?: boolean;
};

const NestedToggle: React.FC<NestedToggleProps> = ({
  data,
  path = [],
  onUpdate,
  adjustable,
}) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCollapse = (keyPath: string[]) => {
    const pathString = keyPath.join(".");
    setCollapsed((prev) => ({
      ...prev,
      [pathString]: !prev[pathString],
    }));
  };

  const handleValueChange = (keyPath: string[], newValue: boolean) => {
    onUpdate((prevData: any) => {
      const updated = { ...prevData };
      let pointer = updated;
      for (let i = 0; i < keyPath.length - 1; i++) {
        pointer = pointer[keyPath[i]];
      }
      pointer[keyPath[keyPath.length - 1]] = newValue;
      return updated;
    });
  };

  // Check if all children are booleans or objects with booleans
  const hasBooleanChildren = (obj: any): boolean =>
    Object.values(obj).some(
      (v) =>
        typeof v === "boolean" ||
        (typeof v === "object" && v !== null && hasBooleanChildren(v))
    );

  // Get the current toggle state for a parent: true if all booleans are true, false otherwise
  const getParentToggleState = (obj: any): boolean => {
    let allTrue = true;
    let allFalse = true;
    const check = (o: any) => {
      if (typeof o === "boolean") {
        if (o) allFalse = false;
        else allTrue = false;
      } else if (typeof o === "object" && o !== null) {
        Object.values(o).forEach(check);
      }
    };
    check(obj);
    if (allTrue) return true;
    if (allFalse) return false;
    return false; // default to false if mixed
  };

  // Set all booleans under a parent to a value
  const handleParentToggle = (keyPath: string[], value: boolean) => {
    onUpdate((prevData: any) => {
      const updated = { ...prevData };
      let pointer = updated;
      for (let i = 0; i < keyPath.length - 1; i++) {
        pointer = pointer[keyPath[i]];
      }
      pointer[keyPath[keyPath.length - 1]] = setAllBooleans(
        pointer[keyPath[keyPath.length - 1]],
        value
      );
      return updated;
    });
  };

  return (
    <ThemedView style={[{ flex: 1 }]}>
      {Object.entries(data).map(([key, value]) => {
        const currentPath = [...path, key];
        const isCollapsed = collapsed[currentPath.join(".")];

        if (typeof value === "boolean") {
          return (
            <CollapsibleToggle
              key={currentPath.join(".")}
              label={key}
              value={value}
              onChange={(newVal) => handleValueChange(currentPath, newVal)}
              adjustable={adjustable}
            />
          );
        }

        if (
          typeof value === "object" &&
          value !== null &&
          hasBooleanChildren(value)
        ) {
          // Parent toggle for all children
          const parentToggleState = getParentToggleState(value);
          return (
            <ThemedView key={currentPath.join(".")} style={styles.section}>
              <ThemedView>
                <TouchableOpacity
                  style={styles.header}
                  onPress={() => toggleCollapse(currentPath)}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.headerThemedText}>
                    {capitalizeFirst(key)}
                  </ThemedText>
                  {adjustable ? (
                    <Switch
                      value={parentToggleState}
                      onValueChange={(val) =>
                        handleParentToggle(currentPath, val)
                      }
                      style={{ marginLeft: 8 }}
                      onStartShouldSetResponder={() => true}
                    />
                  ) : null}
                </TouchableOpacity>
              </ThemedView>
              {!isCollapsed && (
                <ThemedView style={styles.nested}>
                  <NestedToggle
                    data={value}
                    path={currentPath}
                    onUpdate={onUpdate}
                    adjustable={adjustable}
                  />
                </ThemedView>
              )}
            </ThemedView>
          );
        }

        return null; // skip non-boolean, non-object
      })}
    </ThemedView>
  );
};

export default function SettingsTree({
  settings,
  setSettings,
  adjustable = false,
}: {
  settings: object;
  setSettings: (settings: object) => void;
  adjustable: boolean;
}) {
  return (
    <ThemedView style={styles.container}>
      <NestedToggle
        data={settings}
        onUpdate={setSettings}
        adjustable={adjustable}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
  } as TextStyle,
  section: {
    marginVertical: 4,
  },
  header: {
    backgroundColor: "#eee",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  headerThemedText: {
    fontWeight: "bold",
    fontSize: 16,
  } as TextStyle,
  collapseIcon: {
    fontSize: 20,
    marginHorizontal: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    textAlign: "center",
    minWidth: 24,
  } as TextStyle,
  nested: {
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderColor: "#ddd",
  },
});
