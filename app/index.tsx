import { ActivityIndicator, View } from "react-native";

export default function Index() {
  // The root layout handles the initial redirect paths safely.
  // We render a clean blank space or loading wheel while it processes.
  return (
    <View
      style={{ flex: 1, backgroundColor: "#05070A", justifyContent: "center" }}
    >
      <ActivityIndicator size="small" color="#ffffff" />
    </View>
  );
}
