"use client";

import { LocationDetail } from "@/types/location-types";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import Link from 'next/link'; // Added Link import
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScrollButton {
  route: string;
  loading: boolean;
}

interface HorizontalScrollBarProps {
  title: string;
  cardData: LocationDetail[];
  scrollButton: ScrollButton;
  handleNavigation: (route: string) => void;
  images: string[];
}

const HorizontalScrollBar: React.FC<HorizontalScrollBarProps> = ({
  title,
  cardData,
  scrollButton,
  handleNavigation,
  images,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // console.log(`HorizontalScrollBar ("${title}"): Received cardData:`, cardData);
  // console.log(`HorizontalScrollBar ("${title}"): Received images:`, images);

  const updateScrollButtonState = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5); // Allow a small tolerance
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // Allow a small tolerance
    }
  }, []); // No dependencies, relies on ref.current

  useEffect(() => {
    const scrollElement = scrollContainerRef.current;
    if (scrollElement) {
      updateScrollButtonState(); // Initial check

      scrollElement.addEventListener('scroll', updateScrollButtonState);

      const resizeObserver = new ResizeObserver(updateScrollButtonState);
      resizeObserver.observe(scrollElement);

      // Also update on cardData change, as this can change scrollWidth
      // This is especially true if cardData starts empty and then loads
      const mutationObserver = new MutationObserver(updateScrollButtonState);
      mutationObserver.observe(scrollElement, { childList: true, subtree: true });


      return () => {
        scrollElement.removeEventListener('scroll', updateScrollButtonState);
        resizeObserver.unobserve(scrollElement);
        mutationObserver.disconnect();
      };
    }
  }, [cardData, updateScrollButtonState]); // updateScrollButtonState is memoized by useCallback

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-8 relative group/scrollbar"> {/* Added relative and group for potential absolute positioning of buttons if chosen */}
      <div className="flex flex-row justify-between items-center mb-3">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleScrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="p-1.5 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleScrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="p-1.5 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => handleNavigation(scrollButton.route)}
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors text-sm font-medium py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
          >
            See all
          </button>
        </div>
      </div>
      {scrollButton.loading ? (
        <p className="my-4 text-center text-gray-600 dark:text-gray-400">Loading...</p>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-slate-700 dark:hover:scrollbar-thumb-slate-600"
          style={{ scrollbarWidth: 'thin' }} // For Firefox
        >
          {cardData.length === 0 && !scrollButton.loading && (
            <p className="text-gray-500 dark:text-gray-400 whitespace-nowrap">No items to display currently.</p>
          )}
          {cardData.map((item, index) => {
            const imagePath = images[index % images.length];
            // console.log(`HorizontalScrollBar ("${title}"): Rendering card for item:`, item, "with imagePath:", imagePath);
            return (
              <Link
                href={`/place/${item.place_id}`}
                key={item.place_id || `${item.name}-${index}`}
                className="group relative h-36 overflow-hidden rounded-xl shadow-lg cursor-pointer w-[calc(50%-0.5rem)] sm:w-[calc(100%/3-0.75rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(100%/6-0.833rem)] flex-shrink-0"
                // onClick={() => console.log("Card Link clicked:", item.name)} // Optional: for debugging link click
              >
                <Image
                  src={imagePath || '/assets/images/default-placeholder.png'}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => { e.currentTarget.src = '/assets/images/default-placeholder.png'; }} // Handle broken image links
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
// 1. Assumed `LocationDetail` contains `name`, `location: { lat, lng }`, and `place_id`.
// 2. `images` prop should now be an array of string paths accessible from the web.
// 3. Individual card click action replaced by Link navigation.
// 4. Card widths are responsive; Link component now acts as the card container.
// 5. Added a message for when cardData is empty but not loading.
// 6. The `scrollButton.route` should be a valid Next.js path or a RouteKey if handleNavigation expects that.
// 7. Improved styling for "See all" button and card appearance.
// 8. Added `pb-2 -mx-1 px-1` to the scrolling container.
// 9. Card overlay (bg-black/40) might need review in dark mode.
// 10. Added Next/Previous scroll buttons with visibility logic.
// 11. Added scrollbar styling utility classes (scrollbar-thin, etc.) - may require a plugin like tailwind-scrollbar.
// Note: Extraneous comment lines and any trailing markdown fence removed.
