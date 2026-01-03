import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBookings } from "../contexts/BookingsContext";
import {
    Calendar,
    CheckCircle,
    Clock,
    Plus,
    Eye,
    XCircle,
} from "lucide-react";

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

                {/* Start Booking */}
                <div className="card mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Start a New Booking
                    </h2>
                    <p className="text-gray-600">
                        Book a taxi in just a few steps with instant confirmation.
                    </p>

                    <div className="mt-5">
                        <Link to="/booking" className="btn-primary inline-flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Create Booking
                        </Link>
                    </div>
                </div>

                {/* Bookings */}
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
                            {bookings.map((b) => {
                                const pickupDate = b.pickupDateTime
                                    ? new Date(b.pickupDateTime)
                                    : null;

                                return (
                                    <div
                                        key={b._id}
                                        className="border rounded-lg p-5 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                    >
                                        {/* LEFT */}
                                        <div className="space-y-1">
                                            <div className="font-semibold text-gray-900">
                                                {b.fromAddress} → {b.toAddress}
                                            </div>

                                            {pickupDate && (
                                                <div className="text-sm text-gray-600">
                                                    {pickupDate.toLocaleDateString()} at{" "}
                                                    {pickupDate.toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                            )}

                                            <div className="text-sm text-gray-600">
                                                Amount:{" "}
                                                <span className="font-semibold">
                                                    £{b.amount}
                                                </span>{" "}
                                                • Payment:{" "}
                                                <span
                                                    className={`font-semibold ${b.paymentStatus === "paid"
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                        }`}
                                                >
                                                    {b.paymentStatus}
                                                </span>
                                            </div>
                                        </div>

                                        {/* RIGHT */}
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {/* STATUS */}
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${b.status === "confirmed"
                                                        ? "bg-green-50 text-green-700"
                                                        : b.status === "cancelled"
                                                            ? "bg-red-50 text-red-700"
                                                            : "bg-primary-50 text-primary-700"
                                                    }`}
                                            >
                                                {b.status === "confirmed" && (
                                                    <span className="inline-flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4" />
                                                        Confirmed
                                                    </span>
                                                )}

                                                {b.status === "pending" && (
                                                    <span className="inline-flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        Pending
                                                    </span>
                                                )}

                                                {b.status === "cancelled" && (
                                                    <span className="inline-flex items-center gap-2">
                                                        <XCircle className="h-4 w-4" />
                                                        Cancelled
                                                    </span>
                                                )}
                                            </span>

                                            {/* VIEW DETAILS */}
                                            <Link
                                                to={`/bookings/${b._id}`}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold border rounded-lg hover:bg-gray-50"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
