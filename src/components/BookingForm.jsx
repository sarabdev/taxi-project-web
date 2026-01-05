import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
    Users,
    Briefcase,
    ArrowRight,
    RefreshCw,
    Calendar,
    Car,
} from "lucide-react";
import { useBookings } from "../contexts/BookingsContext";
import { pricingService } from "../services/pricingService";

const CAR_TYPES = [
    { value: "sedan", label: "Sedan" },
    { value: "executive", label: "Executive" },
    { value: "mpv", label: "MPV" },
    { value: "suv", label: "SUV" },
    { value: "van", label: "Van" },
];

const autocompleteRequest = {
    componentRestrictions: { country: "gb" },
};
const BookingForm = () => {
    const navigate = useNavigate();
    const { setDraftBooking } = useBookings();

    const [fromPlace, setFromPlace] = useState(null);
    const [toPlace, setToPlace] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        carType: "sedan",
        numberOfPersons: 1,
        luggage: 1,
        isRoundTrip: false,
        pickupDate: "",
        pickupTime: "",
        returnDate: "",
        returnTime: "",
    });

    const getTodayDate = () => {
        const now = new Date();
        return now.toISOString().split("T")[0]; // YYYY-MM-DD
    };

    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5); // HH:mm
    };


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({
            ...p,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // --------------------------------
    // SUBMIT → CALCULATE PRICE → SAVE DRAFT → PAYMENT
    // --------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        // --------------------------------
        // Basic validation
        // --------------------------------
        if (!fromPlace || !toPlace) {
            alert("Please select pickup and drop-off locations");
            return;
        }

        if (!formData.bookingDate || !formData.bookingTime) {
            alert("Please enter booking date and time");
            return;
        }

        const pickupDateTime = new Date(`${formData.bookingDate}T${formData.bookingTime}`);
        if (Number.isNaN(pickupDateTime.getTime())) {
            alert("Invalid booking date/time");
            return;
        }

        if (pickupDateTime < new Date()) {
            alert("Past date/time not allowed");
            return;
        }

        if (formData.isRoundTrip) {
            if (!formData.returnDate || !formData.returnTime) {
                alert("Please enter return date and time");
                return;
            }

            const returnDateTime = new Date(`${formData.returnDate}T${formData.returnTime}`);
            if (Number.isNaN(returnDateTime.getTime())) {
                alert("Invalid return date/time");
                return;
            }

            if (returnDateTime < pickupDateTime) {
                alert("Return date/time must be after pickup");
                return;
            }
        }



        setLoading(true);

        // --------------------------------
        // 1️⃣ Call pricing API
        // --------------------------------
        const pricingRes = await pricingService.calculatePrice({
            fromPlaceId: fromPlace.value.place_id,
            toPlaceId: toPlace.value.place_id,
        });

        if (!pricingRes.ok) {
            setLoading(false);
            alert(pricingRes.message || "Failed to calculate price");
            return;
        }

        const { distance, pricing } = pricingRes.data;

        // --------------------------------
        // 2️⃣ Build booking draft (NO date parsing)
        // --------------------------------
        const draftBooking = {
            // 🔑 Used for Stripe metadata & tracking
            tempId: `draft_${Date.now()}`,

            source: "website",
            paymentMethod: "stripe",

            fromAddress: fromPlace.label,
            toAddress: toPlace.label,
            fromPlaceId: fromPlace.value.place_id,
            toPlaceId: toPlace.value.place_id,

            carType: formData.carType,
            numberOfPersons: Number(formData.numberOfPersons),
            luggage: Number(formData.luggage),

            // ✅ Open text fields (stored exactly as entered)
            bookingDate: formData.bookingDate,
            bookingTime: formData.bookingTime,

            returnDate: formData.isRoundTrip ? formData.returnDate : null,
            returnTime: formData.isRoundTrip ? formData.returnTime : null,

            // 🔥 Pricing snapshot (immutable after this)
            pricing: {
                distanceMeters: distance.meters,
                distanceMiles: distance.miles,
                ratePerMile: pricing.ratePerMile,
                totalAmount: pricing.total,
                currency: "GBP",
            },
        };

        // --------------------------------
        // 3️⃣ Store draft in context
        // --------------------------------
        setDraftBooking(draftBooking);

        setLoading(false);

        // --------------------------------
        // 4️⃣ Navigate to payment page
        // --------------------------------
        navigate("/booking/payment");
    };


    return (
        <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Book Your Ride
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* FROM / TO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">From</label>
                        <GooglePlacesAutocomplete
                            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                            autocompletionRequest={autocompleteRequest}
                            selectProps={{
                                value: fromPlace,
                                onChange: setFromPlace,
                                placeholder: "Pickup location",
                                classNamePrefix: "react-select",
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">To</label>
                        <GooglePlacesAutocomplete
                            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                            autocompletionRequest={autocompleteRequest}
                            selectProps={{
                                value: toPlace,
                                onChange: setToPlace,
                                placeholder: "Drop-off location",
                                classNamePrefix: "react-select",
                            }}
                        />
                    </div>
                </div>

                {/* CAR TYPE */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        <Car className="inline h-4 w-4 mr-2" />
                        Car Type
                    </label>
                    <select
                        name="carType"
                        value={formData.carType}
                        onChange={handleChange}
                        className="input-field"
                        required
                    >
                        {CAR_TYPES.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* PASSENGERS / LUGGAGE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <Users className="inline h-4 w-4 mr-2" />
                            Passengers
                        </label>
                        <select
                            name="numberOfPersons"
                            value={formData.numberOfPersons}
                            onChange={handleChange}
                            className="input-field"
                        >
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <Briefcase className="inline h-4 w-4 mr-2" />
                            Luggage
                        </label>
                        <select
                            name="luggage"
                            value={formData.luggage}
                            onChange={handleChange}
                            className="input-field"
                        >
                            {[...Array(11)].map((_, i) => (
                                <option key={i} value={i}>
                                    {i}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ROUND TRIP */}
                <div className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg">
                    <input
                        type="checkbox"
                        name="isRoundTrip"
                        checked={formData.isRoundTrip}
                        onChange={handleChange}
                        className="w-5 h-5"
                    />
                    <span className="flex items-center font-semibold">
                        <RefreshCw className="h-5 w-5 mr-2 text-primary-600" />
                        Round Trip
                    </span>
                </div>

                {/* DATES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* BOOKING DATE & TIME */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <Calendar className="inline h-4 w-4 mr-2" />
                            Booking Date & Time
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            {/* DATE */}
                            <input
                                type="date"
                                name="bookingDate"
                                value={formData.bookingDate}
                                onChange={handleChange}
                                min={getTodayDate()}   // 🚫 no past dates
                                className="input-field"
                                required
                            />

                            {/* TIME */}
                            <input
                                type="time"
                                name="bookingTime"
                                value={formData.bookingTime}
                                onChange={handleChange}
                                min={
                                    formData.bookingDate === getTodayDate()
                                        ? getCurrentTime() // 🚫 no past time today
                                        : undefined
                                }
                                className="input-field"
                                required
                            />
                        </div>


                    </div>

                    {/* RETURN DATE & TIME (ROUND TRIP) */}
                    {formData.isRoundTrip && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <Calendar className="inline h-4 w-4 mr-2" />
                                Return Date & Time
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                {/* RETURN DATE */}
                                <input
                                    type="date"
                                    name="returnDate"
                                    value={formData.returnDate}
                                    onChange={handleChange}
                                    min={formData.bookingDate || getTodayDate()} // 🚫 before booking
                                    className="input-field"
                                    required
                                />

                                {/* RETURN TIME */}
                                <input
                                    type="time"
                                    name="returnTime"
                                    value={formData.returnTime}
                                    onChange={handleChange}
                                    min={
                                        formData.returnDate === formData.bookingDate
                                            ? formData.bookingTime // 🚫 before pickup time
                                            : undefined
                                    }
                                    className="input-field"
                                    required
                                />
                            </div>

                            <p className="text-xs text-gray-500 mt-1">
                                Return must be after pickup
                            </p>
                        </div>
                    )}

                </div>



                <button
                    disabled={loading}
                    className="w-full btn-primary flex justify-center items-center disabled:opacity-60"
                >
                    {loading ? "Calculating Price..." : "Continue to Payment"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </button>
            </form>
        </div>
    );
};

export default BookingForm;
