"use server";

import { getNearbyPlacesAction } from "../../actions";
import { LocationDetail } from "../../../../types/location-types";

interface GetTopPicksResult {
  success: boolean;
  data?: LocationDetail[];
  error?: string;
}

export async function getTopPicksPlacesAction(
  location: string,
): Promise<GetTopPicksResult> {
  const topPicksQueryTypes = [
    "tourist_attraction",
    "landmark",
    "park",
    "point_of_interest",
    "place_of_worship", // Common top pick type
  ];
  const radius = 15000; // 15km radius

  console.log(
    `getTopPicksPlacesAction: Fetching for location: ${location}, radius: ${radius}`,
  );

  const result = await getNearbyPlacesAction(
    location,
    topPicksQueryTypes,
    radius,
  );

  if (result.success && result.data) {
    console.log(
      `getTopPicksPlacesAction: Successfully fetched ${result.data.length} top picks.`,
    );
  } else if (!result.success) {
    console.error(
      `getTopPicksPlacesAction: Error fetching top picks: ${result.error}`,
    );
  }

  return result;
}
