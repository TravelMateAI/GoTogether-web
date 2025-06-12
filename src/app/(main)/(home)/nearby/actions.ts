"use server";

import { getNearbyPlacesAction } from "../../actions";
import { LocationDetail } from "../../../../types/location-types";

interface GetNearbyGeneralPlacesResult {
  success: boolean;
  data?: LocationDetail[];
  error?: string;
}

export async function getNearbyGeneralPlacesAction(
  location: string,
): Promise<GetNearbyGeneralPlacesResult> {
  const nearbyQueryTypes = ["point_of_interest", "tourist_attraction", "park"];
  const radius = 5000; // 5km radius for general nearby spots

  console.log(
    `getNearbyGeneralPlacesAction: Fetching for location: ${location}, radius: ${radius}`,
  );

  const result = await getNearbyPlacesAction(
    location,
    nearbyQueryTypes,
    radius,
  );

  if (result.success && result.data) {
    console.log(
      `getNearbyGeneralPlacesAction: Successfully fetched ${result.data.length} nearby places.`,
    );
  } else if (!result.success) {
    console.error(
      `getNearbyGeneralPlacesAction: Error fetching nearby places: ${result.error}`,
    );
  }

  return result;
}
