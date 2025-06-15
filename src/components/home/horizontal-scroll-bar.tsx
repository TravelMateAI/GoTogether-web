"use client";

import { LocationDetail } from "@/types/location-types";
import React from "react";
import PlaceCard from "./PlaceCard";
import type { RouteKey } from "@/lib/routes";
import { ChevronRight } from "lucide-react";

interface ScrollButton {
  route: RouteKey;
  loading: boolean;
}

interface HorizontalScrollBarProps {
  title: string;
  cardData: LocationDetail[];
  scrollButton: ScrollButton;
  handleNavigation: (route: RouteKey) => void;
  images: string[];
}

const HorizontalScrollBar = ({
  title,
  cardData,
  scrollButton,
  handleNavigation,
  images,
}: HorizontalScrollBarProps): React.JSX.Element => {
  const maxCards = 3;
  const displayedCards = cardData.slice(0, maxCards);

  return (
    <div className="mb-8 w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
        {scrollButton?.route && (
          <button
            onClick={() => handleNavigation(scrollButton.route)}
            className="flex items-center space-x-1 px-2 py-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <span>See all</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {scrollButton.loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Loading...
        </p>
      ) : displayedCards.length === 0 ? (
        <p className="pl-1 text-gray-500 dark:text-gray-400">
          No items to display currently.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedCards.map((item, index) => (
            <PlaceCard
              key={item.place_id || `${item.name}-${index}`}
              item={item}
              imagePath={
                images?.[index] || "/assets/images/default-placeholder.png"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HorizontalScrollBar;
