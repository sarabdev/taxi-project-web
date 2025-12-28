const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// -------------------------------
// Helpers
// -------------------------------
const getToken = () => localStorage.getItem("ar_token");

const setSession = (token) => {
  localStorage.setItem("ar_token", token);
};

const clearSession = () => {
  localStorage.removeItem("ar_token");
};

// -------------------------------
// Auth Service (API based)
// -------------------------------
export const authService = {
  // --------------------------------
  // REGISTER
  // --------------------------------
  async register(payload) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) return { ok: false, message: data.message };

      setSession(data.token);
      return { ok: true, user: data.user };
    } catch (err) {
      console.error("register error:", err);
      return { ok: false, message: "Network error" };
    }
  },

  // --------------------------------
  // LOGIN
  // --------------------------------
  async login(payload) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) return { ok: false, message: data.message };

      setSession(data.token);
      return { ok: true, user: data.user };
    } catch (err) {
      console.error("login error:", err);
      return { ok: false, message: "Network error" };
    }
  },

  // --------------------------------
  // LOGOUT
  // --------------------------------
  logout() {
    clearSession();
    return { ok: true };
  },

  // --------------------------------
  // GET CURRENT USER
  // --------------------------------
  async getCurrentUser() {
    const token = getToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return null;

      const data = await res.json();
      return data.user || null;
    } catch (err) {
      console.error("getCurrentUser error:", err);
      return null;
    }
  },
};
