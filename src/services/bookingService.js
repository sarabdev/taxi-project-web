const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// ----------------------------------
// AUTH HELPER
// ----------------------------------
const getToken = () => localStorage.getItem("ar_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ----------------------------------
// BOOKING SERVICE (REAL API)
// ----------------------------------
export const bookingService = {
  // ======================================================
  // CREATE WEBSITE BOOKING (AFTER STRIPE PAYMENT)
  // ======================================================
  async createWebsiteBooking(payload) {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/website`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return { ok: true, booking: data.booking };
    } catch (err) {
      console.error("createWebsiteBooking error:", err);
      return { ok: false, message: err.message };
    }
  },

  // ======================================================
  // CREATE WHATSAPP BOOKING
  // ======================================================
  async createWhatsappBooking(payload) {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/whatsapp`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return { ok: true, booking: data.booking };
    } catch (err) {
      console.error("createWhatsappBooking error:", err);
      return { ok: false, message: err.message };
    }
  },

  // ======================================================
  // GET MY BOOKINGS (LIST)
  // ======================================================
  async getMyBookings() {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/me`, {
        headers: authHeaders(),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return { ok: true, bookings: data.bookings };
    } catch (err) {
      console.error("getMyBookings error:", err);
      return { ok: false, bookings: [] };
    }
  },

  // ======================================================
  // GET MY BOOKING BY ID
  // ======================================================
  async getMyBookingById(id) {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/me/${id}`, {
        headers: authHeaders(),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return { ok: true, booking: data.booking };
    } catch (err) {
      console.error("getMyBookingById error:", err);
      return { ok: false, message: err.message };
    }
  },

  // ======================================================
  // CANCEL MY BOOKING
  // ======================================================
  async cancelBooking(id) {
    try {
      const res = await fetch(
        `${API_BASE}/api/bookings/me/${id}/cancel`,
        {
          method: "PATCH",
          headers: authHeaders(),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return { ok: true, booking: data.booking };
    } catch (err) {
      console.error("cancelBooking error:", err);
      return { ok: false, message: err.message };
    }
  },
};
