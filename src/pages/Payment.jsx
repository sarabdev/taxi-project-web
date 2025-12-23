import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, CheckCircle } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (!data) {
      navigate('/');
      return;
    }
    
    const booking = JSON.parse(data);
    if (!booking.selectedCar) {
      navigate('/booking/cars');
      return;
    }
    
    setBookingData(booking);
  }, [navigate]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Format card number
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.slice(0, 19);
    }
    
    // Format expiry
    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) value = value.slice(0, 5);
    }
    
    // Format CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProcessing(false);
    setCompleted(true);
    
    // Clear booking data
    setTimeout(() => {
      localStorage.removeItem('bookingData');
      navigate('/');
    }, 3000);
  };

  if (!bookingData) {
    return null;
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your booking. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="space-y-3 text-left">
                {bookingData.isRoundTrip && (
                  <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm font-semibold mb-2">
                    ✓ Round Trip Booked
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-semibold">{bookingData.selectedCar.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-semibold">{bookingData.fromLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-semibold">{bookingData.toLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup:</span>
                  <span className="font-semibold text-sm">
                    {bookingData.pickupDate && new Date(bookingData.pickupDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })} at {bookingData.pickupTime}
                  </span>
                </div>
                {bookingData.isRoundTrip && bookingData.returnDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return:</span>
                    <span className="font-semibold text-sm">
                      {new Date(bookingData.returnDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })} at {bookingData.returnTime}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-3 mt-3">
                  <span className="text-gray-600">Total Paid:</span>
                  <span className="text-2xl font-bold text-primary-600">${bookingData.totalPrice}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting to home page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/booking/cars')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Vehicle Selection
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Payment Details
          </h1>
          <p className="text-gray-600 mt-2">
            Complete your booking with secure payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Card Information</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Lock className="h-4 w-4 mr-1" />
                  Secure Payment
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className="input-field pr-12"
                      required
                    />
                    <CreditCard className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={cardData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <Lock className="inline h-4 w-4 mr-1" />
                    Your payment information is encrypted and secure. We use industry-standard security measures.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className={`w-full btn-primary ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </span>
                  ) : (
                    `Pay $${bookingData.totalPrice}`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>
              
              <div className="mb-6">
                <img
                  src={bookingData.selectedCar.image}
                  alt={bookingData.selectedCar.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-semibold">{bookingData.selectedCar.name}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">Trip Details</p>
                  <div className="space-y-2 text-sm">
                    {bookingData.isRoundTrip && (
                      <div className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-semibold mb-2">
                        Round Trip - 10% Off Return
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">From:</span>
                      <span className="font-medium">{bookingData.fromLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To:</span>
                      <span className="font-medium">{bookingData.toLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup:</span>
                      <span className="font-medium text-xs">
                        {bookingData.pickupDate && new Date(bookingData.pickupDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })} {bookingData.pickupTime}
                      </span>
                    </div>
                    {bookingData.isRoundTrip && bookingData.returnDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Return:</span>
                        <span className="font-medium text-xs">
                          {new Date(bookingData.returnDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })} {bookingData.returnTime}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passengers:</span>
                      <span className="font-medium">{bookingData.passengers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Luggage:</span>
                      <span className="font-medium">{bookingData.luggage}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2 text-sm mb-3">
                    {bookingData.isRoundTrip ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Outbound Trip:</span>
                          <span>${((parseFloat(bookingData.totalPrice) / 1.9) * 1).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Return Trip:</span>
                          <span>${((parseFloat(bookingData.totalPrice) / 1.9) * 0.9).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Discount (10%):</span>
                          <span>-${((parseFloat(bookingData.totalPrice) / 1.9) * 0.1).toFixed(2)}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Fare:</span>
                          <span>${bookingData.selectedCar.basePrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Distance Charge:</span>
                          <span>${(parseFloat(bookingData.totalPrice) - bookingData.selectedCar.basePrice).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${bookingData.totalPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

