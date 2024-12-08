import React from 'react';
import { SiBuymeacoffee } from 'react-icons/si';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between">
          <div className="logo text-2xl text-center font-bold tracking-[1px] mb-4 md:mb-0">
            Notebin
          </div>
          <Link
            href="https://buymeacoffee.com/abhyudayacodingclub"
            target="_blank"
            className="inline-flex items-center gap-1 hover:text-secondary transition-all ease-in-out"
          >
            <SiBuymeacoffee size={20} />
            <h1 className="text-md">Buy me a coffee</h1>
          </Link>
        </div>
        <div className="border-t border-zinc-600 py-4 text-sm text-center">
          <p>
            &copy; {new Date().getFullYear()} Abhyudaya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
