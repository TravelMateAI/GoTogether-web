"use client";

import { LocationDetail } from "@/types/location-types"; // Assuming this path and type are correct for web
import React from "react";
import Image from 'next/image';

interface ScrollButton {
  route: string; // Should align with Next.js routes or RouteKey type if that's what handleNavigation expects
  loading: boolean;
}

interface HorizontalScrollBarProps {
  title: string;
  cardData: LocationDetail[]; // Ensure LocationDetail matches what HomeScreen provides
  scrollButton: ScrollButton;
  handleNavigation: (route: string) => void; // Or (route: RouteKey) if it expects a key
  images: string[];
}

const HorizontalScrollBar: React.FC<HorizontalScrollBarProps> = ({
  title,
  cardData,
  scrollButton,
  handleNavigation,
  images,
}) => {
  console.log(`HorizontalScrollBar ("${title}"): Received cardData:`, cardData);
  console.log(`HorizontalScrollBar ("${title}"): Received images:`, images);

  return (
    <div className="mb-8">
      <div className="flex flex-row justify-between items-center mb-3">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
        <button
          onClick={() => handleNavigation(scrollButton.route)}
          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors text-sm font-medium py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
        >
          See all
        </button>
      </div>
      {scrollButton.loading ? (
        <p className="my-4 text-center text-gray-600 dark:text-gray-400">Loading...</p>
      ) : (
        <div className="flex overflow-x-auto space-x-4 pb-2 -mx-1 px-1">
          {cardData.length === 0 && !scrollButton.loading && (
            <p className="text-gray-500 dark:text-gray-400">No items to display currently.</p>
          )}
          {cardData.map((item, index) => {
            const imagePath = images[index % images.length];
            console.log(`HorizontalScrollBar ("${title}"): Rendering card for item:`, item, "with imagePath:", imagePath);
            return (
              <div
                key={item.place_id || `${item.name}-${index}`} // Use place_id if available, fallback
                onClick={() => {
                  // TODO: Implement individual card click navigation if desired
                  // e.g., if item has a specific route or ID for a detail page
                  console.log("Card clicked:", item.name);
                }}
                className="group relative w-52 h-36 rounded-xl overflow-hidden shadow-lg cursor-pointer"
              >
                <Image
                  src={imagePath}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                {/* TODO: Review card overlay (bg-black/40) in dark mode for readability if needed. */}
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />
                <div className="absolute bottom-0 left-0 p-3 z-10">
                  <p className="text-white text-sm font-semibold drop-shadow-md">
                    {item.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HorizontalScrollBar;

// Notes:
// 1. Assumed `LocationDetail` contains `name` and `location: { lat, lng }`. Also place_id for keys.
// 2. `images` prop should now be an array of string paths accessible from the web.
// 3. Individual card click action is currently a console log.
// 4. Tailwind classes like `w-52 h-36` and `space-x-4` are used for sizing and spacing.
// 5. Added a message for when cardData is empty but not loading.
// 6. The `scrollButton.route` should be a valid Next.js path or a RouteKey if handleNavigation expects that.
// 7. Improved styling for "See all" button and card appearance.
// Note: Lines 8 and 9 from the previous "Notes" section, and any trailing markdown fence, have been removed.
