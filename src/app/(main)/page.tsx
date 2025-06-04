"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Briefcase,
  BedDouble,
  Utensils,
  TreePalm,
  Film,
  MapPin,
  FerrisWheel,
  Siren,
  ListChecks
} from "lucide-react";

// Assuming getHiddenLocations is adapted for web (e.g., uses fetch)
// import { getHiddenLocations } from "@/services/location-service";
// import { LocationDetail } from "@/types/location-types";

// Placeholder for location service - replace with actual implementation
const getHiddenLocations = async (type: string): Promise<any[]> => {
  console.log(`Fetching hidden locations for ${type}`);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return mock data based on type for demonstration
  const mockImages: Record<string, { id: string; image: string; title: string; route?: keyof typeof ROUTES; externalUrl?: string }[]> = {
    "Top Picks": [
      { id: "tp1", image: "/assets/images/top-picks/img1.jpg", title: "Beautiful Beach" },
      { id: "tp2", image: "/assets/images/top-picks/img2.jpg", title: "Mountain View" },
      { id: "tp3", image: "/assets/images/top-picks/img3.jpg", title: "Historic Site" },
    ],
    "Entertainment": [
      { id: "e1", image: "/assets/images/entertainment/img1.jpg", title: "Local Concert" },
      { id: "e2", image: "/assets/images/entertainment/img2.jpg", title: "Street Performance" },
    ],
    "Culture": [
      { id: "c1", image: "/assets/images/culture/img1.jpg", title: "Museum Visit" },
      { id: "c2", image: "/assets/images/culture/img2.jpg", title: "Art Gallery" },
    ],
  };
  return mockImages[type] || [];
};


// Define ROUTES for Next.js (example)
export const ROUTES = {
  CULTURE: "/home/culture",
  ENTERTAINMENT: "/home/entertainment",
  FOOD: "/home/food",
  LANGUAGE: "/home/language",
  NEARBY: "/home/nearby",
  STAY: "/home/stay",
  TOP_PICKS: "/home/top-picks", // Changed "TOP PICKS" to TOP_PICKS
  EMERGENCY: "/emergency",
  PLANNER: "/planner",
} as const;

type RouteKey = keyof typeof ROUTES;


import HorizontalScrollBar from "@/components/home/horizontal-scroll-bar";

export default function HomeScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [topPicks, setTopPicks] = useState<any[]>([]);
  const [loadingTopPicks, setLoadingTopPicks] = useState(true);
  const [entertainment, setEntertainment] = useState<any[]>([]);
  const [loadingEntertainment, setLoadingEntertainment] = useState(true);
  const [culture, setCulture] = useState<any[]>([]);
  const [loadingCulture, setLoadingCulture] = useState(true);

  useEffect(() => {
    (async () => {
      // Location permission and fetching
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // For simplicity, not using reverse geocoding here.
              // In a real app, you'd convert lat/lon to a city name.
              setLocation(`Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)}`);
            } catch (e) {
              setErrorMsg("Failed to fetch location details.");
              console.error(e);
            }
          },
          (error) => {
            setErrorMsg("Permission to access location was denied.");
            console.error(error);
          }
        );
      } else {
        setErrorMsg("Geolocation is not supported by this browser.");
      }

      // Fetch initial data
      setLoadingTopPicks(true);
      getHiddenLocations("Top Picks").then(setTopPicks).finally(() => setLoadingTopPicks(false));
      setLoadingEntertainment(true);
      getHiddenLocations("Entertainment").then(setEntertainment).finally(() => setLoadingEntertainment(false));
      setLoadingCulture(true);
      getHiddenLocations("Culture").then(setCulture).finally(() => setLoadingCulture(false));
    })();
  }, []);

  const handleNavigation = (routeKey: RouteKey) => {
    console.log("Navigating with routeKey:", routeKey);
    const path = ROUTES[routeKey];
    console.log("Resolved path:", path);
    if (path) {
      router.push(path);
    } else {
      console.error("Error: Invalid routeKey or path not found in ROUTES:", routeKey);
    }
  };

  const handleExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener noreferrer");
  };

  const iconSize = 28; // Consistent size for feature icons

  const cardButtons = [
    { title: "Stay", icon: <BedDouble size={iconSize} />, color: "text-red-500", onPress: () => handleNavigation("STAY") },
    { title: "Food", icon: <Utensils size={iconSize} />, color: "text-orange-500", onPress: () => handleNavigation("FOOD") },
    { title: "Culture", icon: <TreePalm size={iconSize} />, color: "text-yellow-500", onPress: () => handleNavigation("CULTURE") },
    { title: "Entertainment", icon: <Film size={iconSize} />, color: "text-green-500", onPress: () => handleNavigation("ENTERTAINMENT") },
    { title: "Nearby", icon: <MapPin size={iconSize} />, color: "text-teal-500", onPress: () => handleNavigation("NEARBY") },
    { title: "Top Picks", icon: <FerrisWheel size={iconSize} />, color: "text-blue-500", onPress: () => handleNavigation("TOP_PICKS") },
    { title: "Emergency", icon: <Siren size={iconSize} />, color: "text-purple-500", onPress: () => handleNavigation("EMERGENCY") }, // Changed Briefcase to Siren for Emergency
    { title: "Planner", icon: <ListChecks size={iconSize} />, color: "text-pink-500", onPress: () => handleNavigation("PLANNER") }, // Changed ShoppingBag to ListChecks for Planner
  ];

  // Mock data for image paths - assuming they are moved to public/assets/images/
  // These structures are primarily for fallback if API fails or for providing image URLs
  const topPicksImagesData = [
    { id: "tp1", name: "Beach Paradise", image: "/assets/images/top-picks/img1.jpg", description: "Sun, sand, and sea.", location: { lat: 0, lng: 0 }, category: "Nature", route: "TOP_PICKS" as RouteKey }, // Changed to TOP_PICKS
    { id: "tp2", name: "Mountain Hike", image: "/assets/images/top-picks/img2.jpg", description: "Breathtaking views await.", location: { lat: 0, lng: 0 }, category: "Adventure", route: "TOP_PICKS" as RouteKey }, // Changed to TOP_PICKS
    { id: "tp3", name: "City Exploration", image: "/assets/images/top-picks/img3.jpg", description: "Discover urban wonders.", location: { lat: 0, lng: 0 }, category: "Urban", route: "TOP_PICKS" as RouteKey }, // Changed to TOP_PICKS
  ];

  const entertainmentImagesData = [
    { id: "e1", name: "Live Music Venue", image: "/assets/images/entertainment/img1.jpg", description: "Local bands and artists.", location: { lat: 0, lng: 0 }, category: "Music", route: "ENTERTAINMENT" as RouteKey },
    { id: "e2", name: "Cinema Complex", image: "/assets/images/entertainment/img2.jpg", description: "Latest movie releases.", location: { lat: 0, lng: 0 }, category: "Movies", route: "ENTERTAINMENT" as RouteKey },
  ];

  const cultureImagesData = [
    { id: "c1", name: "Historical Museum", image: "/assets/images/culture/img1.jpg", description: "Artifacts and exhibits.", location: { lat: 0, lng: 0 }, category: "History", route: "CULTURE" as RouteKey },
    { id: "c2", name: "Art Installation", image: "/assets/images/culture/img2.jpg", description: "Contemporary art pieces.", location: { lat: 0, lng: 0 }, category: "Art", route: "CULTURE" as RouteKey },
  ];

  // Sections for HorizontalScrollBar
  const sections = [
    {
      title: "⭐ Top Picks For You",
      dataKey: "topPicks",
      loading: loadingTopPicks,
      apiData: topPicks,
      fallbackData: topPicksImagesData,
      scrollButtonKey: "TOP_PICKS" as RouteKey // Changed to scrollButtonKey and RouteKey
    },
    {
      title: "🎬 Entertainment Hotspots",
      dataKey: "entertainment",
      loading: loadingEntertainment,
      apiData: entertainment,
      fallbackData: entertainmentImagesData,
      scrollButtonKey: "ENTERTAINMENT" as RouteKey // Changed to scrollButtonKey and RouteKey
    },
    {
      title: "🏛️ Cultural Experiences",
      dataKey: "culture",
      loading: loadingCulture,
      apiData: culture,
      fallbackData: cultureImagesData,
      scrollButtonKey: "CULTURE" as RouteKey // Changed to scrollButtonKey and RouteKey
    }
  ];

  return (
    <div className="flex-1 bg-gray-100 dark:bg-slate-900"> {/* Page Background */}
      <div className="overflow-y-auto"> {/* Replaces ScrollView */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 shadow-lg"> {/* Gradient may remain, text is white/light blue */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg font-semibold text-white">Hello, Wanderer!</p>
              <p className="text-sm text-blue-200 dark:text-blue-300"> {/* Location/Error Text */}
                {location ? `Current Location: ${location}` : errorMsg || "Fetching location..."}
              </p>
            </div>
            {/* User initial circle */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 dark:bg-slate-700 dark:text-blue-300 font-bold">
              U
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for places, activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-4 pl-10 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-slate-800 dark:text-gray-100 dark:focus:ring-yellow-500 dark:placeholder-gray-400"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={20} className="text-gray-400 dark:text-gray-500" />
            </span>
          </div>
        </header>

        <main className="p-5">
          {/* Feature Buttons Grid */}
          <section className="mb-6">
            <div className="grid grid-cols-4 gap-3">
              {cardButtons.map((button) => (
                <button
                  key={button.title}
                  onClick={button.onPress}
                  className={`flex flex-col items-center justify-center p-2 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg dark:hover:shadow-slate-700/50 transition-shadow aspect-square`}
                >
                  {/* The 'icon' is now a component, color class is applied to the span wrapping it */}
                  <span className={`text-3xl ${button.color}`}>{button.icon}</span>
                  <span className="mt-1 text-xs font-medium text-center text-gray-700 dark:text-gray-300">{button.title}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Horizontal Scroll Sections - Titles inside HorizontalScrollBar will need their own dark mode */}
          {sections.map((section) => {
            const currentData = section.loading ? [] : (section.apiData.length > 0 ? section.apiData : section.fallbackData);
            // Ensure cardData has a compatible structure for LocationDetail, particularly name and location
            // For mock data, we ensure 'name' and 'location' exist. API data should also conform.
            const cardDataForScroll = currentData.map(item => ({
              ...item,
              name: item.name || item.title || "Unknown Place", // Ensure 'name' exists
              location: item.location || { lat: 0, lng: 0 }, // Ensure 'location' exists
            }));

            return (
              <HorizontalScrollBar
                key={section.title}
                title={section.title}
                cardData={cardDataForScroll}
                // The 'images' prop for HorizontalScrollBar expects string[] for background cycling
                // We'll derive this from the fallbackData, assuming each item has an 'image' field.
                images={section.fallbackData.map(item => item.image)}
                scrollButton={{ route: section.scrollButtonKey, loading: section.loading }} // Pass RouteKey here
                handleNavigation={handleNavigation}
              />
            );
          })}

          {/* TODO: Add more sections as needed, e.g., Booking.com integration */}
          <section className="my-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
             <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">Plan Your Stay</h2>
             <button
                onClick={() => handleExternalLink("https://www.booking.com")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow transition-colors flex items-center justify-center"
                // Vibrant button, likely okay as is. Text is white.
             >
                Search on Booking.com <Briefcase size={18} className="ml-2" />
             </button>
          </section>

        </main>
        <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Your App Name. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

// Note: Ensure images are in public/assets/images/top-picks, public/assets/images/entertainment, etc.
// Example: public/assets/images/top-picks/img1.jpg
// TODO: Replace text icons like "[ICON: search]" with actual SVG icons from a library like Lucide or Heroicons.
// TODO: Replace the placeholder HorizontalScrollBar component with the actual converted component.
// TODO: Refine styling, especially for responsiveness and consistency with Next UI theme if applicable.
// TODO: Implement proper error handling and loading states for UI.
// TODO: The getHiddenLocations function is a placeholder and should be replaced with actual API calls.
// TODO: Consider using Next.js Image component for image optimization instead of standard <img> tags.
