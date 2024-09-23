import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Pressable,
  Alert,
  TextInput,
  FlatList,
  LayoutAnimation,
} from "react-native";
import { useEffect, useState } from "react";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import ShoppingListItem from "@/components/_local-components/ShoppingListItem";
import { Link } from "expo-router";
import { getStorage, setStorage } from "@/utils/storage";

type ShoppingListItemType = {
  name: string;
  isCompleted?: boolean;
  id: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

const storageKey = "shoppingList";

export default function HomeScreen() {
  const [value, setValue] = useState("");
  const [list, setList] = useState<ShoppingListItemType[]>([]);

  useEffect(() => {
    const fetchInitial = async () => {
      const data = await getStorage(storageKey);
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setList(data);
      }
    };
    fetchInitial();
  }, []);
  const handleAddItem = () => {
    if (value) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setList([
        ...list,
        {
          name: value,
          isCompleted: false,
          id: Date.now().toString(),
          lastUpdatedTimestamp: Date.now(),
        },
      ]);
      setValue("");
      setStorage(storageKey, setList);
    }
  };
  const handleDelete = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setList(list.filter((item) => item.id !== id));
    setStorage(storageKey, setList);
  };
  const handleToggleCompleted = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setList(
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              lastUpdatedTimestamp: Date.now(),
              completedAtTimestamp: item.completedAtTimestamp
                ? undefined
                : Date.now(),
            }
          : item
      )
    );
    setStorage(storageKey, list);
  };

  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    // >
    <FlatList
      stickyHeaderIndices={[0]}
      data={orderShoppingList(list)}
      renderItem={({ item }) => (
        <ShoppingListItem
          {...item}
          isCompleted={!!item.completedAtTimestamp}
          onDeleted={() => {
            handleDelete(item.id);
          }}
          onToggleCompleted={() => {
            handleToggleCompleted(item.id);
          }}
        />
      )}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <ThemedView
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ThemedText style={{ fontSize: 24 }}>No items</ThemedText>
        </ThemedView>
      }
      ListHeaderComponent={
        <TextInput
          value={value}
          onChangeText={setValue}
          keyboardType="default"
          returnKeyType="done"
          onSubmitEditing={handleAddItem}
          placeholder="e.g coffee"
          style={styles.textInput}
        />
      }
    />
    // </ParallaxScrollView>
  );
}

function orderShoppingList(shoppingList: ShoppingListItemType[]) {
  return shoppingList.sort((item1, item2) => {
    if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return item2.completedAtTimestamp - item1.completedAtTimestamp;
    }

    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return 1;
    }

    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return -1;
    }

    if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return item2.lastUpdatedTimestamp - item1.lastUpdatedTimestamp;
    }

    return 0;
  });
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  textInput: {
    backgroundColor: Colors.light.background,
    // borderColor: Colors.light.border,
    borderWidth: 2,
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    margin: 10,
  },
});
