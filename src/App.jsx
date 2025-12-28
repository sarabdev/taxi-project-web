import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import { AuthProvider } from './contexts/AuthContext';
import { BookingsProvider } from './contexts/BookingsContext';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

import Dashboard from './pages/Dashboard';

import CarSelection from './pages/CarSelection';
import Payment from './pages/Payment';

import PersonalAccounts from './pages/PersonalAccounts';
import AirportTaxis from './pages/AirportTaxis';

import Login from './pages/Login';
import Register from './pages/Register';
import BookingFormPage from './pages/BookingForm';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingsProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                {/* Public pages */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Services */}
                <Route
                  path="/services/personal-accounts"
                  element={<PersonalAccounts />}
                />
                <Route
                  path="/services/airport-taxis"
                  element={<AirportTaxis />}
                />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard (after login) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Booking flow (protected) */}
                <Route
                  path="/booking"
                  element={
                    <ProtectedRoute>
                      <BookingFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking/cars"
                  element={
                    <ProtectedRoute>
                      <CarSelection />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking/payment"
                  element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </BookingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
