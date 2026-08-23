import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
} from "lucide-react";

import GetQuoteDialog from "../components/GetQuoteDialog";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteMode, setQuoteMode] = useState("quote");

  useEffect(() => {
    if (searchParams.get("quote") === "open") {
      setQuoteMode("quote");
      setQuoteOpen(true);
    }
    if (searchParams.get("book") === "open") {
      setQuoteMode("book");
      setQuoteOpen(true);
    }
  }, [searchParams]);

  const closeQuote = () => {
    setQuoteOpen(false);
    if (searchParams.has("quote") || searchParams.has("book")) {
      setSearchParams({}, { replace: true });
    }
  };

  const openFlow = (mode) => {
    setQuoteMode(mode);
    setQuoteOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-bold tracking-[0.2em] uppercase text-primary-100 mb-4">UK airport taxi booking</p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-5 sm:mb-6">
              Airport transfers made simple
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-primary-100">
              Get an instant fare and book your airport ride in just a few simple steps.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => openFlow("book")} className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl shadow-sm transition-colors inline-flex items-center justify-center gap-2">
                Book Now<ArrowRight className="h-5 w-5" />
              </button>
              <button onClick={() => openFlow("quote")} className="border border-white/70 text-white hover:bg-white hover:text-primary-800 font-semibold py-3 px-8 rounded-xl transition-colors">
                Get an Instant Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-9 sm:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AirportRide?
            </h2>
            <p className="text-lg text-gray-600">
              Everything needed for a straightforward airport transfer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: CheckCircle,
                title: "Clear Pricing",
                text: "See your fare before deciding whether to book",
              },
              {
                icon: Clock,
                title: "Quick Booking",
                text: "Book without creating an account",
              },
              {
                icon: Shield,
                title: "Secure Payment",
                text: "Complete your booking through secure Stripe payment",
              },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
                  <f.icon className="h-8 w-8 text-primary-800" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to book your ride?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              No account needed. Get your price and book.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => openFlow("book")} className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl transition-colors">Book Now</button>
              <button onClick={() => openFlow("quote")} className="border border-white/70 text-white hover:bg-white hover:text-primary-800 font-semibold py-3 px-8 rounded-xl transition-colors">Get an Instant Quote</button>
            </div>
          </div>
        </section>

      {/* GET QUOTE DIALOG */}
      <GetQuoteDialog
        open={quoteOpen}
        onClose={closeQuote}
        mode={quoteMode}
      />
    </div>
  );
};

export default Home;
