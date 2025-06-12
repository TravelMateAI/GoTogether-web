"use client";

import React from "react";
import CategoryPageLayout from "@/components/category/CategoryPageLayout";

const categoryTitle = "Places to Stay";
const categoryDescription = "Find hotels, motels, resorts, and other lodging options.";
const categoryQueryTypes = [
  "lodging",
  "hotel",
  "motel",
  "resort",
  "campground",
  "apartment_hotel",
];
const categoryRadius = 20000;

export default function StayPage() {
  return (
    <CategoryPageLayout
      title={categoryTitle}
      description={categoryDescription}
      queryTypes={categoryQueryTypes}
      radius={categoryRadius}
    />
  );
}
