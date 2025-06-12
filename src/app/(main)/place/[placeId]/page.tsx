"use client"; // Make it a client component

import React, { useEffect, useState, startTransition } from "react";
import Link from "next/link";
import {
  MapPin,
  Globe,
  Phone as PhoneIcon,
  Star,
  Clock,
  Info,
  MessageSquare,
  ExternalLink,
  AlertTriangle,
  Navigation, // For directions link
  Loader2,    // For loading states
  MapPinned,  // Icon for Get Directions button
  ListTree,   // Icon for Related Places
} from "lucide-react";
import ClientImage from "@/components/shared/ClientImage";
import { getPlaceDetailsByIdAction } from "./actions"; // Kept local for place details
import { getDirectionsAction, GoogleDirectionsResponse, getNearbyPlacesAction } from "../../actions"; // Moved getNearbyPlacesAction here
import type { PlaceDetails } from "../../../../types/location-types"; // Path to existing type
import HorizontalScrollBar from "@/components/home/horizontal-scroll-bar"; // Import HorizontalScrollBar

// StarRating component remains the same
const StarRating = ({
  rating,
  totalRatings,
}: {
  rating?: number;
  totalRatings?: number;
}) => {
  if (rating === undefined) return null;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={20} className="fill-yellow-400 text-yellow-400" />
      ))}
      {halfStar && <Star key="half" size={20} className="fill-yellow-200 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={20} className="fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600" />
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {rating.toFixed(1)}
        {totalRatings !== undefined && ` (${totalRatings} ratings)`}
      </span>
    </div>
  );
};

interface PlaceDetailPageProps {
  params: { placeId: string };
}

export default function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { placeId } = params;

  // State for place details
  const [place, setPlace] = useState<PlaceDetails | null>(null);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [isLoadingPlace, setIsLoadingPlace] = useState(true);

  // State for directions
  const [directionsData, setDirectionsData] = useState<GoogleDirectionsResponse | null>(null);
  const [directionsError, setDirectionsError] = useState<string | null>(null);
  const [isLoadingDirections, setIsLoadingDirections] = useState(false);
  const [originForDirectionsLink, setOriginForDirectionsLink] = useState<string>("");

  // State for related places
  const [relatedPlaces, setRelatedPlaces] = useState<PlaceDetails[]>([]);
  const [isLoadingRelatedPlaces, setIsLoadingRelatedPlaces] = useState(true);
  const [relatedPlacesError, setRelatedPlacesError] = useState<string | null>(null);

  useEffect(() => {
    if (placeId) {
      startTransition(() => {
        setIsLoadingPlace(true);
        setPlaceError(null);
      });
      getPlaceDetailsByIdAction(placeId as string).then((result) => {
        startTransition(() => {
          if (result.success && result.data) {
            setPlace(result.data);
          } else {
            setPlaceError(result.error || "Could not load details for this place.");
          }
          setIsLoadingPlace(false);
        });
      });
    }
  }, [placeId]);

  // useEffect for Related Places
  useEffect(() => {
    if (place?.geometry?.location) {
      startTransition(() => {
        setIsLoadingRelatedPlaces(true);
        setRelatedPlacesError(null);
      });

      const locationStr = `${place.geometry.location.lat},${place.geometry.location.lng}`;
      // Use the first type of the current place as the primary type for related search
      const primaryType = place.types && place.types.length > 0 ? place.types[0] : "point_of_interest";
      const queryTypesArray = typeof primaryType === 'string' ? [primaryType] : ["point_of_interest"];
      const radius = 10000; // Increased radius for more related places

      getNearbyPlacesAction(locationStr, queryTypesArray, radius)
        .then(result => {
          startTransition(() => {
            if (result.success && result.data) {
              const filteredResults = result.data.filter(p => p.place_id !== place.place_id).slice(0, 10);
              setRelatedPlaces(filteredResults as PlaceDetails[]); // Cast if LocationDetail is returned by getNearbyPlacesAction
            } else {
              setRelatedPlacesError(result.error || "Could not load related places.");
            }
            setIsLoadingRelatedPlaces(false);
          });
        })
        .catch(err => {
          startTransition(() => {
            console.error("Error fetching related places:", err);
            setRelatedPlacesError("An unexpected error occurred while fetching related places.");
            setIsLoadingRelatedPlaces(false);
          });
        });
    }
  }, [place]); // Dependency: run when 'place' details are loaded/changed


  const handleGetDirections = async () => {
    if (!place || (!place.formatted_address && !place.name)) {
      startTransition(() => {
        setDirectionsError("Place details not available to get directions.");
      });
      return;
    }

    startTransition(() => {
      setIsLoadingDirections(true);
      setDirectionsError(null);
      setDirectionsData(null);
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const currentOrigin = `${position.coords.latitude},${position.coords.longitude}`;
        setOriginForDirectionsLink(currentOrigin); // Set for Google Maps link
        const destination = place.formatted_address || place.name || "";

        const result = await getDirectionsAction(currentOrigin, destination);
        startTransition(() => {
          if (result.success && result.data) {
            if (result.status === "ZERO_RESULTS") {
              setDirectionsError("No routes found for this origin and destination.");
              setDirectionsData(null);
            } else {
              setDirectionsData(result.data);
              setDirectionsError(null);
            }
          } else {
            setDirectionsError(result.error || "Failed to get directions.");
            setDirectionsData(null);
          }
          setIsLoadingDirections(false);
        });
      },
      (geoError) => {
        startTransition(() => {
          setDirectionsError(`Could not get your current location: ${geoError.message}.`);
          setIsLoadingDirections(false);
        });
      }
    );
  };

  if (isLoadingPlace) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center bg-gray-100 p-4 text-center dark:bg-slate-900">
        <Loader2 size={48} className="mb-4 animate-spin text-indigo-600" />
        <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">Loading Place Details...</h1>
      </div>
    );
  }

  if (placeError || !place) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center bg-gray-100 p-4 text-center dark:bg-slate-900">
        <AlertTriangle size={48} className="mb-4 text-red-500" />
        <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">Place Not Found</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {placeError || "Could not load details for this place. It might be an invalid ID or a network issue."}
        </p>
        <Link href="/" className="rounded-md bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700">
            Back to Home
        </Link>
      </div>
    );
  }

  const DEFAULT_IMAGE_URL = "/assets/images/default-placeholder.png";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {place.photo_urls && place.photo_urls.length > 0 ? (
        <div className="relative h-64 w-full overflow-hidden shadow-lg sm:h-80 md:h-96">
          <ClientImage
            src={place.photo_urls[0]}
            alt={`Image of ${place.name}`}
            fill
            objectFit="cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <h1 className="absolute bottom-0 left-0 p-4 text-3xl font-bold text-white drop-shadow-xl sm:p-8 sm:text-4xl lg:text-5xl">
            {place.name}
          </h1>
        </div>
      ) : (
        <header className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-center shadow-lg dark:from-indigo-700 dark:to-purple-800">
          <h1 className="text-4xl font-bold text-white lg:text-5xl">{place.name}</h1>
        </header>
      )}

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                <Info size={24} className="mr-2 text-indigo-600 dark:text-indigo-400" /> Key Information
              </h2>
              <div className="space-y-3">
                {place.formatted_address && (
                  <div className="flex items-start">
                    <MapPin size={20} className="mr-3 mt-1 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    <p className="text-gray-700 dark:text-gray-300">{place.formatted_address}</p>
                  </div>
                )}
                {place.rating !== undefined && (
                  <div className="flex items-start">
                    <Star size={20} className="mr-3 mt-0.5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    <StarRating rating={place.rating} totalRatings={place.user_ratings_total} />
                  </div>
                )}
                {place.types && place.types.length > 0 && (
                  <div className="flex items-start">
                    <Info size={20} className="mr-3 mt-0.5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    <div>{place.types.map((type) => (<span key={type} className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-300">{type.replace(/_/g, " ")}</span>))}</div>
                  </div>
                )}
                {place.business_status && (
                  <div className="flex items-start">
                    <Info size={20} className="mr-3 mt-0.5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    <p className="text-gray-700 dark:text-gray-300">Status: <span className="font-semibold">{place.business_status}</span></p>
                  </div>
                )}
              </div>
            </section>

            {/* Get Directions Section */}
            <section className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                <MapPinned size={24} className="mr-2 text-indigo-600 dark:text-indigo-400" /> Get Directions
              </h2>
              <button
                onClick={handleGetDirections}
                disabled={isLoadingDirections || !place}
                className="mb-4 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoadingDirections ? (
                  <> <Loader2 size={20} className="mr-2 animate-spin" /> Loading... </>
                ) : ( "Get Directions From My Location" )}
              </button>

              {isLoadingDirections && !directionsError && ( // Show loader only if no error yet during loading
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={32} className="animate-spin text-indigo-600 dark:text-indigo-400" />
                  <p className="ml-3 text-gray-700 dark:text-gray-300">Fetching directions...</p>
                </div>
              )}

              {directionsError && (
                <div className="flex items-center rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-700 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300">
                  <AlertTriangle size={20} className="mr-2 flex-shrink-0" /> {directionsError}
                </div>
              )}

              {directionsData && directionsData.routes.length > 0 && directionsData.status === 'OK' && (
                <div className="mt-4 space-y-3">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Route: {directionsData.routes[0].summary}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Distance: {directionsData.routes[0].legs[0].distance.text}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estimated Duration: {directionsData.routes[0].legs[0].duration.text}
                  </p>
                  <h4 className="mt-2 font-medium text-gray-700 dark:text-gray-200">Steps:</h4>
                  <ul className="list-decimal space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
                    {directionsData.routes[0].legs[0].steps.map((step, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: step.html_instructions }} />
                    ))}
                  </ul>
                </div>
              )}
              {(place.formatted_address || place.name) && ( // Always show Google Maps link if place details are available
                 <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originForDirectionsLink)}&destination=${encodeURIComponent(place.formatted_address || place.name || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    View on Google Maps <Navigation size={16} className="ml-1" />
                  </a>
              )}
            </section>

            {(place.website || place.formatted_phone_number) && (
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
                <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  <ExternalLink size={24} className="mr-2 text-indigo-600 dark:text-indigo-400" /> Contact & Links
                </h2>
                <div className="space-y-3">
                  {place.formatted_phone_number && (
                    <div className="flex items-center">
                      <PhoneIcon size={20} className="mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                      <a href={`tel:${place.international_phone_number || place.formatted_phone_number}`} className="text-indigo-600 hover:underline dark:text-indigo-400">{place.formatted_phone_number}</a>
                    </div>
                  )}
                  {place.website && (
                    <div className="flex items-center">
                      <Globe size={20} className="mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                      <a href={place.website} target="_blank" rel="noopener noreferrer" className="truncate text-indigo-600 hover:underline dark:text-indigo-400">{place.website}</a>
                    </div>
                  )}
                </div>
              </section>
            )}

            {place.photo_urls && place.photo_urls.length > 1 && (
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">Photo Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4"> {/* Removed md:grid-cols-4 */}
                  {place.photo_urls.slice(1, 7).map((url, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                      <ClientImage
                        src={url}
                        alt={`${place.name} photo ${index + 1}`}
                        fill
                        objectFit="cover"
                        className="transition-transform duration-200 hover:scale-105"
                        // Removed priority prop from gallery thumbnails
                        sizes="(max-width: 639px) 45vw, 30vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Places Section */}
            {isLoadingRelatedPlaces && (
              <section className="mt-6 rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
                <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  <ListTree size={24} className="mr-2 text-indigo-600 dark:text-indigo-400" /> You Might Also Like
                </h2>
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={32} className="animate-spin text-indigo-600" />
                  <p className="ml-3 text-gray-700 dark:text-gray-300">Loading related places...</p>
                </div>
              </section>
            )}
            {relatedPlacesError && (
              <section className="mt-6 rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
                 <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  <ListTree size={24} className="mr-2 text-indigo-600 dark:text-indigo-400" /> You Might Also Like
                </h2>
                <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">{relatedPlacesError}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}
            {place && relatedPlaces.length > 0 && !isLoadingRelatedPlaces && !relatedPlacesError && (
              <section className="mt-6 rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
                <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  <ListTree size={24} className="mr-2 text-indigo-600 dark:text-indigo-400" /> You Might Also Like
                </h2>
                <HorizontalScrollBar
                  title="" // Title is handled by the h2 above
                  cardData={relatedPlaces.map(place => ({
                    ...place,
                    vicinity: place.vicinity || "",
                  }))} // relatedPlaces are PlaceDetails[], compatible with LocationDetail[]
                  images={relatedPlaces.map(p => p.photo_urls?.[0] || DEFAULT_IMAGE_URL)}
                  scrollButton={{ route: "" as any, loading: false }} // Effectively hides "See all"
                  handleNavigation={() => {}} // Dummy function as "See all" is hidden
                />
              </section>
            )}
          </div>

          <div className="space-y-6 lg:col-span-1">
            {place.opening_hours && (
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
                <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  <Clock size={24} className="mr-2 text-indigo-600 dark:text-indigo-400" /> Opening Hours
                </h2>
                {place.opening_hours.open_now !== undefined && (<p className={`mb-3 text-lg font-semibold ${place.opening_hours.open_now ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{place.opening_hours.open_now ? "Open now" : "Closed now"}</p>)}
                {place.opening_hours.weekday_text && (<ul className="space-y-1 text-gray-700 dark:text-gray-300">{place.opening_hours.weekday_text.map((line, index) => (<li key={index}>{line}</li>))}</ul>)}
                {place.opening_hours.permanently_closed && (<p className="mt-3 font-semibold text-red-600 dark:text-red-400">Permanently Closed</p>)}
              </section>
            )}
            {place.reviews && place.reviews.length > 0 && (
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
                <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  <MessageSquare size={24} className="mr-2 text-indigo-600 dark:text-indigo-400" /> Reviews
                </h2>
                <div className="scrollbar-thin dark:scrollbar-thumb-slate-700 dark:scrollbar-track-slate-800 max-h-[600px] space-y-4 overflow-y-auto border rounded-md border-gray-200 dark:border-slate-700 p-3"> {/* Added border, rounded-md, and p-3 */}
                  {place.reviews.map((review, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0 dark:border-gray-700">
                      <div className="mb-1 flex items-center">
                        {review.profile_photo_url && (<ClientImage src={review.profile_photo_url} alt={review.author_name} width={32} height={32} className="mr-2 rounded-full" />)}
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{review.author_name}</h4>
                      </div>
                      <div className="mb-1 flex items-center">
                        <StarRating rating={review.rating} />
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{review.relative_time_description}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{review.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
