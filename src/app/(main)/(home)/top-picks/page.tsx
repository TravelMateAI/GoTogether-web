"use client";

import React from "react";
import CategoryPageLayout from "@/components/category/CategoryPageLayout";

const categoryTitle = "Top Picks For You";
const categoryDescription = "Explore highly-rated attractions, landmarks, and points of interest.";
const categoryQueryTypes = [
  "tourist_attraction",
  "landmark",
  "park",
  "point_of_interest",
  "place_of_worship",
];
const categoryRadius = 15000;

export default function TopPicksPage() {
  return (
    <CategoryPageLayout
      title={categoryTitle}
      description={categoryDescription}
      queryTypes={categoryQueryTypes}
      radius={categoryRadius}
    />
  );
}
