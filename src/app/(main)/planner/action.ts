"use server";

import { planningKyInstance } from "../../../../src/lib/ky";

export async function getPathFindingResult(origin: string, destination: string) {
  try {
    console.log("Fetching path from", origin, "to", destination);
    const response = await planningKyInstance
      .post("pipeline/path", {
        json: { origin, destination },
      })
      .json<DirectionsResponseDTO>();

    return response;
  } catch (error) {
    console.error("❌ Error fetching path:", error);
    throw new Error("Failed to get directions");
  }
}

export async function searchNearbyPlaces(userId: string, location: string) {
  try {
    const response = await planningKyInstance
      .get("pipeline/search", {
        searchParams: { userId, location },
      })
      .json<SearchPlacesResponseDTO>();

    return response;
  } catch (error) {
    console.error("❌ Error searching places:", error);
    throw new Error("Failed to search places");
  }
}

// DTO types for typing (optional, or import from shared file if used)
export interface DirectionsResponseDTO {
  routes: {
    summary: string;
    legs: {
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      startAddress: string;
      endAddress: string;
      steps: {
        htmlInstructions: string;
        distance: { text: string; value: number };
        duration: { text: string; value: number };
        polyline: { points: string };
      }[];
    }[];
    overviewPolyline: { points: string };
  }[];
  geocodedWaypoints: {
    geocoderStatus: string;
    placeId: string;
    types: string[];
  }[];
  status: string;
}

export interface SearchPlacesResponseDTO {
  results: {
    placeId: string;
    name: string;
    vicinity: string;
    rating: number;
    userRatingsTotal: number;
    geometryLocation: { lat: number; lng: number };
    openingHours: { openNow: boolean };
    photos: { photoReference: string; height: number; width: number }[];
    photoUrls: string[];
    types: string[];
  }[];
  status: string;
}
