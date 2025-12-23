import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Briefcase, ArrowRight, CheckCircle, Clock, Shield, Star, RefreshCw, Calendar } from 'lucide-react';
import { airports } from '../data/airports';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fromType: 'airport',
    fromLocation: '',
    toType: 'custom',
    toLocation: '',
    passengers: 1,
    luggage: 1,
    isRoundTrip: false,
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store booking data and navigate to car selection
    localStorage.setItem('bookingData', JSON.stringify(formData));
    navigate('/booking/cars');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Journey, Our Priority
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Premium airport taxi service with professional drivers and comfortable vehicles
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="relative -mt-16 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Ride</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <select
                    name="fromType"
                    value={formData.fromType}
                    onChange={handleChange}
                    className="input-field mb-3"
                    required
                  >
                    <option value="airport">Airport</option>
                    <option value="custom">Custom Location</option>
                  </select>
                  {formData.fromType === 'airport' ? (
                    <select
                      name="fromLocation"
                      value={formData.fromLocation}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Airport</option>
                      {airports.map(airport => (
                        <option key={airport.id} value={airport.code}>
                          {airport.name} ({airport.code})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="fromLocation"
                      value={formData.fromLocation}
                      onChange={handleChange}
                      placeholder="Enter pickup location"
                      className="input-field"
                      required
                    />
                  )}
                </div>

                {/* To Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <select
                    name="toType"
                    value={formData.toType}
                    onChange={handleChange}
                    className="input-field mb-3"
                    required
                  >
                    <option value="airport">Airport</option>
                    <option value="custom">Custom Location</option>
                  </select>
                  {formData.toType === 'airport' ? (
                    <select
                      name="toLocation"
                      value={formData.toLocation}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Airport</option>
                      {airports.map(airport => (
                        <option key={airport.id} value={airport.code}>
                          {airport.name} ({airport.code})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="toLocation"
                      value={formData.toLocation}
                      onChange={handleChange}
                      placeholder="Enter destination"
                      className="input-field"
                      required
                    />
                  )}
                </div>

                {/* Passengers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-2" />
                    Number of Passengers
                  </label>
                  <select
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                    ))}
                  </select>
                </div>

                {/* Luggage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline h-4 w-4 mr-2" />
                    Luggage Count
                  </label>
                  <select
                    name="luggage"
                    value={formData.luggage}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Bag' : 'Bags'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Round Trip Toggle */}
              <div className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg border border-primary-200">
                <input
                  type="checkbox"
                  id="isRoundTrip"
                  name="isRoundTrip"
                  checked={formData.isRoundTrip}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                />
                <label htmlFor="isRoundTrip" className="flex items-center cursor-pointer">
                  <RefreshCw className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="font-semibold text-gray-900">Round Trip</span>
                  <span className="ml-2 text-sm text-gray-600">(Save on return journey!)</span>
                </label>
              </div>

              {/* Date and Time Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pickup Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Pickup Date & Time
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
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

                {/* Return Date & Time (only if round trip) */}
                {formData.isRoundTrip && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Return Date & Time
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        min={formData.pickupDate || new Date().toISOString().split('T')[0]}
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

              <button type="submit" className="w-full btn-primary flex items-center justify-center">
                Find Available Cars
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AirportRide?
            </h2>
            <p className="text-lg text-gray-600">
              Experience the difference with our premium service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reliable Service</h3>
              <p className="text-gray-600">
                99% on-time arrival rate with professional drivers
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
              <p className="text-gray-600">
                Round-the-clock service for all your travel needs
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                Licensed drivers and fully insured vehicles
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Fleet</h3>
              <p className="text-gray-600">
                Modern, clean vehicles with top-notch amenities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Book Your Ride?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Get started in minutes and enjoy a comfortable journey
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;

