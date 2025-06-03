"use client";

import React from "react";

export default function PlannerPage() {
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Trip Planner</h1>
        <p className="text-lg text-gray-600">Plan your next adventure here!</p>
      </header>

      <main>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Upcoming Trips</h2>
          <div className="border border-dashed border-gray-300 p-10 rounded-md text-center">
            <p className="text-gray-500">
              This is a placeholder for the planner functionality.
            </p>
            <p className="text-gray-400 mt-2">
              (Demo version - more features coming soon!)
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Your App Name. All rights reserved.</p>
      </footer>
    </div>
  );
}
