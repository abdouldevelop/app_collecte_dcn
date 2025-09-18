// BottomSheetCompoForm.tsx
import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import BackButton from "./BackButton";
import { Feather } from "@expo/vector-icons";
import { colors, Rs, SIZES } from "@/shared/utils";

interface Props extends Partial<React.ComponentProps<typeof BottomSheetModal>> {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  isClose: boolean;
  onChange?: (index: number) => void;
}

const BottomSheetCompoForm: React.FC<Props> = ({
  bottomSheetModalRef,
  children,
  snapPoints: customSnapPoints,
  onChange,
  isClose,
  ...props
}) => {
  const snapPoints = useMemo(
    () => customSnapPoints ?? ["90%"], // <=97% recommended to avoid opening issues
    [customSnapPoints]
  );

  const renderBackdrop = useCallback(
    (backdropProps: any) => (
      <BottomSheetBackdrop
        {...backdropProps}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0} // Start open; use 0 instead of -1 for reliability
        snapPoints={snapPoints}
        onChange={onChange}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        enableDynamicSizing={false} // Disable dynamic sizing
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize"
        {...props}
      >
        <BottomSheetView style={styles.contentContainer}>
          {isClose && (
            <View style={styles.header}>
              <Text style={styles.title}>Ajouter un client</Text>
              <BackButton
                backAction={() => bottomSheetModalRef.current?.close()}
                icon={<Feather size={Rs(18)} name="x" color={colors.red} />}
              />
            </View>
          )}
          <View style={{ marginTop: isClose ? Rs(35) : 0 }}>{children}</View>
        </BottomSheetView>
      </BottomSheetModal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    position: "relative",
  },
  header: {
    position: "absolute",
    top: Rs(1),
    width: "100%",
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Rs(20),
  },
  title: {
    fontSize: SIZES.md,
    fontWeight: "bold",
    color: colors.titleColor,
  },
});

export default BottomSheetCompoForm;
