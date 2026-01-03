import { Link } from "react-router-dom";
import {
    Plane,
    Clock,
    ShieldCheck,
    Leaf,
    UserCheck,
    CheckCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const AirportTaxis = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Pre-Booked Peace of Mind",
            description:
                "Schedule your airport transfer in advance and travel knowing everything is arranged ahead of time.",
        },
        {
            icon: <Plane className="h-6 w-6" />,
            title: "Live Flight Monitoring",
            description:
                "Our control centre tracks your flight in real time and adjusts pickup times automatically if your flight changes.",
        },
        {
            icon: <UserCheck className="h-6 w-6" />,
            title: "Meet & Greet Service",
            description:
                "Choose our Meet & Greet option and be welcomed at arrivals with a name board and guided to your vehicle.",
        },
        {
            icon: <ShieldCheck className="h-6 w-6" />,
            title: "Safe & Professional Drivers",
            description:
                "All drivers are fully licensed, experienced, and trained to deliver a smooth and secure journey.",
        },
        {
            icon: <Leaf className="h-6 w-6" />,
            title: "Greener Travel Options",
            description:
                "We operate a modern fleet with fuel-efficient and low-emission vehicles wherever possible.",
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Reliable Airport Transfers
                        </h1>
                        <p className="text-xl text-primary-100">
                            Pre-book your airport taxi for a smooth, safe, and stress-free journey
                        </p>
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Stress-Free Airport Travel
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Our airport taxi service is designed to remove uncertainty from
                                    your journey. Pre-book your pickup or drop-off and arrive on
                                    time, every time.
                                </p>
                                <p>
                                    We monitor flights around the clock, ensuring your driver is
                                    ready when you land—no waiting and no delays.
                                </p>
                            </div>

                            {/* CTA (AUTH AWARE) */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/booking"
                                    className="btn-primary px-6 py-3 text-center"
                                >
                                    Book an Airport Taxi
                                </Link>

                                {!isAuthenticated && (
                                    <Link
                                        to="/login"
                                        className="px-6 py-3 rounded-lg border border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors text-center"
                                    >
                                        Login for Faster Booking
                                    </Link>
                                )}

                                {isAuthenticated && (
                                    <Link
                                        to="/dashboard"
                                        className="px-6 py-3 rounded-lg border border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors text-center"
                                    >
                                        Go to Dashboard
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=900&h=600&fit=crop"
                                alt="Airport taxi pickup"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Our Airport Taxis?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Built around reliability, safety, and comfort
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((item, index) => (
                            <div key={index} className="card hover:shadow-xl transition-shadow">
                                <div className="flex items-start space-x-4">
                                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex-shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet & Greet Section */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            Meet & Greet Service
                        </h3>
                        <div className="space-y-4">
                            {[
                                "Driver meets you inside arrivals with a personalised name board",
                                "Assistance with luggage and guidance to your vehicle",
                                "Ideal for business travellers, families, and first-time visitors",
                                "Available for airport pickups and selected drop-off locations",
                            ].map((point, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">{point}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 bg-primary-50 border border-primary-100 rounded-lg p-4">
                            <p className="text-gray-700">
                                <strong>Pricing:</strong> Meet &amp; Greet services start from{" "}
                                <span className="font-semibold text-primary-600">£55.00</span>{" "}
                                for drop-offs within the city centre.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Travel with Confidence
                    </h2>
                    <p className="text-xl mb-8 text-primary-100">
                        Pre-book your airport transfer and let us take care of the rest
                    </p>

                    {!isAuthenticated ? (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/booking"
                                className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors"
                            >
                                Book Your Airport Taxi
                            </Link>
                            <Link
                                to="/login"
                                className="inline-block border border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors"
                            >
                                Login
                            </Link>
                        </div>
                    ) : (
                        <Link
                            to="/booking"
                            className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors"
                        >
                            Book Now
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AirportTaxis;
