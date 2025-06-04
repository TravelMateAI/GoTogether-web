"use server";

import { getNearbyPlacesAction } from "../../../actions";
import { LocationDetail } from "../../../../../types/location-types";

interface GetStayPlacesResult {
  success: boolean;
  data?: LocationDetail[];
  error?: string;
}

export async function getStayPlacesAction(location: string): Promise<GetStayPlacesResult> {
  const stayQueryTypes = [
    "lodging",
    "hotel",
    "motel",
    "resort",
    "campground",
    "apartment_hotel" // Common lodging type
  ];
  const radius = 20000; // 20km radius for accommodation options

  console.log(`getStayPlacesAction: Fetching for location: ${location}, radius: ${radius}`);

  const result = await getNearbyPlacesAction(
    location,
    stayQueryTypes,
    radius
  );

  if (result.success && result.data) {
    console.log(`getStayPlacesAction: Successfully fetched ${result.data.length} stay places.`);
  } else if (!result.success) {
    console.error(`getStayPlacesAction: Error fetching stay places: ${result.error}`);
  }

  return result;
}
