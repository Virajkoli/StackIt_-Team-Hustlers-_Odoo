"use client";

import { useEffect } from 'react';

export default function ViewTracker({ questionId }) {
  useEffect(() => {
    if (!questionId) return;

    const trackView = async () => {
      try {
        await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ questionId }),
        });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    // Track view when component mounts
    trackView();
  }, [questionId]);

  return null; // This component doesn't render anything
}
