import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    CreditCard,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";
import { useBookings } from "../contexts/BookingsContext";

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getBookingById } = useBookings();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --------------------------------
    // Fetch booking
    // --------------------------------
    useEffect(() => {
        const loadBooking = async () => {
            try {
                const res = await getBookingById(id);
                console.log("pk", res)
                if (!res?.ok) {
                    console.log("okkkk")
                    setError(res?.message || "Booking not found");
                    return;
                }
                setError(null)
                setBooking(res.booking);
            } catch (err) {
                console.error("Failed to load booking:", err);
                setError("Failed to load booking details");
            } finally {
                setLoading(false);
            }
        };

        loadBooking();
    }, [id, getBookingById]);

    // --------------------------------
    // STATES
    // --------------------------------
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading booking details…
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="card max-w-md text-center">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="btn-primary mt-4"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const pickupDateTime =
        booking?.bookingDate && booking?.bookingTime
            ? new Date(`${booking.bookingDate}T${booking.bookingTime}`)
            : null;

    const returnDateTime =
        booking?.returnDate && booking?.returnTime
            ? new Date(`${booking.returnDate}T${booking.returnTime}`)
            : null;

    // --------------------------------
    // PAGE
    // --------------------------------
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back
                </button>

                <div className="card space-y-8">

                    {/* STATUS */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Booking Details
                        </h1>

                        <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${booking.status === "confirmed"
                                ? "bg-green-50 text-green-700"
                                : booking.status === "cancelled"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-primary-50 text-primary-700"
                                }`}
                        >
                            {booking.status === "confirmed" && (
                                <span className="inline-flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Confirmed
                                </span>
                            )}

                            {booking.status === "pending" && (
                                <span className="inline-flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Pending
                                </span>
                            )}

                            {booking.status === "cancelled" && (
                                <span className="inline-flex items-center gap-2">
                                    <XCircle className="h-4 w-4" />
                                    Cancelled
                                </span>
                            )}
                        </span>
                    </div>

                    {/* ROUTE */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex gap-3">
                            <MapPin className="h-6 w-6 text-primary-600 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">From</p>
                                <p className="font-semibold">{booking.fromAddress}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <MapPin className="h-6 w-6 text-primary-600 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">To</p>
                                <p className="font-semibold">{booking.toAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* DATE & VEHICLE */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex gap-3">
                            <Calendar className="h-6 w-6 text-primary-600 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Pickup Date & Time</p>
                                <p className="font-semibold">
                                    {pickupDateTime
                                        ? `${pickupDateTime.toLocaleDateString()} at ${pickupDateTime.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}`
                                        : "—"}
                                </p>

                            </div>
                            {booking.returnDate && booking.returnTime && (
                                <div className="flex gap-3">
                                    <Calendar className="h-6 w-6 text-primary-600 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">Return Date & Time</p>
                                        <p className="font-semibold">
                                            {returnDateTime?.toLocaleDateString()} at{" "}
                                            {returnDateTime?.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Vehicle</p>
                            <p className="font-semibold capitalize">
                                {booking.carType}
                            </p>
                        </div>
                    </div>

                    {/* PAYMENT */}
                    <div className="border-t pt-6 space-y-3">
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-6 w-6 text-primary-600" />
                            <h2 className="text-xl font-semibold">Payment</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Amount</p>
                                <p className="font-semibold">
                                    £{booking.amount} {booking.currency}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Payment Status</p>
                                <p
                                    className={`font-semibold ${booking.paymentStatus === "paid"
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {booking.paymentStatus}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-gray-500">Stripe Payment ID</p>
                                <p className="font-mono text-xs break-all">
                                    {booking.stripePaymentIntentId}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
