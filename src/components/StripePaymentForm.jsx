import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const StripePaymentForm = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setError("Payment system not ready. Please wait.");
            return;
        }

        setLoading(true);
        setError(null);

        /**
         * ---------------------------------------------------------
         * CONFIRM PAYMENT
         * - Stripe decides if redirect is needed (3DS / Wallet)
         * - Uses clientSecret from Elements provider
         * ---------------------------------------------------------
         */
        const { paymentIntent, error: stripeError } =
            await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Optional: you can add a return_url later if needed
                },
                redirect: "if_required",
            });

        if (stripeError) {
            setError(stripeError.message);
            setLoading(false);
            return;
        }

        /**
         * ---------------------------------------------------------
         * PAYMENT STATUS CHECK
         * ---------------------------------------------------------
         */
        if (paymentIntent?.status === "succeeded") {
            // ✅ SUCCESS — send PI ID to backend
            onSuccess({
                stripePaymentIntentId: paymentIntent.id,
                stripePaymentMethodId: paymentIntent.payment_method || null,
            });
        } else {
            setError(
                `Payment not completed (status: show more). Please try again.`
            );
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Stripe renders Card / Google Pay / Apple Pay here */}
            <PaymentElement />

            <button
                type="submit"
                disabled={!stripe || loading}
                className="btn-primary w-full disabled:opacity-60"
            >
                {loading ? "Processing payment…" : "Pay Now"}
            </button>

            {error && (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            )}
        </form>
    );
};

export default StripePaymentForm;
