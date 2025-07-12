"use client";

export default function LoadingSpinner({ size = "default", text = "Loading..." }) {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-8 h-8"
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
      {text && <span className="text-gray-600 text-sm">{text}</span>}
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export function ButtonLoadingSpinner() {
  return (
    <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
  );
}
