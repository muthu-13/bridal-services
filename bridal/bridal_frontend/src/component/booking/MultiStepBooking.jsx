import React, { useState } from "react";
import BookingPage from "./BookingPage";
import PaymentPage from "./PaymentPage";

const MultiStepBooking = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState(null);
  const [virtualData, setVirtualData] = useState(null);

  const handleNextFromBooking = (data) => {
    setBookingData(data);
    setStep(2); // Go directly to PaymentPage
  };

  const handleBack = () => {
    setStep(1); // Go back to BookingPage
  };

  return (
    <div>
      {step === 1 && <BookingPage onNext={handleNextFromBooking} />}
      
      {step === 2 && (
        <PaymentPage 
          bookingData={bookingData} 
          virtualData={virtualData} 
          onBack={handleBack} 
        />
      )}
    </div>
  );
};

export default MultiStepBooking;
