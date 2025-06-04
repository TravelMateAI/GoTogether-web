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
}) => { // Ensuring this opening brace and arrow function syntax is clean
  return ( // Ensuring this return and opening parenthesis are clean
    <div className="mb-8"> {/* Replaced View, adjusted margin */}
      <div className="flex flex-row justify-between items-center mb-3"> {/* Replaced View */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2> {/* Dark mode for title */}
        <button
          onClick={() => handleNavigation(scrollButton.route)}
          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors text-sm font-medium py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
        >
          See all
        </button> {/* Dark mode for "See all" button */}
      </div>
      {/* More JSX will be restored here in subsequent steps */}
    </div>
  ); // Ensuring this closing parenthesis is clean
}; // Ensuring this closing brace and semicolon are clean

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
// 9. Card overlay (bg-black/40) might need review in dark mode for optimal text readability on very dark images, though it's generally effective.
