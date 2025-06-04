"use server";

import { goKyInstance } from "../../../lib/ky"; // Corrected relative path
import { LocationDetail } from "@/types/location-types"; // Assuming '@/' alias for types is correct, will be updated later if needed

// Interface for the Go backend's expected API response structure
interface GoPlacesApiResponse {
  results: LocationDetail[]; // This LocationDetail will be updated to GoLocationDetail in a subsequent step
  status: string;
  error_message?: string; // Optional field for more specific API errors
  // next_page_token?: string; // Optional for pagination
}

// Interface for the action's return value - remains the same
interface GetNearbyPlacesResult {
  success: boolean;
  data?: LocationDetail[]; // This LocationDetail will be updated to GoLocationDetail
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
    const apiResponse = await goKyInstance.get("maps/places", {
      searchParams: searchParams,
      // Does your Go backend handle the Google Maps API key, or does it need to be passed from the client/action?
      // Assuming the Go backend securely manages the API key.
    }).json<GoPlacesApiResponse>();

    // Check the status from the Go backend's response
    if (apiResponse.status === "OK" || apiResponse.status === "ZERO_RESULTS") {
      // Even if ZERO_RESULTS, the call was successful, data will be an empty array.
      return { success: true, data: apiResponse.results };
    } else {
      // Handle other statuses like "REQUEST_DENIED", "INVALID_REQUEST", "OVER_QUERY_LIMIT", "UNKNOWN_ERROR"
      console.error(`API returned error status: ${apiResponse.status} - ${apiResponse.error_message || ''}`);
      return { success: false, error: apiResponse.error_message || `API Error: ${apiResponse.status}` };
    }

  } catch (error: any) {
    console.error("Error in getNearbyPlacesAction:", error);
    let errorMessage = "Failed to fetch nearby places.";
    if (error.name === 'HTTPError') { // Ky specific HTTP error
        try {
            const errorResponse = await error.response.json();
            errorMessage = `API Error: ${errorResponse.status || error.response.status} - ${errorResponse.error_message || errorResponse.error || error.message}`;
        } catch (e) {
            errorMessage = `API Error: ${error.response.status} - ${error.message}`;
        }
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
