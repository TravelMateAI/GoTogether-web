import { PlatformPressable } from "@react-navigation/elements";
import React from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const emergencyContacts = [
  // URGENT EMERGENCY NUMBERS
  {
    title: "Police Emergency Hotline",
    subtitle: "Police Emergency",
    phone: "tel:119",
  },
  {
    title: "Ambulance / Fire & Rescue",
    subtitle: "Medical and Fire Emergencies",
    phone: "tel:110",
  },
  {
    title: "Fire & Ambulance Service (Colombo)",
    subtitle: "Fire & Ambulance",
    phone: "tel:0112422222",
  },
  {
    title: "Fire Department",
    subtitle: "Emergency Response",
    phone: "tel:+94112223344",
  },

  // MEDICAL EMERGENCIES
  {
    title: "Emergency Medical Services",
    subtitle: "Ambulance Service",
    phone: "tel:0112421052",
  },
  {
    title: "Accident Service - General Hospital - Colombo",
    subtitle: "Hospital Emergency",
    phone: "tel:0112691111",
  },

  // POLICE & CRIME REPORTING
  {
    title: "Tourist Police",
    subtitle: "English Speaking Assistance",
    phone: "tel:0112421052",
  },
  {
    title: "Report Crimes",
    subtitle: "Crime Reporting",
    phone: "tel:0112691500",
  },
  {
    title: "Emergency Police Mobile Squad",
    subtitle: "Mobile Police Unit",
    phone: "tel:0115717171",
  },
  {
    title: "Police Emergency Line (Landline)",
    subtitle: "Police Emergency",
    phone: "tel:0112433333",
  },

  // GENERAL INFORMATION
  {
    title: "Government Information Center",
    subtitle: "General Info and Help",
    phone: "tel:1919",
  },
];

export default function EmergencyScreen() {
  const colorSchemeName = "light";
  const colorScheme = Colors[colorSchemeName];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.container]}>
        <HeaderSection colorScheme={colorScheme} />
        <OfflineEmergencyCard />
        <EmergencyGrid colorScheme={colorScheme} />
        <EmergencyNumbersSection colorScheme={colorScheme} />
      </ScrollView>
    </SafeAreaView>
  );
}

function HeaderSection({ colorScheme }: { colorScheme: typeof Colors.light }) {
  return (
    <>
      <Text style={[styles.title, { color: colorScheme.tint }]}>
        Emergency & Safety
      </Text>
      <Text style={[styles.text, { color: colorScheme.text }]}>
        Quick access to help
      </Text>
    </>
  );
}

function EmergencyGrid({ colorScheme }: { colorScheme: typeof Colors.light }) {
  const router = useRouter();
  const emergencyItems = [
    {
      emoji: "🚑",
      label: "Hospitals Near Me",
      onClick: () => {
        const query = "hospitals near me";
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
        Linking.openURL(url);
      },
    },
    {
      emoji: "🚨",
      label: "Police Near Me",
      onClick: () => {
        const query = "police near me";
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
        Linking.openURL(url);
      },
    },
    {
      emoji: "☎️",
      label: "Emergency Contacts",
      onClick: () => {
        router.push("/(emergency)/emergency-contacts");
      },
    },
    {
      emoji: "🏛️",
      label: "Embassy Contacts",
      onClick: () => {
        router.push("/(emergency)/embassy-contacts");
      },
    },
  ];

  return (
    <View style={styles.grid}>
      {emergencyItems.map((item, index) => (
        <PlatformPressable
          key={index}
          style={[styles.card1, { backgroundColor: colorScheme.background }]}
          onPress={item.onClick}
        >
          <Text style={styles.icon}>{item.emoji}</Text>
          <Text style={[styles.label, { color: colorScheme.text }]}>
            {item.label}
          </Text>
        </PlatformPressable>
      ))}
    </View>
  );
}

function OfflineEmergencyCard() {
  return (
    <View
      style={[
        styles.offlineCard,
        { backgroundColor: "#FFFBEB" /* amber-50 */ },
      ]}
    >
      <Text style={[styles.offlineTitle, { color: "#B45309" /* amber-700 */ }]}>
        Offline Emergency Card
      </Text>
      <Text
        style={[styles.offlineDescription, { color: "#44403C" /* gray-700 */ }]}
      >
        Save this information for offline access in case of emergency.
      </Text>
      <TouchableOpacity
        style={styles.offlineButton}
        onPress={() => {
          // TODO: handle download offline card
        }}
      >
        <Text style={styles.offlineButtonText}>Download Offline Card</Text>
      </TouchableOpacity>
    </View>
  );
}

function EmergencyNumbersSection({
  colorScheme,
}: {
  colorScheme: typeof Colors.light;
}) {
  return (
    <View
      style={[styles.subContainer, { backgroundColor: colorScheme.background }]}
    >
      <Text style={[styles.header, { color: colorScheme.text }]}>
        Emergency Numbers
      </Text>
      {emergencyContacts.map(({ title, subtitle, phone }, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            Linking.canOpenURL(phone).then((supported) => {
              if (supported) {
                Linking.openURL(phone);
              } else {
                Alert.alert("Error", "Unable to open the dialer.");
              }
            });
          }}
        >
          <View style={styles.card2}>
            <View>
              <Text style={[styles.title2, { color: colorScheme.text }]}>
                {title}
              </Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            <IconSymbol name="phone" size={24} color="green" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 2, // newer RN versions support this
  },
  card1: {
    width: "48%",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  offlineCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  offlineTitle: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 12,
  },
  offlineDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  offlineButton: {
    width: "100%",
    backgroundColor: "#EA580C",
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  offlineButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  subContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  header: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 16,
  },
  card2: {
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  title2: {
    fontWeight: "500",
    fontSize: 16,
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
