"use client"; // Required for useRouter and event handlers

import React from "react";
import { useRouter } from "next/navigation";
import { Phone, Hospital, Siren, Contact, Landmark } from "lucide-react"; // Added new icons
// Assuming NextUI Button, adjust if using a different import path e.g. @/components/ui/button
// For now, we'll use standard button/a tags and style them with Tailwind.
// If specific NextUI components like Card or Text are available, they can be integrated.

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
  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-900"> {/* Added background for the whole screen */}
      <div className="overflow-y-auto px-4 sm:px-6 py-6"> {/* Adjusted padding */}
        <HeaderSection />
        <OfflineEmergencyCard />
        <EmergencyGrid />
        <EmergencyNumbersSection />
      </div>
    </div>
  );
}

function HeaderSection() {
  return (
    <div className="mb-8 text-center sm:text-left"> {/* Added bottom margin and text alignment */}
      <h1 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400 sm:text-4xl">
        Emergency & Safety
      </h1>
      <p className="text-base text-neutral-700 dark:text-neutral-300 sm:text-lg">
        Quick access to help
      </p>
    </div>
  );
}

function EmergencyGrid() {
  const router = useRouter();
  const emergencyItems = [
    {
      icon: Hospital,
      label: "Hospitals Near Me",
      onClick: () => {
        const query = "hospitals near me";
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
        window.open(url, "_blank", "noopener noreferrer");
      },
    },
    {
      icon: Siren,
      label: "Police Near Me",
      onClick: () => {
        const query = "police near me";
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
        window.open(url, "_blank", "noopener noreferrer");
      },
    },
    {
      icon: Contact,
      label: "Emergency Contacts",
      onClick: () => {
        router.push("/emergency/emergency-contacts");
      },
    },
    {
      icon: Landmark,
      label: "Embassy Contacts",
      onClick: () => {
        router.push("/emergency/embassy-contacts");
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-2"> {/* Changed to grid and gap-4 */}
      {emergencyItems.map((item, index) => (
        <button
          key={index}
          className="flex flex-col items-center justify-center p-5 rounded-xl bg-white dark:bg-slate-800 shadow-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150"
          onClick={item.onClick}
        >
          <item.icon size={32} className="mb-2 text-indigo-600 dark:text-indigo-400" />
          <p className="text-sm font-medium text-center text-neutral-800 dark:text-neutral-200">
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

function EmergencyNumbersSection() {
  return (
    <div className="p-5 rounded-xl bg-white dark:bg-slate-800 shadow-md mb-8">
      <h2 className="font-semibold text-xl mb-4 text-neutral-800 dark:text-neutral-100"> {/* Changed text-lg to text-xl */}
        Emergency Numbers
      </h2>
      {emergencyContacts.map(({ title, subtitle, phone }, index) => (
        <a
          key={index}
          href={phone}
          className="block p-4 rounded-lg flex flex-row justify-between items-center mb-3 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150"
        >
          <div>
            <p className="font-medium text-base text-neutral-800 dark:text-neutral-200">
              {title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
          </div>
          <Phone size={24} className="text-green-500" />
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
