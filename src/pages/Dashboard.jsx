import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBookings } from "../contexts/BookingsContext";
import { Calendar, CheckCircle, Clock, Plus } from "lucide-react";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { bookings } = useBookings();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Welcome, {user?.fullName}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage your bookings and track your journey history
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link to="/booking" className="btn-primary flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            New Booking
                        </Link>
                        <button
                            onClick={logout}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Your booking form will move here in next step */}
                <div className="card mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Start a New Booking
                    </h2>
                    <p className="text-gray-600">
                        Next step: we’ll move your existing Home booking form into this section.
                    </p>

                    <div className="mt-5">
                        <Link to="/booking" className="btn-primary inline-flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Go to Booking
                        </Link>
                    </div>
                </div>

                {/* Past / Upcoming bookings */}
                <div className="card">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Your Bookings
                    </h2>

                    {bookings.length === 0 ? (
                        <p className="text-gray-600">
                            No bookings yet. Start your first booking above.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((b) => (
                                <div
                                    key={b.id}
                                    className="border rounded-lg p-4 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                >
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {b.fromLocation} → {b.toLocation}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {b.pickupDate ? new Date(b.pickupDate).toLocaleDateString() : ""}{" "}
                                            at {b.pickupTime} • {b.selectedCar?.name || "Vehicle"} • ${b.totalPrice}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${b.status === "Completed"
                                                ? "bg-green-50 text-green-700"
                                                : "bg-primary-50 text-primary-700"
                                                }`}
                                        >
                                            {b.status === "Completed" ? (
                                                <span className="inline-flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4" /> Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2">
                                                    <Clock className="h-4 w-4" /> Upcoming
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
