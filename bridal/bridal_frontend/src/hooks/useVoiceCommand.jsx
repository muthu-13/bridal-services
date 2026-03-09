import { useState, useCallback } from 'react';

export const useVoiceCommands = (navigate) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');

  const handleVoiceCommand = useCallback((command) => {
    const normalizedCommand = command.toLowerCase().trim();
    setLastCommand(`Heard: "${normalizedCommand}"`);
    
    // Simple command matching
    if (normalizedCommand.includes('booking')) {
      navigate('/admin/bookings');
    } else if (normalizedCommand.includes('payment')) {
      navigate('/admin/payments');
    } else if (normalizedCommand.includes('report')) {
      navigate('/admin/report');
    } else if (normalizedCommand.includes('service')) {
      navigate('/admin/add-service');
    } else if (normalizedCommand.includes('contact')) {
      navigate('/admin/contacts');
    } else if (normalizedCommand.includes('offer')) {
      navigate('/admin/offers');
    } else if (normalizedCommand.includes('workshop')) {
      navigate('/admin/workshops');
    } else if (normalizedCommand.includes('staff')) {
      navigate('/admin/staff');
    } else if (normalizedCommand.includes('review')) {
      navigate('/admin/reviews');
    } else if (normalizedCommand.includes('inventory')) {
      navigate('/admin/inventory');
    } else if (normalizedCommand.includes('logout')) {
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  }, [navigate]);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in your browser. Please use Chrome.');
      return;
    }

    if (!isListening) {
      // Start listening
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript;
        handleVoiceCommand(command);
      };

      recognition.onerror = (event) => {
        console.log('Speech recognition error:', event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setIsListening(true);
    } else {
      // Stop listening - will happen automatically when speech ends
      setIsListening(false);
    }
  };

  return {
    isListening,
    lastCommand,
    toggleListening,
    browserSupportsSpeechRecognition: ('webkitSpeechRecognition' in window)
  };
};