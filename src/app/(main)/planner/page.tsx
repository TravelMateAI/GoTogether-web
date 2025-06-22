"use client";

import React, { useRef, useState } from "react";
import { getPathFindingResult, searchNearbyPlaces } from "./action";
import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

const defaultCenter = { lat: 6.9271, lng: 79.8612 }; // Default to Colombo

export default function PlannerPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeData, setRouteData] = useState<any>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [planning, setPlanning] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handlePlan = async () => {
    setPlanning(true);
    try {
      const routeResponse = await getPathFindingResult(origin, destination);
      setRouteData(routeResponse);

      const placeSearchResponse = await searchNearbyPlaces("demo-user", destination);
      setPlaces(placeSearchResponse.results);

      // Fit bounds
      setTimeout(() => {
        if (mapRef.current && routeResponse.routes?.[0]?.overviewPolyline?.points) {
          const bounds = new window.google.maps.LatLngBounds();
          decodePolyline(routeResponse.routes[0].overviewPolyline.points).forEach((point) => {
            bounds.extend(point);
          });
          mapRef.current.fitBounds(bounds);
        }
      }, 500);
    } catch (error) {
      console.error("Trip planning failed", error);
    }
  };

  const decodePolyline = (encoded: string) => {
    const points: google.maps.LatLngLiteral[] = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }

    return points;
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-slate-900 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-slate-100">Trip Planner</h1>
        <p className="text-lg text-gray-600 dark:text-slate-300">Plan your next adventure here!</p>
      </header>

      {!planning && (
        <section className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md space-y-4">
          <input
            type="text"
            placeholder="Enter origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
          />
          <input
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
          />
          <button
            onClick={handlePlan}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Plan Trip
          </button>
        </section>
      )}

      {planning && routeData && (
        <main className="mt-8 space-y-6">
          <section>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={10}
                onLoad={(map) => {
                  mapRef.current = map;
                }}

              >
                <Polyline
                  path={decodePolyline(routeData.routes[0].overviewPolyline.points)}
                  options={{ strokeColor: "#1E90FF", strokeOpacity: 0.8, strokeWeight: 5 }}
                />

                {places.map((place) => (
                  <Marker
                    key={place.placeId}
                    position={{ lat: place.geometryLocation.lat, lng: place.geometryLocation.lng }}
                    onClick={() => setSelectedPlaceId(place.placeId)}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </section>

          <section className="bg-white dark:bg-slate-800 p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-slate-200">Route Details</h2>
            <p className="text-gray-600 dark:text-slate-300">
              From <strong>{routeData.routes[0].legs[0].startAddress}</strong> to <strong>{routeData.routes[0].legs[0].endAddress}</strong>
            </p>
            <p className="text-gray-600 dark:text-slate-300">
              Distance: {routeData.routes[0].legs[0].distance.text} | Duration: {routeData.routes[0].legs[0].duration.text}
            </p>
          </section>

          <section className="bg-white dark:bg-slate-800 p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-slate-200">Nearby Places</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {places.map((place) => {
                const photoRef = place.photos?.[0]?.photoReference;
                console.log("Photo Reference:", photoRef);
                const photoUrl = photoRef
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
                  : null;
                const isSelected = selectedPlaceId === place.placeId;

                return (
                  <div
                    key={place.placeId}
                    className={`border p-4 rounded dark:border-slate-700 cursor-pointer transition ${
                      isSelected ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedPlaceId(place.placeId)}
                  >
                    {photoUrl && (
                      <img src={photoUrl} alt={place.name} className="w-full h-40 object-cover rounded mb-2" />
                    )}
                    <h3 className="font-semibold text-gray-800 dark:text-slate-100">{place.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-300">{place.vicinity}</p>
                    {place.rating && (
                      <p className="text-yellow-600 dark:text-yellow-400">⭐ {place.rating}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}

      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} GoTogether. All rights reserved.</p>
      </footer>
    </div>
  );
}
