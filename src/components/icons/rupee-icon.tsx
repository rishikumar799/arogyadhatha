
import * as React from "react";

export function RupeeIcon(props: React.SVGProps<SVGSVGElement>) {
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
        <path d="M6 3h12" />
        <path d="M6 8h12" />
        <path d="M18 13H6" />
        <path d="M18 8v13" />
        <path d="M6 8v9c0 2.2 1.8 4 4 4h3" />
    </svg>
  );
}

    