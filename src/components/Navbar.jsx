import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">
                AirportRide
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${isActive(item.path)
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                  }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Services Dropdown (Desktop Hover) */}
            <div className="relative group">
              <span className="cursor-pointer text-sm font-medium text-gray-700 hover:text-primary-600">
                Services
              </span>

              <div className="absolute left-0 mt-2 w-56 rounded-md bg-white shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/services/personal-accounts"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Personal Accounts
                </Link>
                <Link
                  to="/services/airport-taxis"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Airport Taxis
                </Link>
              </div>
            </div>

            {/* Book Now */}
            <Link to="/booking" className="btn-primary py-2 px-4 text-sm">
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(item.path)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Services (Mobile) */}
            <div className="px-3 py-2">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                Services
              </div>

              <Link
                to="/services/personal-accounts"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base text-gray-700 hover:bg-gray-50"
              >
                Personal Accounts
              </Link>

              <Link
                to="/services/airport-taxis"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base text-gray-700 hover:bg-gray-50"
              >
                Airport Taxis
              </Link>
            </div>

            {/* Book Now */}
            <Link
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center btn-primary mt-4"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
