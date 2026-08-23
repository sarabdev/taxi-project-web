const API_BASE = import.meta.env.DEV
  ? import.meta.env.VITE_LOCAL_API_BASE_URL || "http://localhost:5000"
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// -------------------------------
// Payment Service
// -------------------------------
export const paymentService = {
  /**
   * Create Stripe PaymentIntent (one-time payment)
   * @param {number} amount - total amount (e.g. 45.5)
   * @param {string} bookingId - temp or draft booking id
   * @param {string} currency - default GBP
   */
  async createPaymentIntent({ amount, bookingId, currency = "GBP", customerEmail, customerName }) {
    if (!amount || amount <= 0) {
      return {
        ok: false,
        message: "Invalid payment amount",
      };
    }

    try {
      const res = await fetch(`${API_BASE}/payments/create-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          bookingId,
          currency,
          customerEmail,
          customerName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          ok: false,
          message: data.message || "Failed to create payment",
        };
      }

      return {
        ok: true,
        data, // { clientSecret }
      };
    } catch (err) {
      console.error("create payment intent error:", err);
      return {
        ok: false,
        message: "Network error",
      };
    }
  },
};
