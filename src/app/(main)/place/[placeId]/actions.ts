"use server";

import { goKyInstance } from "../../../../../lib/ky"; // Relative path to root lib/ky.ts
import { PlaceDetails } from "../../../../../../types/location-types"; // Relative path to root types/location-types.ts

interface GoPlaceDetailApiResponse {
  result: PlaceDetails;
  status: string;
  html_attributions?: any[]; // Or specific type if known
  error_message?: string;
}

interface GetPlaceDetailsResult {
  success: boolean;
  data?: PlaceDetails;
  error?: string;
}

export async function getPlaceDetailsByIdAction(placeId: string): Promise<GetPlaceDetailsResult> {
  if (!placeId) {
    return { success: false, error: "Place ID is required." };
  }

  console.log(`getPlaceDetailsByIdAction: Fetching details for placeId: ${placeId}`);

  try {
    const apiResponse = await goKyInstance.get(`maps/place/${placeId}`).json<GoPlaceDetailApiResponse>();

    if (apiResponse.status === "OK" && apiResponse.result) {
      console.log(`getPlaceDetailsByIdAction: Successfully fetched details for ${apiResponse.result.name}`);
      return { success: true, data: apiResponse.result };
    } else {
      console.error(`getPlaceDetailsByIdAction: API error for placeId ${placeId}. Status: ${apiResponse.status}, Message: ${apiResponse.error_message}`);
      return { success: false, error: apiResponse.error_message || `API Error: ${apiResponse.status}` };
    }
  } catch (error: any) {
    console.error(`getPlaceDetailsByIdAction: Exception for placeId ${placeId}:`, error);
    let errorMessage = "Failed to fetch place details.";
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
