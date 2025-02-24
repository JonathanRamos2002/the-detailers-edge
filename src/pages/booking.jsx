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
      //image:
    },
    {
      title: "Full Service Detail",
      description: "Comprehensive interior and exterior detailing package for complete vehicle restoration",
      price: "Starting at $",
      //image: 
    }
  ];
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
  };

    return (
        <div className="max-w-6xl mx-auto p-4">
        <div className="mb-8">
          <div className="relative h-96 overflow-hidden rounded-lg">
            {services.map((service, index) => (
              <div
                key={index}
                className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${
                  index === currentSlide ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{
                  transform: `translateX(${100 * (index - currentSlide)}%)`
                }}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-64 object-cover"
                />
                <div className="bg-white p-6 shadow-lg">
                  <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                  <p className="text-gray-600 mb-2">{service.description}</p>
                  <p className="text-lg font-semibold text-blue-600">{service.price}</p>
                </div>
              </div>
            ))}
            
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
    
            <iframe src= "https://ayoposi.neetocal.com/meeting-with-detailers-edge"
            //"https://calendar.google.com/calendar/appointments/schedules/AcZssZ1apZgQhXcZuUB6IMKN5usRC297BwibW1z8aOUOxNPhMmJ9Xy5gUihajbJ-bz3XlSkFM6TmHY3P?gv=true" 
                    style={{border: 0}} 
                    width="100%" 
                    height="600" 
                    frameborder="0">
            </iframe>
        
    </div>
    );
};

export default Booking;