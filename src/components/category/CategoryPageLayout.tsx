"use client";

    import React, { useEffect, useState, startTransition } from "react";
    // Link component is not used in the provided snippet, can be removed if not used elsewhere in actual file
    // import Link from "next/link";
    import { getNearbyPlacesAction, getAiSummaryAction } from "@/app/(main)/actions"; // Added getAiSummaryAction
    import type { LocationDetail } from "@/types/location-types";
    import PlaceCard from "@/components/home/PlaceCard";
    import { AlertCircle, Loader2, Lightbulb, SearchX } from "lucide-react"; // Added Lightbulb, SearchX

    const DEFAULT_IMAGE_URL = "/assets/images/default-placeholder.png";

    interface CategoryPageLayoutProps {
      title: string;
      description: string;
      queryTypes: string[];
      radius: number;
      fallbackLocation?: string;
    }

    export default function CategoryPageLayout({
      title,
      description,
      queryTypes,
      radius,
      fallbackLocation = "40.7128,-74.0060",
    }: CategoryPageLayoutProps) {
      const [places, setPlaces] = useState<LocationDetail[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [currentLocation, setCurrentLocation] = useState<string>(fallbackLocation);

      // State for AI Summary
      const [aiSummary, setAiSummary] = useState<string | null>(null);
      const [isLoadingAiSummary, setIsLoadingAiSummary] = useState(false);
      const [aiSummaryError, setAiSummaryError] = useState<string | null>(null);

      useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCurrentLocation(`${position.coords.latitude},${position.coords.longitude}`);
            },
            (err) => {
              console.warn(`Error getting geolocation: ${err.message}. Using fallback location.`);
            }
          );
        } else {
          console.warn("Geolocation not supported. Using fallback location.");
        }
      }, [fallbackLocation]);

      useEffect(() => {
        if (!currentLocation) return;

        const fetchPlaces = async () => {
          setLoading(true);
          setError(null);
          startTransition(async () => {
            const result = await getNearbyPlacesAction(currentLocation, queryTypes, radius);
            if (result.success && result.data) {
              setPlaces(result.data);
            } else {
              setError(result.error || `Failed to fetch ${title.toLowerCase()}.`);
              setPlaces([]);
            }
            setLoading(false);
          });
        };

        fetchPlaces();
      }, [currentLocation, queryTypes, radius, title]);

      // useEffect for AI Summary
      useEffect(() => {
        if (!title) return;

        const fetchAiSummary = async () => {
          setIsLoadingAiSummary(true);
          setAiSummaryError(null);
          const prompt = `Provide a very short, engaging, one-sentence tip or fun fact for someone looking to explore ${title.toLowerCase()} in a new area.`;

          // startTransition is already imported and can be used here
          startTransition(async () => {
              const result = await getAiSummaryAction(prompt);
              if (result.success && result.summaryText) {
              setAiSummary(result.summaryText);
              } else {
              setAiSummaryError(result.error || "Could not load AI tip.");
              }
              setIsLoadingAiSummary(false);
          });
        };

        fetchAiSummary();
      }, [title]); // Dependency array includes title

      return (
        <div className="min-h-screen flex-1 bg-gray-100 p-4 dark:bg-slate-900 sm:p-6">
          <header className="mb-6 sm:mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              {title}
            </h1>
            <p className="text-md mt-1 text-gray-600 dark:text-gray-400 sm:text-lg">
              {description}
            </p>
          </header>

          {/* AI Summary Display Section */}
          {isLoadingAiSummary && <p className="text-sm text-gray-500 dark:text-gray-400 my-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow">Fetching AI tip...</p>}
          {aiSummaryError && <p className="text-sm text-red-500 dark:text-red-400 my-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg shadow">AI Tip Error: {aiSummaryError}</p>}
          {aiSummary && !aiSummaryError && (
            <div className="my-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm dark:bg-indigo-900/30 dark:border-indigo-700 flex items-center">
              <Lightbulb size={20} className="flex-shrink-0 mr-3 text-indigo-600 dark:text-indigo-400" />
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                <span className="font-semibold">AI Tip:</span> {aiSummary}
              </p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="ml-3 text-lg text-gray-700 dark:text-gray-300">
                Loading {title.toLowerCase()}...
              </p>
            </div>
          )}

          {error && (
            <div
              className="relative flex items-center rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300"
              role="alert"
            >
              <AlertCircle className="mr-2 h-5 w-5" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!loading && !error && places.length === 0 && (
            <div className="py-10 text-center flex flex-col items-center justify-center">
              <SearchX size={48} className="mb-3 text-gray-400 dark:text-gray-500" />
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No {title.toLowerCase()} found for the current location. Try exploring a different area.
              </p>
            </div>
          )}

          {!loading && !error && places.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
              {places.map((place) => {
                // Determine the image path for the place card
                let imagePath = DEFAULT_IMAGE_URL;
                if (place.photo_urls && place.photo_urls.length > 0) {
                  let originalUrl = place.photo_urls[0];
                  // Check if it's a Google Maps photo URL and if it contains maxwidth=400
                  if (typeof originalUrl === 'string' && originalUrl.includes("maps.googleapis.com/maps/api/place/photo") && originalUrl.includes("maxwidth=400")) {
                    // Frontend mitigation: Request a larger image from Google Maps to better match display needs (e.g., 640px width for Next/Image).
                    // This aims to prevent Next/Image from upscaling a 400px image, which can affect quality.
                    // TODO: The ideal long-term solution is for the backend service to provide image URLs
                    // with appropriate maxwidth parameters (e.g., maxwidth=640) directly.
                    imagePath = originalUrl.replace("maxwidth=400", "maxwidth=640");
                  } else {
                    imagePath = originalUrl;
                  }
                }
                return (
                  <PlaceCard
                    key={place.place_id}
                    item={place}
                    imagePath={imagePath}
                  />
                );
              })}
            </div>
          )}
        </div>
      );
    }
