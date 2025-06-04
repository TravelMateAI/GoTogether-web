"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LocationDetail } from '../../types/location-types'; // Adjusted path

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
};

export default PlaceCard;
```
