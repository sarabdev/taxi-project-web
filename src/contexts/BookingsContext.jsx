import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    useCallback,
} from "react";
import { bookingService } from "../services/bookingService";
import { useAuth } from "./AuthContext";

const BookingsContext = createContext(null);

export const BookingsProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    // ----------------------------------
    // STATE
    // ----------------------------------
    const [bookings, setBookings] = useState([]);
    const [draftBooking, setDraftBooking] = useState(null);
    const [loading, setLoading] = useState(false);

    // ----------------------------------
    // LOAD USER BOOKINGS (ON LOGIN)
    // ----------------------------------
    const loadBookings = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        const res = await bookingService.getMyBookings();

        if (res.ok) {
            setBookings(res.bookings);
        } else {
            setBookings([]);
        }

        setLoading(false);
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            setBookings([]);
            setDraftBooking(null); // 🔐 clear draft on logout
            return;
        }

        loadBookings();
    }, [isAuthenticated, user, loadBookings]);

    // ----------------------------------
    // GET SINGLE BOOKING (DETAIL PAGE)
    // ----------------------------------
    const getBookingById = async (bookingId) => {
        if (!isAuthenticated) {
            return { success: false, message: "Unauthorized" };
        }

        const res = await bookingService.getMyBookingById(bookingId);
        console.log(res)
        // Normalize response shape
        if (res?.ok && res?.booking) {
            console.log("test")
            return res;
        }

        return {
            success: false,
            message: res?.message || "Booking not found",
        };
    };


    // ----------------------------------
    // CREATE FINAL BOOKING (POST-PAYMENT)
    // ----------------------------------
    const createBooking = async (payload) => {
        if (!isAuthenticated) return { ok: false };

        const res = await bookingService.createWebsiteBooking(payload);

        if (res.ok) {
            setBookings((prev) => [res.booking, ...prev]);
            setDraftBooking(null); // ✅ clear draft after success
        }

        return res;
    };

    // ----------------------------------
    // CANCEL USER BOOKING
    // ----------------------------------
    const cancelBooking = async (bookingId) => {
        const res = await bookingService.cancelBooking(bookingId);

        if (res.ok) {
            setBookings((prev) =>
                prev.map((b) =>
                    b._id === bookingId ? res.booking : b
                )
            );
        }

        return res;
    };

    // ----------------------------------
    // CONTEXT VALUE
    // ----------------------------------
    const value = useMemo(
        () => ({
            bookings,
            loading,

            // 🔹 Draft booking (before payment)
            draftBooking,
            setDraftBooking,
            clearDraftBooking: () => setDraftBooking(null),

            // 🔹 Actions
            reloadBookings: loadBookings,
            getBookingById,          // ✅ ADDED
            createBooking,
            cancelBooking,
        }),
        [
            bookings,
            loading,
            draftBooking,
            loadBookings,
        ]
    );

    return (
        <BookingsContext.Provider value={value}>
            {children}
        </BookingsContext.Provider>
    );
};

// ----------------------------------
// HOOK
// ----------------------------------
export const useBookings = () => {
    const ctx = useContext(BookingsContext);
    if (!ctx) {
        throw new Error("useBookings must be used within BookingsProvider");
    }
    return ctx;
};
