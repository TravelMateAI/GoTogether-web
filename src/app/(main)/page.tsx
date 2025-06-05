"use client";

import React, { useEffect, useState, startTransition } from "react";
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
  Loader2, // Import Loader2
} from "lucide-react";
import { getNearbyPlacesAction, geocodeAddressAction, GeocodeResult } from "./actions"; // Import geocodeAddressAction and GeocodeResult
import type { LocationDetail } from "@/types/location-types";
import { useTranslations } from "next-intl";
import { ROUTES, RouteKey } from "@/lib/routes"; // Import ROUTES and RouteKey

import HorizontalScrollBar from "@/components/home/horizontal-scroll-bar";

// Fallback image definitions, updated to include vicinity and geometry
const topPicksFallbackImages = [
  { id: "tp1", name: "Beach Paradise", image: "/assets/images/top-picks/img1.jpg", description: "Sun, sand, and sea.", geometry: { location: { lat: 0, lng: 0 } }, vicinity: "Popular Beach Area", category: "Nature", route: "TOP_PICKS" as RouteKey, place_id: "tp1_fallback", photo_urls: ["/assets/images/top-picks/img1.jpg"]},
  { id: "tp2", name: "Mountain Hike", image: "/assets/images/top-picks/img2.jpg", description: "Breathtaking views await.", geometry: { location: { lat: 0, lng: 0 } }, vicinity: "Scenic Mountain Trails", category: "Adventure", route: "TOP_PICKS" as RouteKey, place_id: "tp2_fallback", photo_urls: ["/assets/images/top-picks/img2.jpg"]},
  { id: "tp3", name: "City Exploration", image: "/assets/images/top-picks/img3.jpg", description: "Discover urban wonders.", geometry: { location: { lat: 0, lng: 0 } }, vicinity: "Downtown City Center", category: "Urban", route: "TOP_PICKS" as RouteKey, place_id: "tp3_fallback", photo_urls: ["/assets/images/top-picks/img3.jpg"]},
];
const entertainmentFallbackImages = [
  { id: "e1", name: "Live Music Venue", image: "/assets/images/entertainment/img1.jpg", description: "Local bands and artists.", geometry: { location: { lat: 0, lng: 0 } }, vicinity: "Entertainment District", category: "Music", route: "ENTERTAINMENT" as RouteKey, place_id: "e1_fallback", photo_urls: ["/assets/images/entertainment/img1.jpg"]},
  { id: "e2", name: "Cinema Complex", image: "/assets/images/entertainment/img2.jpg", description: "Latest movie releases.", geometry: { location: { lat: 0, lng: 0 } }, vicinity: "Mall Area", category: "Movies", route: "ENTERTAINMENT" as RouteKey, place_id: "e2_fallback", photo_urls: ["/assets/images/entertainment/img2.jpg"]},
];
const cultureFallbackImages = [
  { id: "c1", name: "Historical Museum", image: "/assets/images/culture/img1.jpg", description: "Artifacts and exhibits.", geometry: { location: { lat: 0, lng: 0 } }, vicinity: "Old Town", category: "History", route: "CULTURE" as RouteKey, place_id: "c1_fallback", photo_urls: ["/assets/images/culture/img1.jpg"]},
  { id: "c2", name: "Art Installation", image: "/assets/images/culture/img2.jpg", description: "Contemporary art pieces.", geometry: { location: { lat: 0, lng: 0 } }, vicinity: "Art District", category: "Art", route: "CULTURE" as RouteKey, place_id: "c2_fallback", photo_urls: ["/assets/images/culture/img2.jpg"]},
];

interface SectionDataState {
  data: LocationDetail[];
  isLoading: boolean;
  error: string | null;
}
interface AllSectionsDataState {
  [key: string]: SectionDataState;
}

export default function HomeScreen() {
  const t = useTranslations("HomeScreen");
  const router = useRouter();
  const [locationDisplay, setLocationDisplay] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionsData, setSectionsData] = useState<AllSectionsDataState>({});

  // State for geocoding
  const [geocodedResults, setGeocodedResults] = useState<GeocodeResult[]>([]);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const homeSectionsConfig = [
    { id: "topPicks", titleKey: "topPicksTitle", queryTypes: ["tourist_attraction", "park"], radius: 5000, fallbackImageSet: topPicksFallbackImages, scrollButtonKey: "TOP_PICKS" as RouteKey },
    { id: "entertainment", titleKey: "entertainmentTitle", queryTypes: ["movie_theater", "night_club"], radius: 5000, fallbackImageSet: entertainmentFallbackImages, scrollButtonKey: "ENTERTAINMENT" as RouteKey },
    { id: "culture", titleKey: "cultureTitle", queryTypes: ["museum", "art_gallery"], radius: 5000, fallbackImageSet: cultureFallbackImages, scrollButtonKey: "CULTURE" as RouteKey },
  ];

  const getCurrentLatLng = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
          (error) => {
            console.error("Error getting location:", error);
            setErrorMsg("Permission to access location was denied. Using default location.");
            resolve({ lat: 40.7128, lng: -74.006 }); // Default: New York
          },
        );
      } else {
        setErrorMsg("Geolocation is not supported. Using default location.");
        resolve({ lat: 40.7128, lng: -74.006 }); // Default: New York
      }
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocationDisplay(`Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)}`),
        (error) => { setErrorMsg("Permission to access location was denied."); console.error(error); },
      );
    } else {
      setErrorMsg("Geolocation is not supported by this browser.");
    }

    const fetchAllSectionsData = async () => {
      const { lat, lng } = await getCurrentLatLng();
      const locationString = `${lat},${lng}`;
      homeSectionsConfig.forEach((section) => {
        startTransition(async () => {
          setSectionsData((prevData) => ({ ...prevData, [section.id]: { data: [], isLoading: true, error: null } }));
          try {
            const result = await getNearbyPlacesAction(locationString, section.queryTypes, section.radius);
            if (result.success && result.data) {
              setSectionsData((prevData) => ({ ...prevData, [section.id]: { data: result.data!.slice(0, 10), isLoading: false, error: null } }));
            } else {
              setSectionsData((prevData) => ({ ...prevData, [section.id]: { data: [], isLoading: false, error: result.error || `Failed to fetch ${t(section.titleKey)}.` } }));
            }
          } catch (error) {
            setSectionsData((prevData) => ({ ...prevData, [section.id]: { data: [], isLoading: false, error: (error as Error).message || `Exception fetching ${t(section.titleKey)}.` } }));
          }
        });
      });
    };
    fetchAllSectionsData();
  }, [t]);

  const handleSearchSubmit = async (query: string) => {
    if (!query.trim()) {
      setGeocodedResults([]);
      setGeocodingError(null);
      return;
    }
    startTransition(() => {
      setIsGeocoding(true);
      setGeocodingError(null);
      setGeocodedResults([]);
    });

    const result = await geocodeAddressAction(query);

    startTransition(() => {
      if (result.success && result.data) {
        if (result.status === "ZERO_RESULTS" || result.data.length === 0) {
          setGeocodingError("No results found for this address.");
          setGeocodedResults([]);
        } else {
          setGeocodedResults(result.data);
          setGeocodingError(null);
        }
      } else {
        setGeocodingError(result.error || "Failed to geocode address.");
        setGeocodedResults([]);
      }
      setIsGeocoding(false);
    });
  };

  const handleNavigation = (routeKey: RouteKey) => {
    const path = ROUTES[routeKey];
    if (path) router.push(path); else console.error("Error: Invalid routeKey or path not found:", routeKey);
  };

  const handleExternalLink = (url: string) => window.open(url, "_blank", "noopener noreferrer");

  const iconSize = 28;
  const cardButtons = [
    { title: "Stay", icon: <BedDouble size={iconSize} />, color: "text-red-500", onPress: () => handleNavigation("STAY") },
    { title: "Food", icon: <Utensils size={iconSize} />, color: "text-orange-500", onPress: () => handleNavigation("FOOD") },
    { title: "Culture", icon: <TreePalm size={iconSize} />, color: "text-yellow-500", onPress: () => handleNavigation("CULTURE") },
    { title: "Entertainment", icon: <Film size={iconSize} />, color: "text-green-500", onPress: () => handleNavigation("ENTERTAINMENT") },
    { title: "Nearby", icon: <MapPin size={iconSize} />, color: "text-teal-500", onPress: () => handleNavigation("NEARBY") },
    { title: "Top Picks", icon: <FerrisWheel size={iconSize} />, color: "text-blue-500", onPress: () => handleNavigation("TOP_PICKS") },
    { title: "Emergency", icon: <Siren size={iconSize} />, color: "text-purple-500", onPress: () => handleNavigation("EMERGENCY") },
    { title: "Planner", icon: <ListChecks size={iconSize} />, color: "text-pink-500", onPress: () => handleNavigation("PLANNER") },
  ];

  return (
    <div className="flex-1 bg-gray-100 dark:bg-slate-900">
      <div className="overflow-y-auto">
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white">{t("greeting")}</p>
              <p className="text-sm text-blue-200 dark:text-blue-300">
                {locationDisplay ? `Current Location: ${locationDisplay}` : errorMsg || "Fetching location..."}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-blue-600 dark:bg-slate-700 dark:text-blue-300">U</div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // Prevent default if part of a form
                  handleSearchSubmit(searchQuery);
                }
              }}
              className="w-full rounded-full px-4 py-3 pl-10 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-slate-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-yellow-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 transform">
              <Search size={20} className="text-gray-400 dark:text-gray-500" />
            </span>
          </div>
        </header>

        {/* Geocoding Results Section */}
        <div className="p-5"> {/* Added padding to match main content area */}
          {isGeocoding && (
            <div className="flex items-center justify-center my-4">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="ml-2 text-gray-700 dark:text-gray-300">Geocoding address...</p>
            </div>
          )}
          {geocodingError && (
            <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-md">
              {geocodingError}
            </div>
          )}
          {!isGeocoding && !geocodingError && geocodedResults.length > 0 && (
            <div className="my-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Geocoding Results:</h3>
              <ul className="space-y-2">
                {geocodedResults.map((result) => (
                  <li key={result.place_id} className="text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700 pb-1 last:border-b-0">
                    <p><strong>{result.formatted_address}</strong></p>
                    <p>Coordinates: Lat: {result.geometry.location.lat.toFixed(5)}, Lng: {result.geometry.location.lng.toFixed(5)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
           {!isGeocoding && !geocodingError && geocodedResults.length === 0 && searchQuery && (
            <div className="my-4 p-3 text-center text-gray-500 dark:text-gray-400">
              {/* This message shows after a search yields no results and isn't an error, or if search was cleared.
                  To be more specific, a "No results found" is handled by geocodingError state.
                  This part might need refinement based on desired UX for "empty search after submit" vs "initial state".
                  For now, let's assume geocodingError handles "No results found."
                  If searchQuery is present but results are empty and no error, it means ZERO_RESULTS was handled by geocodingError.
                  So, this specific condition might not be hit if "No results" is always an error message.
                  Let's remove this or make it more specific to "type to search".
              */}
            </div>
          )}
        </div>

        <main className="p-5 pt-0"> {/* Adjusted padding top to 0 as results section above has padding */}
          <section className="mb-6">
            <div className="grid grid-cols-4 gap-3">
              {cardButtons.map((button) => (
                <button
                  key={button.title}
                  onClick={button.onPress}
                  className={`flex aspect-square flex-col items-center justify-center rounded-lg bg-white p-2 shadow transition-shadow hover:shadow-lg dark:bg-slate-800 dark:hover:shadow-slate-700/50`}
                >
                  <span className={`text-3xl ${button.color}`}>{button.icon}</span>
                  <span className="mt-1 text-center text-xs font-medium text-gray-700 dark:text-gray-300">{button.title}</span>
                </button>
              ))}
            </div>
          </section>

          {homeSectionsConfig.map((sectionConfig) => {
            const sectionState = sectionsData[sectionConfig.id] || { data: [], isLoading: true, error: null };
            const cardDataForScroll = sectionState.isLoading || sectionState.error || sectionState.data.length === 0
              ? sectionConfig.fallbackImageSet
              : sectionState.data;
            const imagesForScroll = cardDataForScroll.map((place) => {
              if (place.photo_urls && place.photo_urls.length > 0) return place.photo_urls[0];
              if ((place as any).image) return (place as any).image;
              return "/assets/images/default-placeholder.png";
            });
            const finalCardData = cardDataForScroll.map((item, idx) => ({
                ...item,
                place_id: item.place_id || (item as any).id || `fallback-${sectionConfig.id}-${idx}`,
                name: item.name || (item as any).title || "Unknown Place",
            }));

            return (
              <HorizontalScrollBar
                key={sectionConfig.id}
                title={t(sectionConfig.titleKey)}
                cardData={finalCardData}
                images={imagesForScroll}
                scrollButton={{ route: sectionConfig.scrollButtonKey, loading: sectionState.isLoading }}
                handleNavigation={handleNavigation}
              />
            );
          })}

          <section className="my-6 rounded-lg bg-white p-4 shadow dark:bg-slate-800">
            <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">Plan Your Stay</h2>
            <button
              onClick={() => handleExternalLink("https://www.booking.com")}
              className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white shadow transition-colors hover:bg-blue-600"
            >
              Search on Booking.com <Briefcase size={18} className="ml-2" />
            </button>
          </section>
        </main>
        <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} GoTogether. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
