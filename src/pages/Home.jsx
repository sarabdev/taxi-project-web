import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Shield,
  Star,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {isAuthenticated
                ? `Welcome back, ${user?.fullName || "Traveler"}`
                : "Your Journey, Our Priority"}
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              {isAuthenticated
                ? "Manage your bookings, track rides, and book your next journey in seconds."
                : "Premium airport taxi service with professional drivers and comfortable vehicles"}
            </p>

            {/* CTA AREA */}
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Login to Book
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="border border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Create Account
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="h-5 w-5" />
                  Go to Dashboard
                </button>

                <button
                  onClick={() => navigate("/booking")}
                  className="border border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Book a Ride
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AirportRide?
            </h2>
            <p className="text-lg text-gray-600">
              Experience the difference with our premium service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Reliable Service",
                text: "99% on-time arrival rate with professional drivers",
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                text: "Round-the-clock service for all your travel needs",
              },
              {
                icon: Shield,
                title: "Safe & Secure",
                text: "Licensed drivers and fully insured vehicles",
              },
              {
                icon: Star,
                title: "Premium Fleet",
                text: "Modern, clean vehicles with top-notch amenities",
              },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <f.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section (Only for guests) */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Book Smarter with an Account
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Track bookings, save time, and enjoy priority service
            </p>

            <button
              onClick={() => navigate("/register")}
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Get Started
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
