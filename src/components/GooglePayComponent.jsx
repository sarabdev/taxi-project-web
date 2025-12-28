import React, { useEffect, useState } from "react";
import GooglePayButton from "@google-pay/button-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const GooglePayComponent = ({ fare, bookingId, onSuccess }) => {
    const [clientSecret, setClientSecret] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const createIntent = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/payments/create-intent`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: fare,
                        bookingId,
                        currency: "GBP",
                    }),
                });

                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to create payment");

                setClientSecret(data.clientSecret);
            } catch (err) {
                console.error("Create intent error:", err);
                setError(err.message);
            }
        };

        createIntent();
    }, [fare, bookingId]);

    // 🔴 SHOW ERROR
    if (error) {
        return (
            <p className="text-sm text-red-600 mt-4">
                Payment unavailable: {error}
            </p>
        );
    }

    // ⏳ SHOW LOADER (THIS IS WHAT YOU WERE MISSING)
    if (!clientSecret) {
        return (
            <p className="text-sm text-gray-500 mt-4">
                Initializing secure payment…
            </p>
        );
    }

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
                merchantInfo: { merchantName: "Ezza Taxi Service" },
                transactionInfo: {
                    totalPriceStatus: "FINAL",
                    totalPrice: `${fare}`,
                    currencyCode: "GBP",
                    countryCode: "GB",
                },
            }}
            onLoadPaymentData={() => onSuccess()}
            buttonType="book"
            buttonColor="black"
            style={{ width: "100%", height: "60px" }}
        />
    );
};


export default GooglePayComponent;
