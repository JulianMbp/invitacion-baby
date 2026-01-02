import React from 'react';

export const Bottle = ({ className = "w-6 h-6", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M6 10h12v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10z" />
    <path d="M9 10V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
    <path d="M12 2v2" />
    <path d="M9 15h6" />
    <path d="M9 19h6" />
  </svg>
);

export const Pacifier = ({ className = "w-6 h-6", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 11a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4v-2a4 4 0 0 1 4-4z" />
    <path d="M10 11H8a4 4 0 0 1-4-4V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4h-2" />
    <path d="M12 2v3" />
  </svg>
);

export const Rattle = ({ className = "w-6 h-6", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="8" r="5" />
    <path d="M12 13v9" />
    <path d="M9 22h6" />
    <path d="M8 8h1" />
    <path d="M15 8h1" />
  </svg>
);

export const ToyBlock = ({ className = "w-6 h-6", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M4 12h16" />
    <path d="M12 4v16" />
  </svg>
);

export const Duck = ({ className = "w-6 h-6", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M11 6c0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.1-.4 2.1-1.2 2.8L19 12v3c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4 0-2.2 1.8-4 4-4h2" />
    <path d="M19 8h2a1 1 0 0 1 1 1v1" />
    <circle cx="16" cy="6" r="1" fill="currentColor" />
  </svg>
);

export const Baby = ({ className = "w-6 h-6", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 13c.5 1.5 2 2.5 4 2.5s3.5-1 4-2.5" />
    <path d="M9 9h.01" />
    <path d="M15 9h.01" />
  </svg>
);
