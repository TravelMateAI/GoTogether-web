"use server";

import { goKyInstance } from "../../../src/lib/ky"; // Corrected relative path
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

// Potentially define this in src/types/location-types.ts if used elsewhere
export interface GeocodeLocation {
  lat: number;
  lng: number;
}

export interface GeocodeGeometry {
  location: GeocodeLocation;
  // ... other geometry details from Google API might be present
}

export interface GeocodeResult {
  formatted_address: string;
  geometry: GeocodeGeometry;
  place_id: string; // Google Place ID
  // ... other address components and details from Google API might be present
}

interface GoogleGeocodeResponse {
  results: GeocodeResult[];
  status: string; // e.g., "OK", "ZERO_RESULTS", "REQUEST_DENIED", "INVALID_REQUEST"
  error_message?: string; // Included by Google on some errors
}

interface GeocodeAddressActionResult {
  success: boolean;
  data?: GeocodeResult[];
  error?: string;
  status?: string; // To pass along Google's status
}

export async function geocodeAddressAction(
  address: string,
): Promise<GeocodeAddressActionResult> {
  if (!address || address.trim() === "") {
    return { success: false, error: "Address is required.", status: "INVALID_REQUEST_CLIENT" };
  }

  try {
    const response = await goKyInstance
      .get("maps/geocode", {
        searchParams: { address },
      })
      .json<GoogleGeocodeResponse>();

    if (response.status === "OK" || response.status === "ZERO_RESULTS") {
      return { success: true, data: response.results, status: response.status };
    } else {
      // Handles "REQUEST_DENIED", "INVALID_REQUEST", etc.
      console.error(
        `Geocoding API returned non-OK status for address "${address}": ${response.status} - ${response.error_message || ""}`,
      );
      return {
        success: false,
        error: response.error_message || `Geocoding API Error: ${response.status}`,
        status: response.status,
      };
    }
  } catch (error: any) {
    console.error(`Error geocoding address "${address}":`, error);
    let errorMessage = "Failed to geocode address.";
    let errorStatus = "UNKNOWN_ERROR_CLIENT";

    if (error.name === 'HTTPError') { // Ky specific HTTP error
      try {
        // Our Go service for /maps/geocode returns 500 for its own errors,
        // or Google's error message in a 200 OK with non-OK status (handled above).
        // So, an HTTPError here likely means our service itself had an issue (e.g., 500).
        const errorResponse = await error.response.json();
        errorMessage = errorResponse.error || error.message; // Go service wraps its errors in {"error": "message"}
        errorStatus = `HTTP_${error.response.status}`;
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

// Assuming Gemini API response structure (simplified)
// Based on API docs: candidates[0].content.parts[0].text
interface GeminiContentPart {
  text: string;
}
interface GeminiContent {
  parts: GeminiContentPart[];
  role: string;
}
interface GeminiCandidate {
  content: GeminiContent;
  finish_reason?: string;
  // ... other fields like safety_ratings, citation_metadata
}
interface GoogleGeminiResponse {
  candidates?: GeminiCandidate[];
  prompt_feedback?: any; // Structure for prompt feedback
  error?: { message: string }; // For direct errors from Gemini service if not 200 OK
}

interface GetAiSummaryActionResult {
  success: boolean;
  summaryText?: string;
  error?: string;
}

export async function getAiSummaryAction(
  prompt: string,
): Promise<GetAiSummaryActionResult> {
  if (!prompt || prompt.trim() === "") {
    return { success: false, error: "Prompt is required." };
  }

  try {
    // Endpoint: /gemini/?prompt=...
    const response = await goKyInstance
      .get("gemini/", {
        searchParams: { prompt },
        // Assuming GOOGLE_GEMINI_API_KEY is set in the Go service's environment
      })
      .json<GoogleGeminiResponse>(); // Expecting our Go service to return 200 OK with this body

    if (response.candidates && response.candidates.length > 0 &&
        response.candidates[0].content && response.candidates[0].content.parts.length > 0 &&
        response.candidates[0].content.parts[0].text) {
      return { success: true, summaryText: response.candidates[0].content.parts[0].text };
    } else if (response.error) { // If Gemini itself returned an error object within the JSON
      console.error(`Gemini API returned an error for prompt "${prompt}": ${response.error.message}`);
      return { success: false, error: `Gemini API Error: ${response.error.message}` };
    } else {
      // Handle cases where the response structure is not as expected
      // or if prompt_feedback indicates an issue (e.g., blocked prompt)
      // For simplicity, checking for candidates[0].content.parts[0].text covers the happy path.
      let detailedError = "Failed to get valid summary from AI: No content found.";
      if (response.prompt_feedback) {
        // Potentially inspect response.prompt_feedback.block_reason or safety_ratings
        console.warn(`Gemini API prompt feedback for prompt "${prompt}":`, response.prompt_feedback);
        detailedError = "AI response might be blocked or incomplete due to prompt content.";
      }
      return { success: false, error: detailedError };
    }
  } catch (error: any) {
    console.error(`Error getting AI summary for prompt "${prompt}":`, error);
    let errorMessage = "Failed to get AI summary.";
    if (error.name === 'HTTPError') { // Ky specific HTTP error from our Go service
      try {
        const errorResponse = await error.response.json(); // Go service returns {"error": "message"}
        errorMessage = errorResponse.error || `AI Service Error: ${error.response.status}`;
      } catch (e) {
        errorMessage = `AI Service Error: ${error.response.status} - ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

// Basic structure for Directions API response (can be expanded later)
// Based on: https://developers.google.com/maps/documentation/directions/overview#DirectionsResponses
export interface DirectionsRouteLegStep {
  html_instructions: string;
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  // polyline: { points: string }; // Can add if needed
}

export interface DirectionsRouteLeg {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  start_address: string;
  end_address: string;
  steps: DirectionsRouteLegStep[];
}

export interface DirectionsRoute {
  summary: string;
  legs: DirectionsRouteLeg[];
  overview_polyline?: { points: string }; // Optional, but useful for drawing on map
  // warnings: string[]; // Can add if needed
  // bounds: any; // Can add if needed
}

export interface GoogleDirectionsResponse {
  routes: DirectionsRoute[];
  status: string; // e.g., "OK", "NOT_FOUND", "ZERO_RESULTS", "REQUEST_DENIED"
  geocoded_waypoints?: any[]; // Status for origin/destination geocoding
  error_message?: string; // Included by Google on some errors
}

interface GetDirectionsActionResult {
  success: boolean;
  data?: GoogleDirectionsResponse; // Or just DirectionsRoute[] if preferred
  error?: string;
  status?: string; // To pass along Google's status
}

export async function getDirectionsAction(
  origin: string,
  destination: string,
): Promise<GetDirectionsActionResult> {
  if (!origin || origin.trim() === "") {
    return { success: false, error: "Origin is required.", status: "INVALID_REQUEST_CLIENT" };
  }
  if (!destination || destination.trim() === "") {
    return { success: false, error: "Destination is required.", status: "INVALID_REQUEST_CLIENT" };
  }

  try {
    const response = await goKyInstance
      .get("maps/directions", {
        searchParams: { origin, destination },
      })
      .json<GoogleDirectionsResponse>();

    if (response.status === "OK" || response.status === "ZERO_RESULTS") {
      // ZERO_RESULTS is a valid response, means no route found but API call was fine
      return { success: true, data: response, status: response.status };
    } else {
      // Handles "NOT_FOUND", "REQUEST_DENIED", etc.
      console.error(
        `Directions API returned non-OK status for origin "${origin}" to dest "${destination}": ${response.status} - ${response.error_message || ""}`,
      );
      return {
        success: false,
        error: response.error_message || `Directions API Error: ${response.status}`,
        status: response.status,
      };
    }
  } catch (error: any) {
    console.error(`Error getting directions for origin "${origin}" to dest "${destination}":`, error);
    let errorMessage = "Failed to get directions.";
    let errorStatus = "UNKNOWN_ERROR_CLIENT";

    if (error.name === 'HTTPError') { // Ky specific HTTP error
      try {
        const errorResponse = await error.response.json();
        errorMessage = errorResponse.error || error.message; // Go service wraps its errors in {"error": "message"}
        errorStatus = `HTTP_${error.response.status}`;
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
