import { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
    X,
    ArrowRight,
    MapPin,
    Route,
    PoundSterling,
} from "lucide-react";
import { pricingService } from "../services/pricingService";

const GetQuoteDialog = ({ open, onClose }) => {
    // ✅ Hooks always first
    const [fromPlace, setFromPlace] = useState(null);
    const [toPlace, setToPlace] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quote, setQuote] = useState(null);
    const [error, setError] = useState(null);

    // Safe early return AFTER hooks
    if (!open) return null;

    const handleGetQuote = async () => {
        if (!fromPlace || !toPlace) {
            setError("Please select both pickup and drop-off locations.");
            return;
        }

        setLoading(true);
        setError(null);
        setQuote(null);

        const res = await pricingService.getQuote({
            fromPlaceId: fromPlace.value.place_id,
            toPlaceId: toPlace.value.place_id,
        });

        if (!res.ok) {
            setError(res.message || "Failed to calculate quote");
            setLoading(false);
            return;
        }

        setQuote(res.data);
        setLoading(false);
    };

    // 🇬🇧 UK-only restriction (stable & supported)
    const autocompleteRequest = {
        componentRestrictions: { country: "gb" },
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between px-8 py-6 border-b">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Get a Quote
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* BODY */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">

                    {/* LEFT: FORM */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                <MapPin className="inline h-4 w-4 mr-1 text-primary-600" />
                                Pickup Location (UK)
                            </label>
                            <GooglePlacesAutocomplete
                                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                                autocompletionRequest={autocompleteRequest}
                                selectProps={{
                                    value: fromPlace,
                                    onChange: setFromPlace,
                                    placeholder: "Enter pickup location",
                                    classNamePrefix: "react-select",
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                <MapPin className="inline h-4 w-4 mr-1 text-primary-600" />
                                Drop-off Location (UK)
                            </label>
                            <GooglePlacesAutocomplete
                                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                                autocompletionRequest={autocompleteRequest}
                                selectProps={{
                                    value: toPlace,
                                    onChange: setToPlace,
                                    placeholder: "Enter destination",
                                    classNamePrefix: "react-select",
                                }}
                            />
                        </div>

                        <button
                            onClick={handleGetQuote}
                            disabled={loading}
                            className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-lg disabled:opacity-60"
                        >
                            {loading ? "Calculating price..." : "Get Price"}
                            <ArrowRight className="h-5 w-5" />
                        </button>

                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    {/* RIGHT: RESULT */}
                    <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-between">
                        {!quote ? (
                            <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                                <Route className="h-12 w-12 mb-4 text-gray-400" />
                                <p className="text-lg font-medium">
                                    Enter UK locations to see your quote
                                </p>
                                <p className="text-sm mt-1">
                                    Prices are estimated and may vary.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">
                                        Estimated Trip Cost
                                    </h3>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Distance</span>
                                            <span className="font-semibold">
                                                {quote.distance.miles} miles
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t">
                                            <span className="flex items-center gap-2 text-gray-600">
                                                <PoundSterling className="h-5 w-5" />
                                                Total Price
                                            </span>
                                            <span className="text-3xl font-bold text-primary-600">
                                                £{quote.pricing.total}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-500 border-t pt-4">
                                    This is an estimated fare within the UK. Final price may vary
                                    based on traffic and route.
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GetQuoteDialog;
