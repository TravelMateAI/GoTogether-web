"use client"; // Required for useRouter and event handlers

import React from "react";
import { useRouter } from "next/navigation"; // Changed from expo-router
import { Phone } from "lucide-react";
// Assuming NextUI Button, adjust if using a different import path e.g. @/components/ui/button
// For now, we'll use standard button/a tags and style them with Tailwind.
// If specific NextUI components like Card or Text are available, they can be integrated.

// TODO: Define or import Colors. For now, using placeholder Tailwind classes.
// const colorScheme = {
//   tint: "text-blue-500", // Placeholder
//   text: "text-gray-800", // Placeholder
//   background: "bg-white", // Placeholder
// };

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
  // ... (other contacts omitted for brevity)
];

export default function EmergencyScreen() {
  // TODO: Adapt colorScheme handling. Using placeholders for now.
  const colorScheme = {
    tint: "text-blue-600", // Example placeholder
    text: "text-neutral-800", // Example placeholder
    background: "bg-neutral-50", // Example placeholder
  };

  return (
    <div className="flex-1"> {/* Replaces SafeAreaView */}
      <div className="overflow-y-auto px-6 pt-1.5"> {/* Replaces ScrollView and container styles */}
        <HeaderSection colorScheme={colorScheme} />
        <OfflineEmergencyCard />
        <EmergencyGrid colorScheme={colorScheme} />
        <EmergencyNumbersSection colorScheme={colorScheme} />
      </div>
    </div>
  );
}

function HeaderSection({ colorScheme }: { colorScheme: { tint: string; text: string; } }) {
  // Applying dark mode variants directly, assuming colorScheme.tint = "text-blue-600" and colorScheme.text = "text-neutral-800"
  return (
    <>
      <h1 className={`text-3xl font-bold mb-1 ${colorScheme.tint} dark:text-blue-400`}> {/* Replaces Text and styles */}
        Emergency & Safety
      </h1>
      <p className={`text-base mb-7 ${colorScheme.text} dark:text-neutral-300`}> {/* Replaces Text and styles */}
        Quick access to help
      </p>
    </>
  );
}

function EmergencyGrid({ colorScheme }: { colorScheme: { text: string; background: string; } }) {
  const router = useRouter();
  const emergencyItems = [
    {
      emoji: "🚑",
      label: "Hospitals Near Me",
      onClick: () => {
        const query = "hospitals near me";
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
        window.open(url, "_blank", "noopener noreferrer"); // Replaces Linking.openURL
      },
    },
    {
      emoji: "🚨",
      label: "Police Near Me",
      onClick: () => {
        const query = "police near me";
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
        window.open(url, "_blank", "noopener noreferrer"); // Replaces Linking.openURL
      },
    },
    {
      emoji: "☎️",
      label: "Emergency Contacts",
      onClick: () => {
        router.push("/emergency/emergency-contacts"); // Updated path
      },
    },
    {
      emoji: "🏛️",
      label: "Embassy Contacts",
      onClick: () => {
        router.push("/emergency/embassy-contacts"); // Updated path
      },
    },
  ];

  return (
    <div className="flex flex-row flex-wrap justify-between mb-6 gap-0.5"> {/* Replaces View and grid styles */}
      {emergencyItems.map((item, index) => (
        <button // Replaces PlatformPressable, can be a NextUI Button
          key={index}
          // Assuming colorScheme.background = "bg-neutral-50" and colorScheme.text = "text-neutral-800"
          className={`w-[48%] p-5 rounded-2xl items-center mb-4 border border-gray-200 dark:border-slate-700 ${colorScheme.background} dark:bg-slate-800`} // card1 styles
          onClick={item.onClick}
        >
          <span className="text-3xl mb-2 block text-center">{item.emoji}</span> {/* icon styles, ensure span behaves like Text */}
          <p className={`text-sm font-medium text-center ${colorScheme.text} dark:text-neutral-200`}> {/* label styles */}
            {item.label}
          </p>
        </button>
      ))}
    </div>
  );
}

function OfflineEmergencyCard() {
  return (
    <div className="p-5 rounded-2xl mb-8 border border-gray-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/70"> {/* offlineCard styles, bg-amber-50 */}
      <h2 className="font-semibold text-lg mb-3 text-yellow-700 dark:text-yellow-300"> {/* offlineTitle styles, text-amber-700 */}
        Offline Emergency Card
      </h2>
      <p className="text-sm mb-4 text-gray-700 dark:text-yellow-200"> {/* offlineDescription styles */}
        Save this information for offline access in case of emergency.
      </p>
      <button // Replaces TouchableOpacity, can be NextUI Button
        className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-2xl border border-gray-200 dark:border-yellow-800 items-center" // offlineButton styles - vibrant CTA, border adjusted
        onClick={() => {
          // TODO: handle download offline card
          console.log("TODO: handle download offline card");
        }}
      >
        <p className="text-white font-semibold text-base">Download Offline Card</p> {/* offlineButtonText styles */}
      </button>
    </div>
  );
}

function EmergencyNumbersSection({
  colorScheme,
}: {
  colorScheme: { text: string; background: string; };
}) {
  // Assuming colorScheme.background = "bg-neutral-50" and colorScheme.text = "text-neutral-800"
  return (
    <div className={`p-5 rounded-2xl mb-8 border border-gray-200 dark:border-slate-700 ${colorScheme.background} dark:bg-slate-800`}> {/* subContainer styles */}
      <h2 className={`font-semibold text-lg mb-4 ${colorScheme.text} dark:text-neutral-100`}> {/* header styles */}
        Emergency Numbers
      </h2>
      {emergencyContacts.map(({ title, subtitle, phone }, index) => (
        <a // Replaces TouchableOpacity for tel: links
          key={index}
          href={phone} // Standard href for tel links
          className="block p-4 rounded-2xl flex flex-row justify-between items-center mb-3 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700" // card2 styles
        >
          <div>
            <p className={`font-medium text-base ${colorScheme.text} dark:text-neutral-200`}> {/* title2 styles */}
              {title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p> {/* subtitle styles */}
          </div>
          {/* IconSymbol replaced with Lucide icon */}
          <Phone size={24} className="text-green-500" /> {/* Phone icon color remains green */}
        </a>
      ))}
    </div>
  );
}
// StyleSheet.create is removed as styles are now inline Tailwind CSS.
// Ensure Tailwind CSS is set up in your Next.js project.
// Add necessary NextUI imports if you plan to use specific components like Button, Card etc.
// For example: import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
// import { Text } from "@nextui-org/react"; // if NextUI text component is preferred
