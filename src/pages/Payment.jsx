import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useBookings } from "../contexts/BookingsContext";
import { paymentService } from "../services/paymentService";
import StripePaymentForm from "../components/StripePaymentForm";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const Payment = () => {
  const navigate = useNavigate();

  const {
    draftBooking,
    createBooking,
    clearDraftBooking,
  } = useBookings();

  const [clientSecret, setClientSecret] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);

  /**
   * ---------------------------------------------------------
   * GUARD + CREATE PAYMENT INTENT
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!draftBooking) {
      navigate("/");
      return;
    }

    const initPayment = async () => {
      setError(null);

      const res = await paymentService.createPaymentIntent({
        amount: draftBooking.pricing.totalAmount,
        currency: "GBP",
        bookingId: draftBooking.tempId || "draft",
      });

      if (!res.ok) {
        setError(res.message || "Failed to initialize payment");
        return;
      }

      setClientSecret(res.data.clientSecret);
    };

    initPayment();
  }, [draftBooking, navigate]);

  if (!draftBooking) return null;

  const { pricing } = draftBooking;

  /**
   * ---------------------------------------------------------
   * STRIPE SUCCESS HANDLER
   * ---------------------------------------------------------
   */
  const handleStripeSuccess = async ({
    stripePaymentIntentId,
    stripePaymentMethodId,
  }) => {
    if (processing) return;

    try {
      setProcessing(true);
      setError(null);

      const res = await createBooking({
        fromAddress: draftBooking.fromAddress,
        toAddress: draftBooking.toAddress,

        // ✅ NEW text-based fields
        bookingDate: draftBooking.bookingDate,
        bookingTime: draftBooking.bookingTime,
        returnDate: draftBooking.returnDate,
        returnTime: draftBooking.returnTime,

        numberOfPersons: draftBooking.numberOfPersons,
        luggage: draftBooking.luggage,
        carType: draftBooking.carType,

        amount: pricing.totalAmount,
        currency: "GBP",

        stripePaymentIntentId,
        stripePaymentMethodId,
      });

      if (!res?.success) {
        setError(
          res?.message ||
          "Payment succeeded, but booking could not be confirmed."
        );
        setProcessing(false);
        return;
      }

      clearDraftBooking();
      setCompleted(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    } catch (err) {
      console.error("Booking creation failed:", err);
      setError(
        "Payment was successful, but booking failed. Please contact support."
      );
    } finally {
      setProcessing(false);
    }
  };


  /**
   * ---------------------------------------------------------
   * SUCCESS VIEW
   * ---------------------------------------------------------
   */
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
              Your payment was successful and your booking is confirmed.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="space-y-3 text-left">
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
              Redirecting to dashboard…
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * ---------------------------------------------------------
   * PAYMENT PAGE
   * ---------------------------------------------------------
   */
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
          {/* PAYMENT */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Secure Payment
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Lock className="h-4 w-4 mr-1" />
                  Stripe Protected
                </div>
              </div>

              {!clientSecret ? (
                <p className="text-sm text-gray-500">
                  Initializing payment…
                </p>
              ) : (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret }}
                >
                  <StripePaymentForm onSuccess={handleStripeSuccess} />
                </Elements>
              )}

              {processing && (
                <p className="text-sm text-gray-500 mt-4">
                  Finalizing booking…
                </p>
              )}

              {error && (
                <p className="text-sm text-red-600 mt-4">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* SUMMARY */}
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
