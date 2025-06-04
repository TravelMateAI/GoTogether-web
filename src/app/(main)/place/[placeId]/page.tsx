import { getPlaceDetailsByIdAction } from "./actions";
import type { PlaceDetails } from "../../../../../../types/location-types"; // Adjust path as necessary
import Image from "next/image";
import Link from "next/link";
import { MapPin, Globe, Phone as PhoneIcon, Star, Clock, Info, MessageSquare, ExternalLink, AlertTriangle } from "lucide-react"; // Renamed Phone to PhoneIcon to avoid conflict

// Helper function to render star ratings
const StarRating = ({ rating, totalRatings }: { rating?: number; totalRatings?: number }) => {
  if (rating === undefined) return null;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={20} className="text-yellow-400 fill-yellow-400" />
      ))}
      {halfStar && <Star key="half" size={20} className="text-yellow-400 fill-yellow-200" />} {/* Approximation of half-filled */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={20} className="text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600" />
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

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { placeId } = params;
  const placeDetailsResult = await getPlaceDetailsByIdAction(placeId);

  if (!placeDetailsResult.success || !placeDetailsResult.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 text-center bg-gray-100 dark:bg-slate-900">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Place Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {placeDetailsResult.error || "Could not load details for this place. It might be an invalid ID or a network issue."}
        </p>
        <Link href="/" legacyBehavior>
          <a className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Back to Home
          </a>
        </Link>
      </div>
    );
  }

  const place = placeDetailsResult.data;
  const DEFAULT_IMAGE_URL = "/assets/images/default-placeholder.png"; // Ensure this placeholder exists

  return (
    <div className="bg-gray-100 dark:bg-slate-900 min-h-screen">
      {/* Image Header / Gallery */}
      {place.photo_urls && place.photo_urls.length > 0 ? (
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden shadow-lg">
          <Image
            src={place.photo_urls[0]}
            alt={`Image of ${place.name}`}
            layout="fill"
            objectFit="cover"
            priority // Prioritize loading the main image
            onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE_URL; }}
          />
          {/* Simple overlay for better text visibility if name is on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
           <h1 className="absolute bottom-0 left-0 p-4 sm:p-8 text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-xl">
            {place.name}
          </h1>
        </div>
      ) : (
        <header className="bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-700 dark:to-purple-800 p-8 text-center shadow-lg">
          <h1 className="text-4xl lg:text-5xl font-bold text-white">{place.name}</h1>
        </header>
      )}

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Column (Details) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Info Section */}
            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <Info size={24} className="mr-2 text-indigo-600 dark:text-indigo-400" /> Key Information
              </h2>
              <div className="space-y-3">
                {place.formatted_address && (
                  <div className="flex items-start">
                    <MapPin size={20} className="mr-3 mt-1 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <p className="text-gray-700 dark:text-gray-300">{place.formatted_address}</p>
                  </div>
                )}
                 {place.rating !== undefined && (
                    <div className="flex items-start">
                         <Star size={20} className="mr-3 mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <StarRating rating={place.rating} totalRatings={place.user_ratings_total} />
                    </div>
                )}
                {place.types && place.types.length > 0 && (
                  <div className="flex items-start">
                    <Info size={20} className="mr-3 mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <div>
                      {place.types.map((type) => (
                        <span key={type} className="inline-block bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 text-xs font-semibold mr-2 mb-2">
                          {type.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                 {place.business_status && (
                  <div className="flex items-start">
                    <Info size={20} className="mr-3 mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <p className="text-gray-700 dark:text-gray-300">Status: <span className="font-semibold">{place.business_status}</span></p>
                  </div>
                )}
              </div>
            </section>

            {/* Contact & Links Section */}
            {(place.website || place.formatted_phone_number) && (
              <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                  <ExternalLink size={24} className="mr-2 text-indigo-600 dark:text-indigo-400" /> Contact & Links
                </h2>
                <div className="space-y-3">
                  {place.formatted_phone_number && (
                    <div className="flex items-center">
                      <PhoneIcon size={20} className="mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <a href={`tel:${place.international_phone_number || place.formatted_phone_number}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                        {place.formatted_phone_number}
                      </a>
                    </div>
                  )}
                  {place.website && (
                    <div className="flex items-center">
                      <Globe size={20} className="mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline truncate">
                        {place.website}
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Photo Gallery Grid (if more than 1 photo) */}
            {place.photo_urls && place.photo_urls.length > 1 && (
              <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                 <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Photo Gallery</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {place.photo_urls.slice(1, 7).map((url, index) => ( // Show next 6 images, skipping the first one already used in header
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                            <Image
                                src={url}
                                alt={`${place.name} photo ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="hover:scale-105 transition-transform duration-200"
                                onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE_URL; }}
                            />
                        </div>
                    ))}
                 </div>
              </section>
            )}
          </div>

          {/* Sidebar Column (Opening Hours, Reviews) */}
          <div className="lg:col-span-1 space-y-6">
            {place.opening_hours && (
              <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                  <Clock size={24} className="mr-2 text-indigo-600 dark:text-indigo-400" /> Opening Hours
                </h2>
                {place.opening_hours.open_now !== undefined && (
                  <p className={`mb-3 text-lg font-semibold ${place.opening_hours.open_now ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {place.opening_hours.open_now ? "Open now" : "Closed now"}
                  </p>
                )}
                {place.opening_hours.weekday_text && (
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                    {place.opening_hours.weekday_text.map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                )}
                {place.opening_hours.permanently_closed && (
                    <p className="mt-3 text-red-600 dark:text-red-400 font-semibold">Permanently Closed</p>
                )}
              </section>
            )}

            {place.reviews && place.reviews.length > 0 && (
              <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                  <MessageSquare size={24} className="mr-2 text-indigo-600 dark:text-indigo-400" /> Reviews
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin dark:scrollbar-thumb-slate-700 dark:scrollbar-track-slate-800">
                  {place.reviews.map((review, index) => (
                    <div key={index} className="border-b dark:border-gray-700 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center mb-1">
                        {review.profile_photo_url && (
                            <Image src={review.profile_photo_url} alt={review.author_name} width={32} height={32} className="rounded-full mr-2"/>
                        )}
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{review.author_name}</h4>
                      </div>
                      <div className="flex items-center mb-1">
                        <StarRating rating={review.rating} />
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{review.relative_time_description}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.text}</p>
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

```
