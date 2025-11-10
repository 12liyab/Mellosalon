import { useEffect, useState } from 'react';
import { Scissors } from 'lucide-react';

interface WelcomeProps {
  onComplete: () => void;
}

export default function Welcome({ onComplete }: WelcomeProps) {
  const [showMotto, setShowMotto] = useState(false);

  useEffect(() => {
    const mottoTimer = setTimeout(() => setShowMotto(true), 1500);
    const completeTimer = setTimeout(() => onComplete(), 4000);

    return () => {
      clearTimeout(mottoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8 flex justify-center">
          <img
            src="/Emblem Style Barber Shop Logo.png"
            alt="Stylish Cuts Logo"
            className="w-48 h-48 md:w-64 md:h-64 animate-fade-in"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-slide-up">
          Stylish Cuts
        </h1>

        <div className="flex items-center justify-center gap-3 mb-6">
          <Scissors className="text-red-600 animate-bounce" size={24} />
          <p className="text-2xl md:text-3xl text-gray-300 animate-slide-up animation-delay-300">
            Icen Shop
          </p>
          <Scissors className="text-red-600 animate-bounce animation-delay-500" size={24} />
        </div>

        {showMotto && (
          <p className="text-xl md:text-2xl text-gray-400 italic animate-fade-in animation-delay-1000">
            Where Style Meets Precision
          </p>
        )}
      </div>
    </div>
  );
}
