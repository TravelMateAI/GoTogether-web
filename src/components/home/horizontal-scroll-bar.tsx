"use client";

import { LocationDetail } from "@/types/location-types";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PlaceCard from "./PlaceCard"; // Import the new PlaceCard component
import type { RouteKey } from "@/lib/routes"; // Import RouteKey

interface ScrollButton {
  route: RouteKey; // Changed string to RouteKey
  loading: boolean;
}

interface HorizontalScrollBarProps {
  title: string;
  cardData: LocationDetail[];
  scrollButton: ScrollButton;
  handleNavigation: (route: RouteKey) => void; // Changed string to RouteKey
  images: string[];
}
const HorizontalScrollBar = (
  props: HorizontalScrollBarProps,
): React.JSX.Element => {
  const { title, cardData, scrollButton, handleNavigation, images } = props;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const updateScrollButtonState = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;

    updateScrollButtonState();

    scrollElement.addEventListener("scroll", updateScrollButtonState);
    const resizeObserver = new ResizeObserver(updateScrollButtonState);
    resizeObserver.observe(scrollElement);
    const mutationObserver = new MutationObserver(updateScrollButtonState);
    mutationObserver.observe(scrollElement, { childList: true, subtree: true });

    return () => {
      scrollElement.removeEventListener("scroll", updateScrollButtonState);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [cardData, updateScrollButtonState]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-3 flex flex-row items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleScrollLeft}
            disabled={!canScrollLeft}
            className="rounded-full bg-gray-100 p-1.5 transition-opacity hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
            aria-label="Scroll left"
          >
            <ChevronLeft
              size={20}
              className="text-gray-700 dark:text-gray-300"
            />
          </button>
          <button
            onClick={handleScrollRight}
            disabled={!canScrollRight}
            className="rounded-full bg-gray-100 p-1.5 transition-opacity hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
            aria-label="Scroll right"
          >
            <ChevronRight
              size={20}
              className="text-gray-700 dark:text-gray-300"
            />
          </button>
          <button
            onClick={() => handleNavigation(scrollButton.route)}
            className="rounded-md px-2 py-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 dark:focus:ring-indigo-600"
          >
            See all
          </button>
        </div>
      </div>

      {scrollButton.loading ? (
        <p className="my-4 text-center text-gray-600 dark:text-gray-400">
          Loading...
        </p>
      ) : (
        <div
          ref={scrollContainerRef}
          className="scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-slate-600 dark:hover:scrollbar-thumb-slate-500 -mx-1 flex space-x-4 overflow-x-auto px-1 pb-2"
        >
          {cardData.length === 0 && !scrollButton.loading && (
            <p className="pl-1 text-gray-500 dark:text-gray-400">
              No items to display currently.
            </p>
          )}
          {cardData.map((item, index) => {
            const imagePath =
              images?.[index] ?? "/assets/images/default-placeholder.png";

            return (
              <PlaceCard
                key={item.place_id || `${item.name}-${index}`}
                item={item}
                imagePath={imagePath}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HorizontalScrollBar;
