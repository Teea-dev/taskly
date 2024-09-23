import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Pressable,
  Alert,
  View,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

type Props = {
  name?: string;
  isCompleted?: boolean;
  onDeleted: () => void;
  onToggleCompleted: () => void;
};
export default function ShoppingListItem({
  name,
  isCompleted,
  onDeleted,
  onToggleCompleted,
}: Props) {
  const handleDelete = () => {
    Alert.alert("Delete", `Are you sure you want to delete ${name} ?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDeleted(),
      },
    ]);
  };
  return (
    <Pressable
      onPress={onToggleCompleted}
      style={isCompleted ? styles.completedContainer : undefined}
    >
      <ThemedView style={styles.stepContainer}>
        <View style={styles.row}>
          <Entypo
            name={isCompleted ? "check" : "circle"}
            size={24}
            color={isCompleted ? "green" : "grey"}
          />
          <ThemedText
          numberOfLines={1}
            style={[
              styles.itemText,
              isCompleted ? styles.completed : undefined,
            ]}
          >
            {name}
          </ThemedText>
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={handleDelete}>
          <AntDesign
            name="closecircle"
            size={24}
            color={isCompleted ? "grey" : "#ee6055"}
          />
        </TouchableOpacity>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  completedContainer: {
    backgroundColor: "green",
    flex: 1,
    borderBottomColor: "red",
  },
  completedButton: {
    backgroundColor: "grey",
  },
  completed: {
    textDecorationLine: "line-through",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "200",
    flex: 1,
  },
  button: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
});
