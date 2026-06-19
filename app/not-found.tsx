import React from 'react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4 text-center">
      <div className="max-w-md">
        <h1 className="font-serif text-5xl md:text-6xl text-[#1A1A1A] tracking-widest uppercase">404</h1>
        <h2 className="mt-4 font-serif text-2xl text-[#1A1A1A]">Page Not Found</h2>
        <p className="mt-2 text-sm text-[#8A8580] tracking-wide">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-8">
          <a
            href="/"
            className="inline-flex items-center justify-center border border-[#1A1A1A] px-8 py-3 text-[11px] tracking-[0.28em] uppercase text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF8F5] transition-colors duration-300"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  );
}
