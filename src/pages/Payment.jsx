import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { useBookings } from "../contexts/BookingsContext";
import GooglePayComponent from "../components/GooglePayComponent";

const Payment = () => {
  const navigate = useNavigate();

  const {
    draftBooking,
    createBooking,
    clearDraftBooking,
  } = useBookings();

  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  // --------------------------------
  // Guard: must have draft booking
  // --------------------------------
  useEffect(() => {
    if (!draftBooking) {
      navigate("/");
    }
  }, [draftBooking, navigate]);

  if (!draftBooking) return null;

  const { pricing } = draftBooking;

  // --------------------------------
  // Google Pay success handler
  // --------------------------------
  const handleGooglePaySuccess = async (paymentResult) => {
    try {
      setProcessing(true);

      // ✅ Create booking only AFTER payment confirmed
      createBooking({
        ...draftBooking,
        paymentStatus: "paid",
        paymentProvider: "google_pay",
        paymentReference: paymentResult?.paymentIntentId || null,
        paidAt: new Date().toISOString(),
      });

      clearDraftBooking();
      setCompleted(true);

      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error("Booking creation failed:", err);
      alert("Payment succeeded, but booking failed. Please contact support.");
    } finally {
      setProcessing(false);
    }
  };

  // --------------------------------
  // SUCCESS VIEW
  // --------------------------------
  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Booking Confirmed!
            </h2>

            <p className="text-gray-600 mb-6">
              Thank you for your booking. You will receive confirmation shortly.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="space-y-3 text-left">
                {draftBooking.isRoundTrip && (
                  <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm font-semibold">
                    ✓ Round Trip Booked
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-semibold">
                    {draftBooking.fromAddress}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-semibold">
                    {draftBooking.toAddress}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-3 mt-3">
                  <span className="text-gray-600">Total Paid:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    £{pricing.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Redirecting to home page…
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------
  // PAYMENT PAGE
  // --------------------------------
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Payment Details
          </h1>

          <p className="text-gray-600 mt-2">
            Complete your booking with secure payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PAYMENT METHOD */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Choose Payment Method
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Lock className="h-4 w-4 mr-1" />
                  Secure Payment
                </div>
              </div>

              {/* GOOGLE PAY */}
              <GooglePayComponent
                fare={pricing.totalAmount}
                bookingId={draftBooking.tempId || "draft"}
                onSuccess={handleGooglePaySuccess}
              />

              {processing && (
                <p className="text-sm text-gray-500 mt-4">
                  Processing payment…
                </p>
              )}
            </div>
          </div>

          {/* BOOKING SUMMARY */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-semibold mb-6">
                Booking Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">
                    {draftBooking.fromAddress}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">
                    {draftBooking.toAddress}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">
                    {pricing.distanceMiles} miles
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600">
                    £{pricing.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
