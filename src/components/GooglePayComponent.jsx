import React, { useEffect, useState } from "react";
import GooglePayButton from "@google-pay/button-react";
import { paymentService } from "../services/paymentService";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const GooglePayComponent = ({ fare, bookingId, onSuccess }) => {
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentIntentId, setPaymentIntentId] = useState(null);
    const [error, setError] = useState(null);

    // --------------------------------------------------
    // Create Stripe PaymentIntent (via paymentService)
    // --------------------------------------------------
    useEffect(() => {
        const createIntent = async () => {
            const res = await paymentService.createPaymentIntent({
                amount: fare,
                bookingId,
                currency: "GBP",
            });

            if (!res.ok) {
                setError(res.message || "Failed to initialize payment");
                return;
            }

            const secret = res.data.clientSecret;

            // clientSecret format: pi_xxx_secret_yyy
            const piId = secret.split("_secret_")[0];

            setClientSecret(secret);
            setPaymentIntentId(piId);
        };

        createIntent();
    }, [fare, bookingId]);

    // --------------------------------------------------
    // Error state
    // --------------------------------------------------
    if (error) {
        return (
            <p className="text-sm text-red-600 mt-4">
                Payment unavailable: {error}
            </p>
        );
    }

    // --------------------------------------------------
    // Loading state
    // --------------------------------------------------
    if (!clientSecret || !paymentIntentId) {
        return (
            <p className="text-sm text-gray-500 mt-4">
                Initializing secure payment…
            </p>
        );
    }

    // --------------------------------------------------
    // Google Pay Button
    // --------------------------------------------------
    return (
        <GooglePayButton
            environment="TEST"
            paymentRequest={{
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [
                    {
                        type: "CARD",
                        parameters: {
                            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                            allowedCardNetworks: ["VISA", "MASTERCARD"],
                        },
                        tokenizationSpecification: {
                            type: "PAYMENT_GATEWAY",
                            parameters: {
                                gateway: "stripe",
                                "stripe:version": "2022-11-15",
                                "stripe:publishableKey": STRIPE_PUBLISHABLE_KEY,
                            },
                        },
                    },
                ],
                merchantInfo: {
                    merchantName: "Ezza Taxi Service",
                },
                transactionInfo: {
                    totalPriceStatus: "FINAL",
                    totalPrice: `${fare}`,
                    currencyCode: "GBP",
                    countryCode: "GB",
                },
            }}
            onLoadPaymentData={() => {
                // ✅ DO NOT parse token
                // ✅ Send the real PaymentIntent ID
                onSuccess({
                    stripePaymentIntentId: paymentIntentId,
                });
            }}
            buttonType="book"
            buttonColor="black"
            style={{ width: "100%", height: "60px" }}
        />
    );
};

export default GooglePayComponent;
