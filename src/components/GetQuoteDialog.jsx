import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { ArrowRight, Briefcase, Calendar, Car, ChevronDown, Mail, MapPin, Phone, PoundSterling, RefreshCw, Route, User, Users, X } from "lucide-react";
import { useBookings } from "../contexts/BookingsContext";
import { pricingService } from "../services/pricingService";

const CAR_TYPES = [
  { value: "sedan", label: "Sedan" },
  { value: "executive", label: "Executive" },
  { value: "mpv", label: "MPV" },
  { value: "suv", label: "SUV" },
  { value: "van", label: "Van" },
];
const autocompleteRequest = { componentRestrictions: { country: "gb" } };
const today = () => new Date().toISOString().split("T")[0];

const BookingSelect = ({ children, ...props }) => (
  <div className="relative mt-2">
    <select {...props} className="input-field select-field peer">
      {children}
    </select>
    <ChevronDown
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors peer-focus:text-primary-600"
      strokeWidth={2.25}
    />
  </div>
);

const GetQuoteDialog = ({ open, onClose, mode = "quote" }) => {
  const navigate = useNavigate();
  const { setDraftBooking } = useBookings();
  const [fromPlace, setFromPlace] = useState(null);
  const [toPlace, setToPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);
  const [activeMode, setActiveMode] = useState(mode);
  const [trip, setTrip] = useState({
    carType: "sedan", numberOfPersons: 1, luggage: 1,
    bookingDate: "", bookingTime: "", isRoundTrip: false,
    returnDate: "", returnTime: "",
    customerName: "", customerEmail: "", customerPhone: "",
  });

  useEffect(() => {
    if (open) setActiveMode(mode);
  }, [mode, open]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setTrip((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setQuote(null);
  };

  const validateTrip = () => {
    if (!fromPlace || !toPlace) return "Please select both pickup and drop-off locations.";
    if (activeMode === "quote") return null;
    if (!trip.bookingDate || !trip.bookingTime) return "Please choose a pickup date and time.";
    const pickup = new Date(`${trip.bookingDate}T${trip.bookingTime}`);
    if (Number.isNaN(pickup.getTime()) || pickup < new Date()) return "Pickup date and time must be in the future.";
    if (trip.isRoundTrip) {
      if (!trip.returnDate || !trip.returnTime) return "Please choose a return date and time.";
      const returning = new Date(`${trip.returnDate}T${trip.returnTime}`);
      if (Number.isNaN(returning.getTime()) || returning <= pickup) return "Return date and time must be after pickup.";
    }
    if (!trip.customerName.trim() || !trip.customerEmail.trim() || !trip.customerPhone.trim()) {
      return "Please enter the lead passenger’s name, email and phone number.";
    }
    if (!/^\S+@\S+\.\S+$/.test(trip.customerEmail)) return "Please enter a valid email address.";
    return null;
  };

  const saveDraftAndContinue = (quoteData) => {
    setDraftBooking({
      tempId: `draft_${Date.now()}`, source: "website", paymentMethod: "stripe",
      fromAddress: fromPlace.label, toAddress: toPlace.label,
      fromPlaceId: fromPlace.value.place_id, toPlaceId: toPlace.value.place_id,
      carType: trip.carType, numberOfPersons: Number(trip.numberOfPersons), luggage: Number(trip.luggage),
      bookingDate: trip.bookingDate, bookingTime: trip.bookingTime,
      returnDate: trip.isRoundTrip ? trip.returnDate : null,
      returnTime: trip.isRoundTrip ? trip.returnTime : null,
      customerName: trip.customerName.trim(),
      customerEmail: trip.customerEmail.trim(),
      customerPhone: trip.customerPhone.trim(),
      pricing: { distanceMiles: quoteData.distance.miles, totalAmount: quoteData.pricing.total, currency: "GBP" },
    });
    onClose();
    navigate("/booking/payment");
  };

  const handleGetQuote = async () => {
    const validationError = validateTrip();
    if (validationError) { setError(validationError); return; }
    setLoading(true); setError(null); setQuote(null);
    const res = await pricingService.getQuote({
      fromPlaceId: fromPlace.value.place_id,
      toPlaceId: toPlace.value.place_id,
    });
    if (!res.ok) {
      setError(res.message || "Failed to calculate quote");
      setLoading(false);
      return;
    }
    if (activeMode === "book") {
      saveDraftAndContinue(res.data);
      return;
    }
    setQuote(res.data);
    setLoading(false);
  };

  const handleBook = () => {
    setActiveMode("book");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:px-4 sm:py-6">
      <div className={`booking-dialog-panel bg-white rounded-none sm:rounded-2xl w-full ${activeMode === "quote" ? "max-w-2xl" : "max-w-5xl"} h-[100dvh] sm:h-auto sm:max-h-[92dvh] shadow-2xl relative overflow-x-hidden overflow-y-auto`}>
        <div className="booking-dialog-header sticky top-0 z-10 flex items-center justify-between gap-4 px-4 sm:px-8 pb-4 sm:py-5 border-b bg-white">
          <div><p className="text-sm font-semibold text-primary-600">{activeMode === "book" ? "Book without an account" : "Free quotation"}</p><h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{activeMode === "book" ? "Book your ride" : "Instant quote"}</h2></div>
          <button onClick={onClose} aria-label="Close quote" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-slate-100 hover:text-gray-700"><X className="h-6 w-6" /></button>
        </div>

        <div className={`booking-dialog-body gap-6 p-4 sm:p-8 ${activeMode === "quote" ? "block" : "grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr]"}`}>
          <div className="min-w-0 space-y-5">
            <div className={`grid grid-cols-1 gap-4 ${activeMode === "book" ? "md:grid-cols-2" : ""}`}>
              <div>
                <label className="block text-sm font-semibold mb-2"><MapPin className="inline h-4 w-4 mr-1 text-primary-600" />Pickup location</label>
                <GooglePlacesAutocomplete apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} autocompletionRequest={autocompleteRequest} selectProps={{ value: fromPlace, onChange: (value) => { setFromPlace(value); setQuote(null); }, placeholder: "Enter pickup location", classNamePrefix: "react-select" }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2"><MapPin className="inline h-4 w-4 mr-1 text-primary-600" />Drop-off location</label>
                <GooglePlacesAutocomplete apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} autocompletionRequest={autocompleteRequest} selectProps={{ value: toPlace, onChange: (value) => { setToPlace(value); setQuote(null); }, placeholder: "Enter destination", classNamePrefix: "react-select" }} />
              </div>
            </div>

            {activeMode === "book" && <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="text-sm font-semibold"><Users className="inline h-4 w-4 mr-1" />Passengers
                <BookingSelect name="numberOfPersons" value={trip.numberOfPersons} onChange={handleChange}>{[...Array(10)].map((_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</BookingSelect>
              </label>
              <label className="text-sm font-semibold"><Briefcase className="inline h-4 w-4 mr-1" />Suitcases
                <BookingSelect name="luggage" value={trip.luggage} onChange={handleChange}>{[...Array(11)].map((_, index) => <option key={index} value={index}>{index}</option>)}</BookingSelect>
              </label>
              <label className="text-sm font-semibold"><Car className="inline h-4 w-4 mr-1" />Vehicle
                <BookingSelect name="carType" value={trip.carType} onChange={handleChange}>{CAR_TYPES.map((car) => <option key={car.value} value={car.value}>{car.label}</option>)}</BookingSelect>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-sm font-semibold"><Calendar className="inline h-4 w-4 mr-1" />Pickup date<input type="date" name="bookingDate" min={today()} value={trip.bookingDate} onChange={handleChange} className="input-field mt-2" /></label>
              <label className="text-sm font-semibold">Pickup time<input type="time" name="bookingTime" value={trip.bookingTime} onChange={handleChange} className="input-field mt-2" /></label>
            </div>

            <label className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg font-semibold cursor-pointer">
              <input type="checkbox" name="isRoundTrip" checked={trip.isRoundTrip} onChange={handleChange} className="w-5 h-5" /><RefreshCw className="h-5 w-5 text-primary-600" />Add a return journey
            </label>
            {trip.isRoundTrip && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-sm font-semibold">Return date<input type="date" name="returnDate" min={trip.bookingDate || today()} value={trip.returnDate} onChange={handleChange} className="input-field mt-2" /></label>
              <label className="text-sm font-semibold">Return time<input type="time" name="returnTime" value={trip.returnTime} onChange={handleChange} className="input-field mt-2" /></label>
            </div>}

            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Lead passenger</h3>
              <div className="space-y-4">
                <label className="block text-sm font-semibold"><User className="inline h-4 w-4 mr-1" />Full name
                  <input type="text" name="customerName" value={trip.customerName} onChange={handleChange} autoComplete="name" placeholder="Passenger name" className="input-field mt-2" />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block text-sm font-semibold"><Mail className="inline h-4 w-4 mr-1" />Email
                    <input type="email" name="customerEmail" value={trip.customerEmail} onChange={handleChange} autoComplete="email" placeholder="you@example.com" className="input-field mt-2" />
                  </label>
                  <label className="block text-sm font-semibold"><Phone className="inline h-4 w-4 mr-1" />Phone
                    <input type="tel" name="customerPhone" value={trip.customerPhone} onChange={handleChange} autoComplete="tel" placeholder="UK mobile number" className="input-field mt-2" />
                  </label>
                </div>
              </div>
            </div>
            </>}

            <button onClick={handleGetQuote} disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-lg disabled:opacity-60">{loading ? "Calculating price..." : activeMode === "book" ? "Continue to secure payment" : "Get instant quote"}<ArrowRight className="h-5 w-5" /></button>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          </div>

          {(activeMode === "book" || quote) && <div className={`min-w-0 bg-gray-50 rounded-xl p-5 sm:p-6 flex flex-col justify-center ${activeMode === "quote" ? "mt-6" : "min-h-56 sm:min-h-64"}`}>
            {activeMode === "book" ? <div className="text-center text-gray-500 flex flex-col items-center"><Route className="h-12 w-12 mb-4 text-gray-400" /><p className="text-lg font-medium">One simple booking form</p><p className="text-sm mt-1">Complete this form once, then securely pay and receive confirmation by email.</p></div> :
              <div className="space-y-5">
                <div><p className="text-sm text-gray-500">Estimated fare</p><div className="flex items-center text-primary-600 mt-1"><PoundSterling className="h-7 w-7" /><span className="text-4xl font-bold">{quote.pricing.total}</span></div></div>
                <div className="flex justify-between border-y py-3 text-sm"><span className="text-gray-600">Distance</span><span className="font-semibold">{quote.distance.miles} miles</span></div>
                <button onClick={handleBook} className="w-full btn-primary flex items-center justify-center gap-2">Book this ride<ArrowRight className="h-5 w-5" /></button>
                <p className="text-xs text-gray-500 text-center">No account needed. Continue only if you want to book.</p>
              </div>}
          </div>}
        </div>
      </div>
    </div>
  );
};

export default GetQuoteDialog;
