
import * as React from "react";

export function PregnantLadyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="6" r="2" />
      <path d="M12 8v4" />
      <path d="M12 12c-2.67 0-5.33 1.33-5.33 4H17.33C17.33 13.33 14.67 12 12 12z" />
      <path d="M12 16a6 6 0 0 0 6 6H6a6 6 0 0 0 6-6z" />
    </svg>
  );
}
