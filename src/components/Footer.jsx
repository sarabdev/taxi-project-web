import { Link } from "react-router-dom";
import { Car } from "lucide-react";

const Footer = () => (
  <footer className="bg-gray-900 text-slate-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <Link to="/" className="inline-flex items-center gap-2 text-white">
            <Car className="h-7 w-7 text-primary-500" />
            <span className="text-xl font-bold">AirportRide</span>
          </Link>
          <p className="text-sm mt-2">Simple airport transfer booking.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 text-sm font-semibold">
          <Link to="/?quote=open" className="hover:text-white">Get a Quote</Link>
          <Link to="/?book=open" className="hover:text-white">Book Now</Link>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-7 pt-5 text-xs text-center text-gray-500">
        © {new Date().getFullYear()} AirportRide. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
