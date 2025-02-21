import React from "react";
import Navbar from "./components/Navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./pages";
import Services from "./pages/services";
import Portfolio from "./pages/portfolio";
import SignUp from "./pages/signup";
import Testimonials from "./pages/testimonials";
import Booking from "./pages/booking";
import Contact from "./pages/contact";
import Login from "./pages/login";
import Profile from "./pages/profile";


function App() {
  return (
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
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        </Routes>
    </Router>
  );
};

export default App
