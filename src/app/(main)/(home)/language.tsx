// Updated: LanguageScreen.tsx

import React from "react";
import { Text, View } from "react-native";
import { WebView } from "react-native-webview";

export default function LanguageScreen() {
  return (
    <View className="flex-1 bg-gray-50 px-5 pt-6">
      {/* Heading */}
      {/* <Text className="text-2xl font-bold text-indigo-700 mb-4">
        Need Language Help?
      </Text> */}

      {/* Subheading */}
      <Text className="mb-4 text-base text-gray-700">
        Use the tool below to translate text or phrases using Google Translate.
      </Text>

      {/* WebView container */}
      <View className="flex-1 overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-md">
        <WebView
          originWhitelist={["*"]}
          source={{ uri: "https://translate.google.com/" }}
          startInLoadingState={true}
        />
      </View>
    </View>
  );
}
