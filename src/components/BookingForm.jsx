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

        if (!fromPlace || !toPlace) return;

        setLoading(true);

        // 1️⃣ Call pricing API
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

        // 2️⃣ Build booking draft (WITH pricing)
        const draftBooking = {
            source: "web",
            paymentMethod: "stripe",

            fromAddress: fromPlace.label,
            toAddress: toPlace.label,
            fromPlaceId: fromPlace.value.place_id,
            toPlaceId: toPlace.value.place_id,

            carType: formData.carType,
            numberOfPersons: Number(formData.numberOfPersons),
            luggage: Number(formData.luggage),

            pickupDateTime: new Date(
                `${formData.pickupDate}T${formData.pickupTime}`
            ),

            returnDateTime: formData.isRoundTrip
                ? new Date(`${formData.returnDate}T${formData.returnTime}`)
                : null,

            // 🔥 Pricing snapshot (IMPORTANT)
            pricing: {
                distanceMeters: distance.meters,
                distanceMiles: distance.miles,
                ratePerMile: pricing.ratePerMile,
                totalAmount: pricing.total,
                currency: "GBP",
            },
        };

        // 3️⃣ Store draft in context
        setDraftBooking(draftBooking);

        setLoading(false);

        // 4️⃣ Navigate to payment
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
                        <label className="block text-sm font-medium mb-2">
                            From
                        </label>
                        <GooglePlacesAutocomplete
                            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                            selectProps={{
                                value: fromPlace,
                                onChange: setFromPlace,
                                placeholder: "Pickup location",
                                classNamePrefix: "react-select",
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            To
                        </label>
                        <GooglePlacesAutocomplete
                            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
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
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <Calendar className="inline h-4 w-4 mr-2" />
                            Pickup Date & Time
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="date"
                                name="pickupDate"
                                value={formData.pickupDate}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                            <input
                                type="time"
                                name="pickupTime"
                                value={formData.pickupTime}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>
                    </div>

                    {formData.isRoundTrip && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <Calendar className="inline h-4 w-4 mr-2" />
                                Return Date & Time
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    name="returnDate"
                                    value={formData.returnDate}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                                <input
                                    type="time"
                                    name="returnTime"
                                    value={formData.returnTime}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
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
