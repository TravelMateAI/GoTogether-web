"use client";

import React, { useEffect, useState, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFoodPlacesAction } from "./actions";
import type { LocationDetail } from "../../../../../types/location-types";
import { AlertCircle, Loader2, MapPin, Star } from "lucide-react";

const FALLBACK_LOCATION = "40.7128,-74.0060"; // New York City
const DEFAULT_IMAGE_URL = "/assets/images/default-placeholder.png";

export default function FoodPage() {
  const [places, setPlaces] = useState<LocationDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoodData = async () => {
      setLoading(true);
      setError(null);

      // TODO: Integrate user's actual location or allow location input.
      const locationToUse = FALLBACK_LOCATION;

      startTransition(async () => {
        const result = await getFoodPlacesAction(locationToUse);
        if (result.success && result.data) {
          setPlaces(result.data);
        } else {
          setError(result.error || "Failed to fetch food spots.");
          setPlaces([]);
        }
        setLoading(false);
      });
    };

    fetchFoodData();
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-100 dark:bg-slate-900 min-h-screen">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Delicious Food Spots
        </h1>
        <p className="text-md sm:text-lg text-gray-600 dark:text-gray-400 mt-1">
          Explore restaurants, cafes, bakeries, and more.
        </p>
      </header>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading food spots...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative flex items-center" role="alert">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && !error && places.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10 text-lg">
          No food spots found for the current location.
        </p>
      )}

      {!loading && !error && places.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {places.map((place) => (
            <Link href={`/place/${place.place_id}`} key={place.place_id} legacyBehavior>
              <a className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out block group">
                <div className="relative w-full h-48 sm:h-56">
                  <Image
                    src={(place.photo_urls && place.photo_urls.length > 0) ? place.photo_urls[0] : DEFAULT_IMAGE_URL}
                    alt={place.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE_URL; }}
                  />
                  {place.opening_hours?.open_now !== undefined && (
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      place.opening_hours.open_now
                        ? "bg-green-500/90 text-white"
                        : "bg-red-500/90 text-white"
                    }`}>
                      {place.opening_hours.open_now ? "Open" : "Closed"}
                    </span>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {place.name}
                  </h3>
                  {place.vicinity && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center mb-1">
                      <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                      <span className="truncate">{place.vicinity}</span>
                    </p>
                  )}
                  <div className="flex items-center mt-2">
                    {place.rating !== undefined && (
                       <>
                         <Star size={16} className="text-yellow-400 dark:text-yellow-500 mr-1" fill="currentColor" />
                         <span className="text-sm text-gray-700 dark:text-gray-300 mr-1">{place.rating.toFixed(1)}</span>
                       </>
                    )}
                    {place.user_ratings_total !== undefined && (
                       <span className="text-xs text-gray-500 dark:text-gray-400">
                         ({place.user_ratings_total} ratings)
                       </span>
                    )}
                  </div>
                   {place.types && place.types.length > 0 && (
                    <div className="mt-3 space-x-2">
                      {place.types.slice(0, 2).map(type => ( // Show max 2 types
                        <span key={type} className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full">
                          {type.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```
