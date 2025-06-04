"use server";

import { getNearbyPlacesAction } from "../../../actions"; // Relative path to src/app/(main)/actions.ts
import { LocationDetail } from "../../../../../types/location-types"; // Relative path to src/types/location-types.ts

interface GetCulturePlacesResult {
  success: boolean;
  data?: LocationDetail[];
  error?: string;
}

export async function getCulturePlacesAction(location: string): Promise<GetCulturePlacesResult> {
  const cultureQueryTypes = [
    "museum",
    "art_gallery",
    "performing_arts_theater",
    "library",
    "historic_site", // Common in Google Places
    "tourist_attraction" // Broader category that often includes cultural sites
  ];
  const radius = 20000; // 20km radius for a decent area coverage

  // TODO: Consider if location should be made optional and default to a major city if not provided,
  // or if it's always expected to be passed from the client after geolocation.
  // For now, it's a required parameter.

  console.log(`getCulturePlacesAction: Fetching for location: ${location}, radius: ${radius}`);

  const result = await getNearbyPlacesAction(
    location,
    cultureQueryTypes,
    radius
  );

  if (result.success && result.data) {
    console.log(`getCulturePlacesAction: Successfully fetched ${result.data.length} culture places.`);
  } else if (!result.success) {
    console.error(`getCulturePlacesAction: Error fetching culture places: ${result.error}`);
  }

  return result;
}
