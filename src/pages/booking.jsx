// import React from "react";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Booking = () => {

    const [currentSlide, setCurrentSlide] = useState(0);
  
  const services = [
    {
      title: "Interior Detailing",
      description: "Complete interior cleaning including vacuum, steam cleaning, leather treatment, and sanitization",
      price: "Starting at $",
      //image: 
    },
    {
      title: "Exterior Detailing",
      description: "Professional wash, wax, paint correction, and ceramic coating options",
      price: "Starting at $",
      //image: "/api/placeholder/800/400"
    },
    {
      title: "Full Service Detail",
      description: "Comprehensive interior and exterior detailing package for complete vehicle restoration",
      price: "Starting at $",
      //image: "/api/placeholder/800/400"
    }
  ];

    return (
        <>
            <iframe src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1apZgQhXcZuUB6IMKN5usRC297BwibW1z8aOUOxNPhMmJ9Xy5gUihajbJ-bz3XlSkFM6TmHY3P?gv=true" 
                    style={{border: 0}} 
                    width="100%" 
                    height="600" 
                    frameborder="0">
            </iframe>
        </>
    );
};

export default Booking;