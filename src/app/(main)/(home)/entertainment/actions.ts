"use server";

import { getNearbyPlacesAction } from "../../../actions"; // Relative path to src/app/(main)/actions.ts
import { LocationDetail } from "../../../../../types/location-types"; // Relative path to src/types/location-types.ts

interface GetEntertainmentPlacesResult {
  success: boolean;
  data?: LocationDetail[];
  error?: string;
}

export async function getEntertainmentPlacesAction(location: string): Promise<GetEntertainmentPlacesResult> {
  const entertainmentQueryTypes = [
    "movie_theater",
    "night_club",
    "bar",
    "casino",
    "bowling_alley",
    "amusement_park" // Common entertainment type
  ];
  const radius = 15000; // 15km radius

  console.log(`getEntertainmentPlacesAction: Fetching for location: ${location}, radius: ${radius}`);

  const result = await getNearbyPlacesAction(
    location,
    entertainmentQueryTypes,
    radius
  );

  if (result.success && result.data) {
    console.log(`getEntertainmentPlacesAction: Successfully fetched ${result.data.length} entertainment places.`);
  } else if (!result.success) {
    console.error(`getEntertainmentPlacesAction: Error fetching entertainment places: ${result.error}`);
  }

  return result;
}
