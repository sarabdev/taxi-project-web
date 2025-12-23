import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Check, ArrowLeft } from 'lucide-react';
import { getAvailableCars } from '../data/cars';

const CarSelection = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [availableCars, setAvailableCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (!data) {
      navigate('/');
      return;
    }
    
    const booking = JSON.parse(data);
    setBookingData(booking);
    
    // Get available cars based on passengers and luggage
    const cars = getAvailableCars(
      parseInt(booking.passengers),
      parseInt(booking.luggage)
    );
    setAvailableCars(cars);
  }, [navigate]);

  const calculatePrice = (car) => {
    // Simplified pricing calculation
    // In real app, you'd calculate actual distance
    const estimatedMiles = 25;
    const oneWayPrice = car.basePrice + (car.pricePerMile * estimatedMiles);
    
    // If round trip, add return journey with 10% discount
    if (bookingData?.isRoundTrip) {
      const returnPrice = oneWayPrice * 0.9; // 10% discount on return
      const total = oneWayPrice + returnPrice;
      return total.toFixed(2);
    }
    
    return oneWayPrice.toFixed(2);
  };

  const handleSelectCar = (car) => {
    setSelectedCar(car);
  };

  const handleContinue = () => {
    if (!selectedCar) return;
    
    const updatedBooking = {
      ...bookingData,
      selectedCar,
      totalPrice: calculatePrice(selectedCar),
    };
    
    localStorage.setItem('bookingData', JSON.stringify(updatedBooking));
    navigate('/booking/payment');
  };

  if (!bookingData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Booking Form
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Select Your Vehicle
          </h1>
          <p className="text-gray-600 mt-2">
            Choose from our premium fleet of vehicles
          </p>
        </div>

        {/* Booking Summary */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Trip Details</h2>
            {bookingData.isRoundTrip && (
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                Round Trip - 10% Off Return
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="font-semibold">{bookingData.fromLocation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">To</p>
              <p className="font-semibold">{bookingData.toLocation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Passengers</p>
              <p className="font-semibold">{bookingData.passengers} {bookingData.passengers === '1' ? 'Person' : 'People'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Luggage</p>
              <p className="font-semibold">{bookingData.luggage} {bookingData.luggage === '1' ? 'Bag' : 'Bags'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500">Pickup Date & Time</p>
              <p className="font-semibold">
                {bookingData.pickupDate && new Date(bookingData.pickupDate).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })} at {bookingData.pickupTime}
              </p>
            </div>
            {bookingData.isRoundTrip && bookingData.returnDate && (
              <div>
                <p className="text-sm text-gray-500">Return Date & Time</p>
                <p className="font-semibold">
                  {new Date(bookingData.returnDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })} at {bookingData.returnTime}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Available Cars */}
        {availableCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {availableCars.map((car) => (
              <div
                key={car.id}
                className={`card cursor-pointer transition-all ${
                  selectedCar?.id === car.id
                    ? 'ring-4 ring-primary-500 shadow-xl'
                    : 'hover:shadow-xl'
                }`}
                onClick={() => handleSelectCar(car)}
              >
                <div className="relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  {selectedCar?.id === car.id && (
                    <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full p-2">
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {car.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  {car.description}
                </p>
                
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span className="text-sm">{car.capacity.passengers} passengers</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-5 w-5 mr-2" />
                    <span className="text-sm">{car.capacity.luggage} bags</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {car.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {car.features.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +{car.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Estimated Total</p>
                      <p className="text-2xl font-bold text-primary-600">
                        ${calculatePrice(car)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCar(car);
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        selectedCar?.id === car.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {selectedCar?.id === car.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-lg text-gray-600">
              No vehicles available for your requirements. Please adjust your passenger or luggage count.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary mt-4"
            >
              Modify Booking
            </button>
          </div>
        )}

        {/* Continue Button */}
        {selectedCar && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Vehicle</p>
                <p className="text-lg font-bold">{selectedCar.name} - ${calculatePrice(selectedCar)}</p>
              </div>
              <button
                onClick={handleContinue}
                className="btn-primary"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarSelection;

