'use client';
import { cn } from "@/lib/utils";

export function AnimatedActivityIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-6 h-6", className)}
      {...props}
    >
      <style>{`
        .wave-path {
          stroke-dasharray: 29;
          stroke-dashoffset: 58;
          animation: wave-draw 2.5s ease-in-out infinite;
        }
        @keyframes wave-draw {
          0% {
            stroke-dashoffset: 58;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -58;
          }
        }
      `}</style>
      <path d="M2 12h3l3-9 4 18 3-9h5" className="wave-path" />
    </svg>
  );
}
