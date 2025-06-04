"use server";

import { getNearbyPlacesAction } from "../../../actions"; // Relative path to src/app/(main)/actions.ts
import { LocationDetail } from "../../../../../types/location-types"; // Relative path to src/types/location-types.ts

interface GetFoodPlacesResult {
  success: boolean;
  data?: LocationDetail[];
  error?: string;
}

export async function getFoodPlacesAction(location: string): Promise<GetFoodPlacesResult> {
  const foodQueryTypes = [
    "restaurant",
    "cafe",
    "bakery",
    "meal_delivery",
    "meal_takeaway"
  ];
  const radius = 10000; // 10km radius

  console.log(`getFoodPlacesAction: Fetching for location: ${location}, radius: ${radius}`);

  const result = await getNearbyPlacesAction(
    location,
    foodQueryTypes,
    radius
  );

  if (result.success && result.data) {
    console.log(`getFoodPlacesAction: Successfully fetched ${result.data.length} food places.`);
  } else if (!result.success) {
    console.error(`getFoodPlacesAction: Error fetching food places: ${result.error}`);
  }

  return result;
}
