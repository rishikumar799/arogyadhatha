
import * as React from "react";

export function InsuranceIcon(props: React.SVGProps<SVGSVGElement>) {
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
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 11.134a4.931 4.931 0 0 0-4.931 4.932 4.931 4.931 0 0 0 4.931 4.932 4.931 4.931 0 0 0 4.932-4.932A4.931 4.931 0 0 0 12 11.134z" />
        <path d="M12 13.068v6" />
        <path d="M15 16.068H9" />
    </svg>
  );
}
