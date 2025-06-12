"use client";

import React from "react";
import CategoryPageLayout from "@/components/category/CategoryPageLayout";

const categoryTitle = "Entertainment Venues";
const categoryDescription = "Find movie theaters, nightlife, live music, and more.";
const categoryQueryTypes = [
  "movie_theater",
  "night_club",
  "bar",
  "casino",
  "bowling_alley",
  "amusement_park",
];
const categoryRadius = 15000;

export default function EntertainmentPage() {
  return (
    <CategoryPageLayout
      title={categoryTitle}
      description={categoryDescription}
      queryTypes={categoryQueryTypes}
      radius={categoryRadius}
    />
  );
}
