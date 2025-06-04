"use server";

import { goKyInstance } from "@/lib/ky"; // Assuming '@/' alias is configured for 'src/'
import { LocationDetail } from "@/types/location-types"; // Assuming '@/' alias

// Interface for the action's return value
interface GetNearbyPlacesResult {
  success: boolean;
  data?: LocationDetail[];
  error?: string;
  // nextPageToken?: string; // TODO: Add if pagination is supported and needed
}

export async function getNearbyPlacesAction(
  location: string,      // e.g., "latitude,longitude"
  queryTypes: string[],  // e.g., ["restaurant"], ["cinema", "nightclub"]
  radius: number,        // e.g., 5000 (meters)
  // pageToken?: string, // TODO: Consider adding pageToken for pagination in future iterations
): Promise<GetNearbyPlacesResult> {
  try {
    // TODO: Determine how to best use multiple queryTypes if the Go backend's /maps/places endpoint supports it.
    // For this initial version, we'll use the first queryType if available, or a default.
    // The Go backend might need to be designed to handle a comma-separated list or make multiple internal Google API calls.
    const query = queryTypes.length > 0 ? queryTypes[0] : "point_of_interest";

    // TODO: Confirm if 'radius' is a supported and necessary query parameter for your Go backend's /maps/places endpoint.
    // The API documentation sample only showed 'query' and 'location'. Assuming it's needed for now based on common patterns.
    const searchParams: Record<string, string | number> = {
      location,
      query,
      radius,
    };
    // if (pageToken) {
    //   searchParams.pagetoken = pageToken; // Ensure query param name matches Google API if passing through
    // }

    // Assuming the Go backend's /maps/places endpoint directly returns a structure
    // that can be typed as LocationDetail[] or an object containing it (e.g., { results: LocationDetail[], nextPageToken?: string })
    // For now, let's assume it returns LocationDetail[] directly for simplicity.
    // If it returns an object like { results: LocationDetail[], nextPageToken: "..." }, update .json<TYPE>() accordingly.
    const responseData = await goKyInstance.get("maps/places", {
      searchParams: searchParams,
      // Does your Go backend handle the Google Maps API key, or does it need to be passed from the client/action?
      // Assuming the Go backend securely manages the API key.
    }).json<LocationDetail[]>(); // Or .json<{ results: LocationDetail[], nextPageToken?: string }>();

    // If your API returns { results: LocationDetail[], nextPageToken: "..." }
    // const data = responseData.results;
    // const nextPageToken = responseData.nextPageToken;
    // return { success: true, data, nextPageToken };

    return { success: true, data: responseData };

  } catch (error: any) {
    console.error("Error in getNearbyPlacesAction:", error);
    // Ky errors often have a `response` object with more details
    if (error.response) {
      const errorBody = await error.response.text();
      console.error("Error response body:", errorBody);
      return { success: false, error: `API error: ${error.message} - ${errorBody}` };
    }
    return { success: false, error: error.message || "Failed to fetch nearby places." };
  }
}
