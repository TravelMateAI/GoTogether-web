import { getPlaceDetailsByIdAction } from "./actions";
import type { PlaceDetails } from "../../../../types/location-types";
// import Image from "next/image";
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
} from "lucide-react"; // Renamed Phone to PhoneIcon to avoid conflict
import ClientImage from "@/components/shared/ClientImage"; // Ensure this path is correct
// Helper function to render star ratings
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
        <Star
          key={`full-${i}`}
          size={20}
          className="fill-yellow-400 text-yellow-400"
        />
      ))}
      {halfStar && (
        <Star
          key="half"
          size={20}
          className="fill-yellow-200 text-yellow-400"
        />
      )}{" "}
      {/* Approximation of half-filled */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={20}
          className="fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
        />
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

export default async function PlaceDetailPage({
  params,
}: PlaceDetailPageProps) {
  const { placeId } = params;
  const placeDetailsResult = await getPlaceDetailsByIdAction(placeId);

  if (!placeDetailsResult.success || !placeDetailsResult.data) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center bg-gray-100 p-4 text-center dark:bg-slate-900">
        <AlertTriangle size={48} className="mb-4 text-red-500" />
        <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
          Place Not Found
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {placeDetailsResult.error ||
            "Could not load details for this place. It might be an invalid ID or a network issue."}
        </p>
        <Link href="/" legacyBehavior>
          <a className="rounded-md bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700">
            Back to Home
          </a>
        </Link>
      </div>
    );
  }

  const place = placeDetailsResult.data;
  const DEFAULT_IMAGE_URL = "/assets/images/default-placeholder.png"; // Ensure this placeholder exists

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Image Header / Gallery */}
      {place.photo_urls && place.photo_urls.length > 0 ? (
        <div className="relative h-64 w-full overflow-hidden shadow-lg sm:h-80 md:h-96">
          <ClientImage
            src={place.photo_urls[0]}
            alt={`Image of ${place.name}`}
            fill // ✔ replaces layout="fill"
            objectFit="cover" // ✔ correct usage as defined in your props
            priority // ✔ correct usage
          />
          {/* Simple overlay for better text visibility if name is on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <h1 className="absolute bottom-0 left-0 p-4 text-3xl font-bold text-white drop-shadow-xl sm:p-8 sm:text-4xl lg:text-5xl">
            {place.name}
          </h1>
        </div>
      ) : (
        <header className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-center shadow-lg dark:from-indigo-700 dark:to-purple-800">
          <h1 className="text-4xl font-bold text-white lg:text-5xl">
            {place.name}
          </h1>
        </header>
      )}

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Content Column (Details) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Key Info Section */}
            <section className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                <Info
                  size={24}
                  className="mr-2 text-indigo-600 dark:text-indigo-400"
                />{" "}
                Key Information
              </h2>
              <div className="space-y-3">
                {place.formatted_address && (
                  <div className="flex items-start">
                    <MapPin
                      size={20}
                      className="mr-3 mt-1 flex-shrink-0 text-gray-500 dark:text-gray-400"
                    />
                    <p className="text-gray-700 dark:text-gray-300">
                      {place.formatted_address}
                    </p>
                  </div>
                )}
                {place.rating !== undefined && (
                  <div className="flex items-start">
                    <Star
                      size={20}
                      className="mr-3 mt-0.5 flex-shrink-0 text-gray-500 dark:text-gray-400"
                    />
                    <StarRating
                      rating={place.rating}
                      totalRatings={place.user_ratings_total}
                    />
                  </div>
                )}
                {place.types && place.types.length > 0 && (
                  <div className="flex items-start">
                    <Info
                      size={20}
                      className="mr-3 mt-0.5 flex-shrink-0 text-gray-500 dark:text-gray-400"
                    />
                    <div>
                      {place.types.map((type) => (
                        <span
                          key={type}
                          className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-300"
                        >
                          {type.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {place.business_status && (
                  <div className="flex items-start">
                    <Info
                      size={20}
                      className="mr-3 mt-0.5 flex-shrink-0 text-gray-500 dark:text-gray-400"
                    />
                    <p className="text-gray-700 dark:text-gray-300">
                      Status:{" "}
                      <span className="font-semibold">
                        {place.business_status}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Contact & Links Section */}
            {(place.website || place.formatted_phone_number) && (
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
                <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  <ExternalLink
                    size={24}
                    className="mr-2 text-indigo-600 dark:text-indigo-400"
                  />{" "}
                  Contact & Links
                </h2>
                <div className="space-y-3">
                  {place.formatted_phone_number && (
                    <div className="flex items-center">
                      <PhoneIcon
                        size={20}
                        className="mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400"
                      />
                      <a
                        href={`tel:${place.international_phone_number || place.formatted_phone_number}`}
                        className="text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        {place.formatted_phone_number}
                      </a>
                    </div>
                  )}
                  {place.website && (
                    <div className="flex items-center">
                      <Globe
                        size={20}
                        className="mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400"
                      />
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        {place.website}
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Photo Gallery Grid (if more than 1 photo) */}
            {place.photo_urls && place.photo_urls.length > 1 && (
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Photo Gallery
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {place.photo_urls.slice(1, 7).map(
                    (
                      url,
                      index, // Show next 6 images, skipping the first one already used in header
                    ) => (
                      <div
                        key={index}
                        className="relative aspect-square overflow-hidden rounded-lg"
                      >
                        <ClientImage
                          src={url}
                          alt={`${place.name} photo ${index + 1}`}
                          fill
                          objectFit="cover"
                          className="transition-transform duration-200 hover:scale-105"
                          priority
                        />
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column (Opening Hours, Reviews) */}
          <div className="space-y-6 lg:col-span-1">
            {place.opening_hours && (
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
                <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  <Clock
                    size={24}
                    className="mr-2 text-indigo-600 dark:text-indigo-400"
                  />{" "}
                  Opening Hours
                </h2>
                {place.opening_hours.open_now !== undefined && (
                  <p
                    className={`mb-3 text-lg font-semibold ${place.opening_hours.open_now ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
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
                  <p className="mt-3 font-semibold text-red-600 dark:text-red-400">
                    Permanently Closed
                  </p>
                )}
              </section>
            )}

            {place.reviews && place.reviews.length > 0 && (
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
                <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  <MessageSquare
                    size={24}
                    className="mr-2 text-indigo-600 dark:text-indigo-400"
                  />{" "}
                  Reviews
                </h2>
                <div className="scrollbar-thin dark:scrollbar-thumb-slate-700 dark:scrollbar-track-slate-800 max-h-[600px] space-y-4 overflow-y-auto">
                  {place.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b pb-3 last:border-b-0 last:pb-0 dark:border-gray-700"
                    >
                      <div className="mb-1 flex items-center">
                        {review.profile_photo_url && (
                          <ClientImage
                            src={review.profile_photo_url}
                            alt={review.author_name}
                            width={32}
                            height={32}
                            className="mr-2 rounded-full"
                          />
                        )}
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                          {review.author_name}
                        </h4>
                      </div>
                      <div className="mb-1 flex items-center">
                        <StarRating rating={review.rating} />
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                          {review.relative_time_description}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {review.text}
                      </p>
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
