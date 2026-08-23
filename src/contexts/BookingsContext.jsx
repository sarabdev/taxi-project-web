import { createContext, useCallback, useContext, useState } from "react";
import { bookingService } from "../services/bookingService";

const BookingsContext = createContext(null);

export const BookingsProvider = ({ children }) => {
  const [draftBooking, setDraftBookingState] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("booking_draft")) || null;
    } catch {
      return null;
    }
  });

  const setDraftBooking = useCallback((booking) => {
    setDraftBookingState(booking);
    if (booking) sessionStorage.setItem("booking_draft", JSON.stringify(booking));
    else sessionStorage.removeItem("booking_draft");
  }, []);

  const createBooking = async (payload) => bookingService.createWebsiteBooking(payload);

  return (
    <BookingsContext.Provider value={{
      draftBooking,
      setDraftBooking,
      clearDraftBooking: () => setDraftBooking(null),
      createBooking,
    }}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (!context) throw new Error("useBookings must be used within BookingsProvider");
  return context;
};
