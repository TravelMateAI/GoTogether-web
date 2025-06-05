export interface LocationDetail {
  name: string;
  vicinity: string; // Corresponds to Address in Go struct with json:"vicinity"
  rating?: number;
  user_ratings_total?: number;
  place_id: string;
  types?: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: { // Entire object is optional
    open_now?: boolean; // Field within is also optional
  };
  photos?: Array<{ // Array of photo objects is optional - original Google photo references
    photo_reference: string;
    height: number;
    width: number;
    html_attributions?: string[];
  }>;
  photo_urls?: string[]; // Field for directly usable photo URLs from the Go backend
  // Additional fields based on common Google Places API responses that might be in your Go struct:
  // icon?: string; // URL to an icon
  // icon_background_color?: string;
  // icon_mask_base_uri?: string;
  business_status?: string; // e.g., "OPERATIONAL" - Added this as it's common
  // permanently_closed?: boolean;
  // price_level?: number;
}

export interface PlaceDetails {
  name: string;
  formatted_address: string;
  place_id: string;
  types?: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{ // Original Google photo references
    photo_reference: string;
    height: number;
    width: number;
    html_attributions?: string[];
  }>;
  photo_urls?: string[]; // Fully constructed photo URLs
  reviews?: Array<{
    author_name: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
    author_url?: string;
    profile_photo_url?: string;
    language?: string;
  }>;
  website?: string;
  international_phone_number?: string;
  formatted_phone_number?: string;
  opening_hours?: {
    open_now?: boolean;
    periods?: Array<{
      open: { day: number; time: string; date?: string; };
      close?: { day: number; time: string; date?: string; };
    }>;
    weekday_text?: string[];
    permanently_closed?: boolean;
  };
  vicinity?: string;
  utc_offset_minutes?: number; // Renamed from utc_offset for consistency if it was different
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  business_status?: string; // Common field from Google
  // Other common fields from Google Places Details API that might be relevant:
  // adr_address?: string;
  // curbside_pickup?: boolean;
  // delivery?: boolean;
  // dine_in?: boolean;
  // editorial_summary?: { overview?: string; language?: string; };
  // price_level?: number;
  // reservable?: boolean;
  // serves_beer?: boolean;
  // serves_breakfast?: boolean;
  // serves_brunch?: boolean;
  // serves_dinner?: boolean;
  // serves_lunch?: boolean;
  // serves_vegetarian_food?: boolean;
  // serves_wine?: boolean;
  // url?: string; // Google Maps URL
  // website?: string; // Already included
}

export interface PlaceDetailsResponse {
  result: PlaceDetails;
  status: string;
  error_message?: string;
  html_attributions?: any[]; // As per Google's API, often empty but can be present
}


// It's also good practice to define nested types if they are complex or reused,
// though for this structure, inline is also acceptable.
// Example of separate nested types:
/*
export interface Geometry {
  location: Location;
  // viewport?: Viewport; // If you have viewport details
}

export interface Location {
  lat: number;
  lng: number;
}

export interface OpeningHours {
  open_now?: boolean;
  // periods?: Period[];
  // weekday_text?: string[];
}

export interface Photo {
  photo_reference: string;
  height: number;
  width: number;
  html_attributions?: string[];
}

// LocationDetail could then use these:
// geometry: Geometry;
// opening_hours?: OpeningHours;
// photos?: Photo[];
*/
