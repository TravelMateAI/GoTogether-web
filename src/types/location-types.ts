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
  photos?: Array<{ // Array of photo objects is optional
    photo_reference: string;
    height: number;
    width: number;
    // html_attributions?: string[]; // Assuming this might be part of photos based on Google API
  }>;
  photo_urls?: string[]; // Field for directly usable photo URLs from the Go backend
  // Additional fields based on common Google Places API responses that might be in your Go struct:
  // icon?: string; // URL to an icon
  // icon_background_color?: string;
  // icon_mask_base_uri?: string;
  // business_status?: string; // e.g., "OPERATIONAL"
  // permanently_closed?: boolean;
  // price_level?: number;
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

export interface LocationDetail {
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  place_id: string;
  types?: string[];
  geometry: Geometry;
  opening_hours?: OpeningHours;
  photos?: Photo[];
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  business_status?: string;
  permanently_closed?: boolean;
  price_level?: number;
}
*/
