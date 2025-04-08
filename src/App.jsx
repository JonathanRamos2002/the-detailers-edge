import React from "react";
import Navbar from "./components/Navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages";
import Services from "./pages/services";
import Portfolio from "./pages/portfolio";
import SignUp from "./pages/sign-up";
import Testimonials from "./pages/testimonials";
import Booking from "./pages/booking";
import Contact from "./pages/contact";
import Login from "./pages/login";
import Profile from "./pages/profile";
import AdminBookings from "./pages/admin/Bookings";
import PortfolioManagement from "./pages/admin/PortfolioManagement";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/Services" element={<Services />} />
          <Route
            path="/contact"
            element={<Contact />}
          />
          <Route path="/Portfolio" element={<Portfolio />} />
          <Route path="/Testimonials" element={<Testimonials />} />
          <Route path="/Booking" element={<Booking />} />
          <Route path="/sign-up" element={<SignUp/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/portfolio" element={<PortfolioManagement />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
