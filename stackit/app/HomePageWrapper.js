"use client";

import { Suspense } from "react";
import HomePage from "./HomePage";

function HomePageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    }>
      <HomePage />
    </Suspense>
  );
}

export default HomePageWrapper;
