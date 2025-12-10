// components/Loader/Loader.jsx
import React from "react";

export default function Loader({ size = 20, stroke = 3 }) {
  // size is radius in px-ish (affects SVG viewBox scale)
  const px = Math.max(16, size);
  return (
    <div role="status" aria-label="loading" className="flex items-center justify-center">
      <svg
        width={px}
        height={px}
        viewBox="0 0 50 50"
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeOpacity="0.15"
        />
        <path
          fill="currentColor"
          d="M43.935 25.145a1 1 0 00-.98-1.365 1 1 0 00-.356.07 17 17 0 11-8.205-13.57"
          className="text-white"
        />
      </svg>
    </div>
  );
}
