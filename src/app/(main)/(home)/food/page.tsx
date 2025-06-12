"use client";

    import React from "react";
    import CategoryPageLayout from "@/components/category/CategoryPageLayout"; // Verify path

    // Define specific props for the Food category
    const foodQueryTypes = [
      "restaurant",
      "cafe",
      "bakery",
      "meal_delivery",
      "meal_takeaway",
    ];
    const foodRadius = 10000; // 10km radius
    const foodTitle = "Delicious Food Spots";
    const foodDescription = "Explore restaurants, cafes, bakeries, and more.";
    // Optional: Define a specific fallback location if needed, otherwise CategoryPageLayout's default will be used.
    // const foodFallbackLocation = "YOUR_SPECIFIC_FALLBACK_LAT_LNG_HERE";

    export default function FoodPage() {
      return (
        <CategoryPageLayout
          title={foodTitle}
          description={foodDescription}
          queryTypes={foodQueryTypes}
          radius={foodRadius}
          // fallbackLocation={foodFallbackLocation} // Uncomment if you have a specific one
        />
      );
    }
