const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// -------------------------------
// Helpers
// -------------------------------
const getToken = () => localStorage.getItem("ar_token");

// -------------------------------
// Pricing Service
// -------------------------------
export const pricingService = {
  /**
   * Calculate distance & price between two places
   * @param {string} fromPlaceId
   * @param {string} toPlaceId
   */
  async calculatePrice({ fromPlaceId, toPlaceId }) {
    const token = getToken();

    if (!token) {
      return {
        ok: false,
        message: "Authentication required",
      };
    }

    try {
      const res = await fetch(`${API_BASE}/api/pricing/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromPlaceId,
          toPlaceId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          ok: false,
          message: data.message || "Failed to calculate price",
        };
      }

      return {
        ok: true,
        data,
      };
    } catch (err) {
      console.error("pricing calculate error:", err);
      return {
        ok: false,
        message: "Network error",
      };
    }
  },
};
