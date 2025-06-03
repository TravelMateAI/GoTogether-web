"use client";

import { LocationDetail } from "@/types/location-types"; // Assuming this path and type are correct for web
import React from "react";
import Image from 'next/image';

interface ScrollButton {
  route: string; // Should align with Next.js routes, e.g., "/home/top-picks"
  loading: boolean;
}

interface HorizontalScrollBarProps {
  title: string;
  cardData: LocationDetail[];
  scrollButton: ScrollButton;
  handleNavigation: (route: string) => void;
  images: string[]; // Changed from any[] to string[] for web paths
}

const HorizontalScrollBar: React.FC<HorizontalScrollBarProps> = ({
  title,
  cardData,
  scrollButton,
  handleNavigation,
  images,
}) => {
  return (
    <div className="mb-8"> {/* Replaced View, adjusted margin */}
      <div className="flex flex-row justify-between items-center mb-3"> {/* Replaced View */}
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2> {/* Replaced Text, adjusted styling */}
        <button
          onClick={() => handleNavigation(scrollButton.route)}
          className="text-indigo-600 hover:text-indigo-800 transition-colors text-sm font-medium py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          See all
        </button> {/* Replaced TouchableOpacity and Text */}
      </div>
      {scrollButton.loading ? (
        <p className="my-4 text-center text-gray-600">Loading...</p> /* Replaced ActivityIndicator */
      ) : (
        <div className="flex overflow-x-auto space-x-4 pb-2 -mx-1 px-1"> {/* Replaced FlatList, added padding for scrollbar visibility and space-x for item margin */}
          {cardData.length === 0 && !scrollButton.loading && (
            <p className="text-gray-500">No items to display currently.</p>
          )}
          {cardData.map((item, index) => {
            const imagePath = images[index % images.length];
            return (
              <div // Replaces ImageBackground's outer structure
                key={`${item.name}-${item.location.lat}-${item.location.lng}`}
                onClick={() => {
                  // Assuming clicking a card might navigate to its detail page in the future
                  // For now, this example doesn't make individual cards clickable to a specific route
                  // but one could be added to LocationDetail if needed.
                  console.log("Card clicked:", item.name);
                }}
                className="group relative w-52 h-36 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                // Removed transform hover:scale-105 transition-transform duration-200 from here, will apply to Image if desired
              >
                <Image
                  src={imagePath}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110" // Apply zoom effect on image
                />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" /> {/* Overlay */}
                <div className="absolute bottom-0 left-0 p-3 z-10"> {/* Ensure text is above overlay */}
                  <p className="text-white text-sm font-semibold drop-shadow-md">
                    {item.name}
                  </p>
                  {/* You could add more details here if available in item, e.g., item.category */}
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
// 1. Assumed `LocationDetail` contains `name` and `location: { lat, lng }`.
// 2. `images` prop should now be an array of string paths accessible from the web (e.g., "/assets/images/image1.jpg").
// 3. Individual card click action is currently a console log; it can be customized.
// 4. Tailwind classes like `w-52 h-36` (replacing w-48 h-32 and mr-4) and `space-x-4` are used for sizing and spacing.
// 5. Added a message for when cardData is empty but not loading.
// 6. The `scrollButton.route` should be a valid Next.js path.
// 7. Improved styling for "See all" button and card appearance.
// 8. Added `pb-2 -mx-1 px-1` to the scrolling container to better manage padding with `space-x-4` and potential scrollbars.
// 9. Changed card dimensions to `w-52 h-36` for a slightly different aspect ratio, can be adjusted.
// 10. The `group` class from Tailwind is used for hover effects on the overlay.
```
