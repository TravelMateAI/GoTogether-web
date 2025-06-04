"use client";

import { LocationDetail } from "@/types/location-types";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import Link from 'next/link'; // Added for card navigation
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

  const updateScrollButtonState = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5); // Add a small buffer
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // Add a small buffer
    }
  }, []);

  useEffect(() => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;

    updateScrollButtonState(); // Initial check

    scrollElement.addEventListener('scroll', updateScrollButtonState);
    const resizeObserver = new ResizeObserver(updateScrollButtonState);
    resizeObserver.observe(scrollElement);
    const mutationObserver = new MutationObserver(updateScrollButtonState);
    mutationObserver.observe(scrollElement, { childList: true, subtree: true });

    return () => {
      scrollElement.removeEventListener('scroll', updateScrollButtonState);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [cardData, updateScrollButtonState]);

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

  // console.log(\`HorizontalScrollBar ("${title}"): Received cardData:\`, cardData);
  // console.log(\`HorizontalScrollBar ("${title}"): Received images:\`, images);

  return (
    <div className="mb-8"> {/* Main component wrapper */}
      <div className="flex flex-row justify-between items-center mb-3">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleScrollLeft}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={handleScrollRight}
            disabled={!canScrollRight}
            className="p-1.5 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
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
          className="flex overflow-x-auto space-x-4 pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-slate-600 dark:hover:scrollbar-thumb-slate-500"
        >
          {cardData.length === 0 && !scrollButton.loading && (
            <p className="text-gray-500 dark:text-gray-400 pl-1">No items to display currently.</p>
          )}
          {cardData.map((item, index) => {
            const imagePath = (images && images.length > index && images[index]) ? images[index] : '/assets/images/default-placeholder.png';
            // console.log(\`HorizontalScrollBar ("${title}"): Rendering card for item:\`, item, "with imagePath:", imagePath);
            return (
              <Link
                href={`/place/${item.place_id}`}
                key={item.place_id || \`\${item.name}-\${index}\`}
                className="group relative h-36 rounded-xl overflow-hidden shadow-lg cursor-pointer flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(100%/3-0.75rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(100%/6-0.833rem)] transition-all duration-200 ease-in-out hover:shadow-xl"
              >
                <Image
                  src={imagePath}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/default-placeholder.png'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/60 group-hover:via-black/30" />
                <div className="absolute bottom-0 left-0 p-3 z-10">
                  <p className="text-white text-sm font-semibold drop-shadow-md">
                    {item.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HorizontalScrollBar;

// Notes:
// 1. LocationDetail structure assumed (name, place_id, etc.).
// 2. `images` prop is an array of direct image URLs.
// 3. Card click navigates to /place/[place_id].
// 4. Responsive widths for cards implemented.
// 5. Next/Previous buttons added with scroll logic and dynamic disabling.
// 6. Dark mode for buttons included.
// 7. Fallback image for onError and if imagePath is initially undefined.
// 8. Scrollbar styling utilities added (may require tailwind-scrollbar).
// 9. Small buffer for scroll button state checks.
// 10. MutationObserver and ResizeObserver for robust button state updates.
// 11. Gradient overlay for better text readability on images.
```
