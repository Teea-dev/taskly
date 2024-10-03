import { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { countdownStorageKey, PersistedData } from ".";
import { getStorage } from "@/utils/storage";
import { format } from "date-fns";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
export default function HistoryScreen() {
  const [countDownState, setCountDownState] = useState<PersistedData>();

  const fullDateFormat = `LLL d yyyy, h:mm aaa`;
  useEffect(() => {
    const init = async () => {
      const value = await getStorage(countdownStorageKey);
      setCountDownState(value);
    };
    init();
  }, []);
  return (
    <FlatList
    ListEmptyComponent={
      <ThemedView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ThemedText style={{ fontSize: 24 }}>No history</ThemedText>
      </ThemedView>
    }
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{ padding: 20 }}
      data={countDownState?.completedAtTimestamps}
      keyExtractor={(item) => item.toString()}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.text}>{format(item, fullDateFormat)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "lightgray",
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 18,
  },
});
