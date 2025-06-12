"use client";

import React from "react";
import CategoryPageLayout from "@/components/category/CategoryPageLayout";

const categoryTitle = "What's Nearby?";
const categoryDescription = "Explore points of interest, stores, parks, and other places around you.";
const categoryQueryTypes = ["point_of_interest", "tourist_attraction", "park"];
const categoryRadius = 5000;

export default function NearbyPage() {
  return (
    <CategoryPageLayout
      title={categoryTitle}
      description={categoryDescription}
      queryTypes={categoryQueryTypes}
      radius={categoryRadius}
    />
  );
}
