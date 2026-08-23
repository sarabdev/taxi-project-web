import { useState } from "react";
import { Link } from "react-router-dom";
import { Car, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Car className="h-8 w-8 text-primary-600" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">AirportRide</span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <Link to="/?quote=open" className="text-sm font-semibold text-primary-600 hover:text-primary-700">Get a Quote</Link>
            <Link to="/?book=open" className="btn-primary py-2 px-5 text-sm">Book Now</Link>
          </div>

          <button onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} aria-label="Toggle navigation" className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-700 hover:bg-slate-100 md:hidden">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t bg-white px-4 py-4 space-y-3 md:hidden">
          <Link to="/?book=open" onClick={() => setIsOpen(false)} className="block w-full text-center btn-primary">Book Now</Link>
          <Link to="/?quote=open" onClick={() => setIsOpen(false)} className="block w-full text-center border border-primary-600 text-primary-600 font-semibold rounded-lg py-3">Get an Instant Quote</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
