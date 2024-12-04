'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookie from 'js-cookie';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [token, setToken] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const tokenFromCookie = Cookie.get('token');
    setToken(tokenFromCookie);
  }, []);

  const handleLogout = () => {
    Cookie.remove('token');
    setToken(null);
    window.location.href = '/';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="logo text-2xl font-bold tracking-[1px]">
              Notebin
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="hover:bg-secondary/30 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/notes"
                className="hover:bg-secondary/30 px-3 py-2 rounded-md text-sm font-medium"
              >
                Notes
              </Link>
              <Link
                href="/pyq"
                className="hover:bg-secondary/30 px-3 py-2 rounded-md text-sm font-medium"
              >
                PYQs
              </Link>

              <Link
                href="/uploadNotes"
                className="hover:bg-secondary/30 px-3 py-2 rounded-md text-sm font-medium"
              >
                Upload
              </Link>
              <Link
                href="https://www.linkedin.com/in/mandeepyadav27/"
                target="_blank"
                className="hover:bg-secondary/30 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </Link>
              {token ? (
                <button
                  onClick={handleLogout}
                  className="border-secondary border text-secondary px-4 py-1 rounded-full hover:bg-tertiary hover:text-primary"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="border-secondary border text-secondary px-4 py-1 rounded-full hover:bg-tertiary hover:text-primary"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="block" size={18} aria-hidden="true" />
              ) : (
                <FaBars className="block" size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="hover:bg-secondary/30 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/notes"
              className="hover:bg-secondary/30 block px-3 py-2 rounded-md text-base font-medium"
            >
              Notes
            </Link>
            <Link
              href="/pyq"
              className="hover:bg-secondary/30 block px-3 py-2 rounded-md text-base font-medium"
            >
              PYQs
            </Link>
            <Link
              href="/uploadNotes"
              className="hover:bg-secondary/30 block px-3 py-2 rounded-md text-base font-medium"
            >
              Upload
            </Link>
            <Link
              href="https://www.linkedin.com/in/mandeepyadav27/"
              target="_blank"
              className="hover:bg-secondary/30 block px-3 py-2 rounded-md text-base font-medium"
            >
              Contact
            </Link>
            {token ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left hover:bg-secondary/30 px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="hover:bg-secondary/30 block px-3 py-2 rounded-md text-base font-medium"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
