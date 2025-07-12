"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FastLink({ href, children, className, prefetch = true, ...props }) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = async (e) => {
    // Only handle left clicks without modifiers
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    e.preventDefault();
    setIsNavigating(true);

    try {
      // Start navigation
      router.push(href);
    } catch (error) {
      console.error("Navigation error:", error);
      setIsNavigating(false);
    }
  };

  const handleMouseEnter = () => {
    if (prefetch) {
      router.prefetch(href);
    }
  };

  return (
    <Link
      href={href}
      className={`${className} ${isNavigating ? 'opacity-75 pointer-events-none' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
      {isNavigating && (
        <span className="inline-block ml-2">
          <div className="w-3 h-3 animate-spin rounded-full border border-gray-300 border-t-current"></div>
        </span>
      )}
    </Link>
  );
}
