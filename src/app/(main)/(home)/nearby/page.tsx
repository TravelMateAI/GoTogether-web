"use client";

import React, { useEffect, useState, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { getNearbyGeneralPlacesAction } from "./actions";
import type { LocationDetail } from "../../../../types/location-types";
import { AlertCircle, Loader2, MapPin, Star } from "lucide-react";

const FALLBACK_LOCATION = "40.7128,-74.0060"; // New York City
const DEFAULT_IMAGE_URL = "/assets/images/default-placeholder.png";

export default function NearbyPage() {
  const [places, setPlaces] = useState<LocationDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNearbyData = async () => {
      setLoading(true);
      setError(null);

      // TODO: Integrate user's actual location or allow location input.
      const locationToUse = FALLBACK_LOCATION;

      startTransition(async () => {
        const result = await getNearbyGeneralPlacesAction(locationToUse);
        if (result.success && result.data) {
          setPlaces(result.data);
        } else {
          setError(result.error || "Failed to fetch nearby spots.");
          setPlaces([]);
        }
        setLoading(false);
      });
    };

    fetchNearbyData();
  }, []);

  return (
    <div className="min-h-screen flex-1 bg-gray-100 p-4 dark:bg-slate-900 sm:p-6">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
          Explore Nearby
        </h1>
        <p className="text-md mt-1 text-gray-600 dark:text-gray-400 sm:text-lg">
          Discover interesting points of interest, parks, and attractions around
          you.
        </p>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="ml-3 text-lg text-gray-700 dark:text-gray-300">
            Loading nearby spots...
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
        <p className="py-10 text-center text-lg text-gray-500 dark:text-gray-400">
          No nearby spots found for the current location.
        </p>
      )}

      {!loading && !error && places.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {places.map((place) => (
            <Link
              href={`/place/${place.place_id}`}
              key={place.place_id}
              legacyBehavior
            >
              <a className="group block overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl dark:bg-slate-800">
                <div className="relative h-48 w-full sm:h-56">
                  <Image
                    src={
                      place.photo_urls && place.photo_urls.length > 0
                        ? place.photo_urls[0]
                        : DEFAULT_IMAGE_URL
                    }
                    alt={place.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_IMAGE_URL;
                    }}
                  />
                  {place.opening_hours?.open_now !== undefined && (
                    <span
                      className={`absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-semibold ${
                        place.opening_hours.open_now
                          ? "bg-green-500/90 text-white"
                          : "bg-red-500/90 text-white"
                      }`}
                    >
                      {place.opening_hours.open_now ? "Open" : "Closed"}
                    </span>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="mb-1 truncate text-lg font-semibold text-gray-900 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400 sm:text-xl">
                    {place.name}
                  </h3>
                  {place.vicinity && (
                    <p className="mb-1 flex items-center text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                      <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                      <span className="truncate">{place.vicinity}</span>
                    </p>
                  )}
                  <div className="mt-2 flex items-center">
                    {place.rating !== undefined && (
                      <>
                        <Star
                          size={16}
                          className="mr-1 text-yellow-400 dark:text-yellow-500"
                          fill="currentColor"
                        />
                        <span className="mr-1 text-sm text-gray-700 dark:text-gray-300">
                          {place.rating.toFixed(1)}
                        </span>
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
                      {place.types.slice(0, 2).map(
                        (
                          type, // Show max 2 types
                        ) => (
                          <span
                            key={type}
                            className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:bg-slate-700 dark:text-gray-300"
                          >
                            {type.replace(/_/g, " ")}
                          </span>
                        ),
                      )}
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
