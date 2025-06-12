"use client";

import React from "react";
import CategoryPageLayout from "@/components/category/CategoryPageLayout";

const categoryTitle = "Cultural Hotspots";
const categoryDescription = "Discover museums, art galleries, and historical sites.";
const categoryQueryTypes = [
  "museum",
  "art_gallery",
  "performing_arts_theater",
  "library",
  "historic_site",
  "tourist_attraction",
];
const categoryRadius = 20000;

export default function CulturePage() {
  return (
    <CategoryPageLayout
      title={categoryTitle}
      description={categoryDescription}
      queryTypes={categoryQueryTypes}
      radius={categoryRadius}
    />
  );
}
