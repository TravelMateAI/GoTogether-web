"use server";

    import { goKyInstance } from "../../../../../src/lib/ky"; // Adjusted path to src/lib/ky
    import type { PlaceDetailsResponse, PlaceDetails } from "@/types/location-types"; // Verify path

    interface GetPlaceDetailsResult {
      success: boolean;
      data?: PlaceDetails; // This is the 'result' object from PlaceDetailsResponse
      error?: string;
      status?: string; // To pass along Google's status like "NOT_FOUND", "INVALID_REQUEST"
    }

    export async function getPlaceDetailsByIdAction(
      placeId: string,
    ): Promise<GetPlaceDetailsResult> {
      if (!placeId || placeId.trim() === "") {
        return { success: false, error: "Place ID is required.", status: "INVALID_REQUEST_CLIENT" };
      }

      try {
        // The API path is /maps/place/:place_id
        // goKyInstance will append this to its prefixUrl: http://localhost:8000
        // So the final URL will be http://localhost:8000/maps/place/{placeId}
        const response = await goKyInstance.get(`maps/place/${placeId}`).json<PlaceDetailsResponse>();

        // According to the API documentation for /maps/place/:place_id:
        // - Success (200 OK) contains the PlaceDetailsResponse structure.
        // - The 'status' field within the response body indicates Google's processing status.
        // - Errors like 400, 403, 404, 429 are also possible from our backend,
        //   but ky throws HTTPError for non-2xx responses, which is caught below.
        //   If the backend wraps Google's error status (like NOT_FOUND) in a 200 OK response from *our* service,
        //   then we check response.status here.

        if (response.status === "OK") {
          return { success: true, data: response.result, status: response.status };
        } else {
          // Handles cases like "ZERO_RESULTS", "NOT_FOUND", "INVALID_REQUEST" etc.
          // returned by Google but wrapped in a 200 OK from our service.
          console.error(
            `API returned non-OK status for place ${placeId}: ${response.status} - ${response.error_message || ""}`,
          );
          return {
            success: false,
            error: response.error_message || `API Error: ${response.status}`,
            status: response.status,
          };
        }
      } catch (error: any) {
        console.error(`Error fetching details for place ${placeId}:`, error);
        let errorMessage = "Failed to fetch place details.";
        let errorStatus = "UNKNOWN_ERROR_CLIENT";

        if (error.name === 'HTTPError') { // Ky specific HTTP error
          try {
            const errorResponse = await error.response.json();
            // Assuming error response from our Go service might look like:
            // { "error": "message", "details": "...", "status": "GOOGLE_STATUS_CODE" }
            // or directly Google's PlaceDetailsResponse structure with a non-OK status.
            errorMessage = errorResponse.error_message || errorResponse.error || error.message;
            errorStatus = errorResponse.status || `HTTP_${error.response.status}`;
          } catch (e) {
            errorMessage = `API Error: ${error.response.status} - ${error.message}`;
            errorStatus = `HTTP_${error.response.status}`;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        return { success: false, error: errorMessage, status: errorStatus };
      }
    }
