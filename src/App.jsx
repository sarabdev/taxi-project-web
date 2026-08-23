import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { BookingsProvider } from './contexts/BookingsContext';

import Home from './pages/Home';
import Payment from './pages/Payment';

function App() {
  return (
    <Router>
      <BookingsProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/booking/payment" element={<Payment />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
      </BookingsProvider>
    </Router>
  );
}

export default App;
