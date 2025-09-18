import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Kit from "@/database/model/Kit";
import { colors, formatXOF, Rs } from "@/shared/utils";

type Props = {
  kit: Kit;
  handleSelectKit: (kitId: string) => void;
};

const SubscriptionItem = ({kit, handleSelectKit}: Props) => {

  const [isSelected, setIsSelected] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.kitCard,
      ]}
      onPress={() => {
        setIsSelected(!isSelected)
        handleSelectKit(kit.id);
      }}
    >
      <View style={styles.kitHeader}>
        <View style={styles.kitTitleRow}>
          <View style={[styles.kitIcon, {backgroundColor: "#4F46E5"}]}>
            <Ionicons name="build-outline" size={20} color="#fff" />
          </View>
          <View style={styles.kitTitleInfo}>
            <Text style={styles.kitName}> {kit?.label} </Text>
            <Text style={[styles.kitPrice, ]}> {formatXOF(kit?.montantTotal)} </Text>
          </View>
        </View>
        <View
          style={[
            styles.checkbox,
            // selectedKits.includes(kit.id) && styles.checkedBox
          ]}
        >
          <Ionicons
           size={Rs(16)}
           name={isSelected ? "checkmark-circle-sharp" : "checkbox"}
           color={isSelected ? colors.green : "#fff"} />
        </View>
      </View>
      <View style={styles.kitFeatures}>
        {/* {kit} */}
        <View style={styles.featureRow}>
          <Ionicons name="checkmark-circle" size={16} color="red" />
          <Text style={styles.featureText}> Feature 1 </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SubscriptionItem;

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },

  kitCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  kitHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  kitTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  kitIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  kitTitleInfo: {
    flex: 1,
  },
  kitName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  kitPrice: {
    fontSize: 16,
    fontWeight: "600",
  },
  kitFeatures: {
    marginTop: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
  },
});
