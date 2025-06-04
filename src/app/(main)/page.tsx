"use client";

import React, { useEffect, useState, startTransition } from "react"; // Added startTransition
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
  ListChecks,
} from "lucide-react";
import { getNearbyPlacesAction } from "./actions"; // Import server action
// import { LocationDetail } from "@/types/location-types"; // Assuming LocationDetail is the type in result.data

// Define ROUTES for Next.js (example)
export const ROUTES = {
  CULTURE: "/culture",
  ENTERTAINMENT: "/entertainment",
  FOOD: "/food",
  LANGUAGE: "/language",
  NEARBY: "/nearby",
  STAY: "/stay",
  TOP_PICKS: "/top-picks",
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

  // Helper to get current latitude and longitude
  const getCurrentLatLng = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }),
          (error) => {
            console.error("Error getting location:", error);
            setErrorMsg(
              "Permission to access location was denied. Using default location for nearby places.",
            );
            // Fallback to a default location if permission is denied or error occurs
            resolve({ lat: 40.7128, lng: -74.006 }); // Default: New York
          },
        );
      } else {
        setErrorMsg(
          "Geolocation is not supported by this browser. Using default location for nearby places.",
        );
        resolve({ lat: 40.7128, lng: -74.006 }); // Default: New York
      }
    });
  };

  useEffect(() => {
    // Set initial location display
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(
            `Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)}`,
          );
        },
        (error) => {
          setErrorMsg("Permission to access location was denied.");
          console.error(error);
        },
      );
    } else {
      setErrorMsg("Geolocation is not supported by this browser.");
    }

    const fetchData = async () => {
      // Fetch Top Picks
      setLoadingTopPicks(true);
      try {
        const { lat, lng } = await getCurrentLatLng();
        const locationString = `${lat},${lng}`;
        startTransition(async () => {
          const result = await getNearbyPlacesAction(
            locationString,
            ["tourist_attraction", "park"],
            5000,
          );
          if (result.success && result.data) {
            console.log(
              "HomeScreen: Received data for Top Picks from Server Action:",
              result.data,
            );
            setTopPicks(result.data.slice(0, 10));
          } else {
            console.error("Error fetching top picks:", result.error);
            setTopPicks([]);
          }
        });
      } catch (error) {
        console.error("Error in fetchTopPicks setup:", error);
        setTopPicks([]);
      } finally {
        setLoadingTopPicks(false);
      }

      // Fetch Entertainment
      setLoadingEntertainment(true);
      try {
        const { lat, lng } = await getCurrentLatLng(); // Potentially re-ask or use cached from above
        const locationString = `${lat},${lng}`;
        startTransition(async () => {
          const result = await getNearbyPlacesAction(
            locationString,
            ["movie_theater", "night_club"],
            5000,
          );
          if (result.success && result.data) {
            console.log(
              "HomeScreen: Received data for Entertainment from Server Action:",
              result.data,
            );
            setEntertainment(result.data.slice(0, 10));
          } else {
            console.error("Error fetching entertainment:", result.error);
            setEntertainment([]);
          }
        });
      } catch (error) {
        console.error("Error in fetchEntertainment setup:", error);
        setEntertainment([]);
      } finally {
        setLoadingEntertainment(false);
      }

      // Fetch Culture
      setLoadingCulture(true);
      try {
        const { lat, lng } = await getCurrentLatLng(); // Potentially re-ask or use cached from above
        const locationString = `${lat},${lng}`;
        startTransition(async () => {
          const result = await getNearbyPlacesAction(
            locationString,
            ["museum", "art_gallery"],
            5000,
          );
          if (result.success && result.data) {
            console.log(
              "HomeScreen: Received data for Culture from Server Action:",
              result.data,
            );
            setCulture(result.data.slice(0, 10));
          } else {
            console.error("Error fetching culture:", result.error);
            setCulture([]);
          }
        });
      } catch (error) {
        console.error("Error in fetchCulture setup:", error);
        setCulture([]);
      } finally {
        setLoadingCulture(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigation = (routeKey: RouteKey) => {
    console.log("Navigating with routeKey:", routeKey);
    const path = ROUTES[routeKey];
    console.log("Resolved path:", path);
    if (path) {
      router.push(path);
    } else {
      console.error(
        "Error: Invalid routeKey or path not found in ROUTES:",
        routeKey,
      );
    }
  };

  const handleExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener noreferrer");
  };

  const iconSize = 28; // Consistent size for feature icons

  const cardButtons = [
    {
      title: "Stay",
      icon: <BedDouble size={iconSize} />,
      color: "text-red-500",
      onPress: () => handleNavigation("STAY"),
    },
    {
      title: "Food",
      icon: <Utensils size={iconSize} />,
      color: "text-orange-500",
      onPress: () => handleNavigation("FOOD"),
    },
    {
      title: "Culture",
      icon: <TreePalm size={iconSize} />,
      color: "text-yellow-500",
      onPress: () => handleNavigation("CULTURE"),
    },
    {
      title: "Entertainment",
      icon: <Film size={iconSize} />,
      color: "text-green-500",
      onPress: () => handleNavigation("ENTERTAINMENT"),
    },
    {
      title: "Nearby",
      icon: <MapPin size={iconSize} />,
      color: "text-teal-500",
      onPress: () => handleNavigation("NEARBY"),
    },
    {
      title: "Top Picks",
      icon: <FerrisWheel size={iconSize} />,
      color: "text-blue-500",
      onPress: () => handleNavigation("TOP_PICKS"),
    },
    {
      title: "Emergency",
      icon: <Siren size={iconSize} />,
      color: "text-purple-500",
      onPress: () => handleNavigation("EMERGENCY"),
    }, // Changed Briefcase to Siren for Emergency
    {
      title: "Planner",
      icon: <ListChecks size={iconSize} />,
      color: "text-pink-500",
      onPress: () => handleNavigation("PLANNER"),
    }, // Changed ShoppingBag to ListChecks for Planner
  ];

  // Mock data for image paths - assuming they are moved to public/assets/images/
  // These structures are primarily for fallback if API fails or for providing image URLs
  const topPicksFallbackImages = [
    {
      id: "tp1",
      name: "Beach Paradise",
      image: "/assets/images/top-picks/img1.jpg",
      description: "Sun, sand, and sea.",
      location: { lat: 0, lng: 0 },
      category: "Nature",
      route: "TOP_PICKS" as RouteKey,
    },
    {
      id: "tp2",
      name: "Mountain Hike",
      image: "/assets/images/top-picks/img2.jpg",
      description: "Breathtaking views await.",
      location: { lat: 0, lng: 0 },
      category: "Adventure",
      route: "TOP_PICKS" as RouteKey,
    },
    {
      id: "tp3",
      name: "City Exploration",
      image: "/assets/images/top-picks/img3.jpg",
      description: "Discover urban wonders.",
      location: { lat: 0, lng: 0 },
      category: "Urban",
      route: "TOP_PICKS" as RouteKey,
    },
  ];

  const entertainmentFallbackImages = [
    {
      id: "e1",
      name: "Live Music Venue",
      image: "/assets/images/entertainment/img1.jpg",
      description: "Local bands and artists.",
      location: { lat: 0, lng: 0 },
      category: "Music",
      route: "ENTERTAINMENT" as RouteKey,
    },
    {
      id: "e2",
      name: "Cinema Complex",
      image: "/assets/images/entertainment/img2.jpg",
      description: "Latest movie releases.",
      location: { lat: 0, lng: 0 },
      category: "Movies",
      route: "ENTERTAINMENT" as RouteKey,
    },
  ];

  const cultureFallbackImages = [
    {
      id: "c1",
      name: "Historical Museum",
      image: "/assets/images/culture/img1.jpg",
      description: "Artifacts and exhibits.",
      location: { lat: 0, lng: 0 },
      category: "History",
      route: "CULTURE" as RouteKey,
    },
    {
      id: "c2",
      name: "Art Installation",
      image: "/assets/images/culture/img2.jpg",
      description: "Contemporary art pieces.",
      location: { lat: 0, lng: 0 },
      category: "Art",
      route: "CULTURE" as RouteKey,
    },
  ];

  // Sections for HorizontalScrollBar
  const sectionsData = [
    {
      title: "⭐ Top Picks For You",
      loading: loadingTopPicks,
      apiData: topPicks, // Array of LocationDetail from API
      fallbackImageSet: topPicksFallbackImages, // Used if item.photo_urls is missing
      scrollButtonKey: "TOP_PICKS" as RouteKey,
    },
    {
      title: "🎬 Entertainment Hotspots",
      loading: loadingEntertainment,
      apiData: entertainment,
      fallbackImageSet: entertainmentFallbackImages,
      scrollButtonKey: "ENTERTAINMENT" as RouteKey,
    },
    {
      title: "🏛️ Cultural Experiences",
      loading: loadingCulture,
      apiData: culture,
      fallbackImageSet: cultureFallbackImages,
      scrollButtonKey: "CULTURE" as RouteKey,
    },
  ];

  return (
    <div className="flex-1 bg-gray-100 dark:bg-slate-900">
      {" "}
      {/* Page Background */}
      <div className="overflow-y-auto">
        {" "}
        {/* Replaces ScrollView */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 shadow-lg">
          {" "}
          {/* Gradient may remain, text is white/light blue */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white">
                Hello, Wanderer!
              </p>
              <p className="text-sm text-blue-200 dark:text-blue-300">
                {" "}
                {/* Location/Error Text */}
                {location
                  ? `Current Location: ${location}`
                  : errorMsg || "Fetching location..."}
              </p>
            </div>
            {/* User initial circle */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-blue-600 dark:bg-slate-700 dark:text-blue-300">
              U
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for places, activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full px-4 py-3 pl-10 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-slate-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-yellow-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 transform">
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
                  className={`flex aspect-square flex-col items-center justify-center rounded-lg bg-white p-2 shadow transition-shadow hover:shadow-lg dark:bg-slate-800 dark:hover:shadow-slate-700/50`}
                >
                  {/* The 'icon' is now a component, color class is applied to the span wrapping it */}
                  <span className={`text-3xl ${button.color}`}>
                    {button.icon}
                  </span>
                  <span className="mt-1 text-center text-xs font-medium text-gray-700 dark:text-gray-300">
                    {button.title}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Horizontal Scroll Sections - Titles inside HorizontalScrollBar will need their own dark mode */}
          {sectionsData.map((section) => {
            // Determine the card data to pass: API data if not loading and available, otherwise fallback structured data.
            // The HorizontalScrollBar expects 'name' and 'location' in its cardData items.
            // API data (topPicks, entertainment, culture) should conform to LocationDetail.
            // Fallback data (e.g., topPicksFallbackImages) also has these fields.
            const cardDataForScroll = section.loading
              ? []
              : section.apiData.length > 0
                ? section.apiData
                : section.fallbackImageSet;

            // Prepare the images array for HorizontalScrollBar:
            // Prioritize photo_urls from API data, then fallback.
            const imagesForScroll = cardDataForScroll.map((place, index) => {
              // Assuming 'place' is of type LocationDetail (or similar structure with photo_urls)
              if (place.photo_urls && place.photo_urls.length > 0) {
                return place.photo_urls[0];
              }
              // Fallback logic if no photo_urls from API for this place
              if (section.fallbackImageSet.length > 0) {
                return section.fallbackImageSet[
                  index % section.fallbackImageSet.length
                ].image;
              }
              return "/assets/images/default-placeholder.png"; // Absolute last resort placeholder
            });

            return (
              <HorizontalScrollBar
                key={section.title}
                title={section.title}
                cardData={cardDataForScroll.map((item) => ({
                  // Ensure structure matches LocationDetail for HorizontalScrollBar
                  name: item.name || item.title || "Unknown Place",
                  location: item.location || { lat: 0, lng: 0 }, // Ensure location is present
                  place_id:
                    item.id ||
                    item.place_id ||
                    `fallback-${index}-${item.name}`, // Ensure place_id for key
                  // Pass other LocationDetail fields if needed by HorizontalScrollBar card rendering,
                  // though it primarily uses name for display and image from the separate 'images' prop.
                  // photo_urls: item.photo_urls, // Pass if HSB needs to make decisions based on it
                }))}
                images={imagesForScroll}
                scrollButton={{
                  route: section.scrollButtonKey,
                  loading: section.loading,
                }}
                handleNavigation={handleNavigation}
              />
            );
          })}

          {/* TODO: Add more sections as needed, e.g., Booking.com integration */}
          <section className="my-6 rounded-lg bg-white p-4 shadow dark:bg-slate-800">
            <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
              Plan Your Stay
            </h2>
            <button
              onClick={() => handleExternalLink("https://www.booking.com")}
              className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white shadow transition-colors hover:bg-blue-600"
              // Vibrant button, likely okay as is. Text is white.
            >
              Search on Booking.com <Briefcase size={18} className="ml-2" />
            </button>
          </section>
        </main>
        <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Your App Name. All rights
            reserved.
          </p>
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
