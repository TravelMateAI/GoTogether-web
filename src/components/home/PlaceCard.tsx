"use client";

import React from "react";
import ClientImage from "../shared/ClientImage"; // Changed to ClientImage
import Link from "next/link";
import { LocationDetail } from "../../types/location-types"; // Adjusted path

interface PlaceCardProps {
  item: LocationDetail;
  imagePath: string;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ item, imagePath }) => {
  return (
    <Link
      href={`/place/${item.place_id}`}
      // The key prop should be applied when mapping over PlaceCard components in the parent.
      // Adding it here would cause a warning if PlaceCard is used directly with a key.
      // key={item.place_id || item.name}
      className="group relative h-36 cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl"
    >
      <ClientImage
        src={imagePath}
        alt={item.name}
        fill
        objectFit="cover"
        className="transition-transform duration-300 group-hover:scale-110"
        // onError is handled by ClientImage's internal error handler
        sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, (max-width: 1279px) 30vw, 22vw"
        // priority={false} // ClientImage defaults priority to false, so not strictly needed unless true
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/60 group-hover:via-black/30" />
      <div className="absolute bottom-0 left-0 z-10 p-4">
        <p className="text-base font-semibold text-white drop-shadow-md">
          {item.name}
        </p>
      </div>
    </Link>
  );
};

export default PlaceCard;
