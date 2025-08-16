import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    // Main container with vertical padding
    <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
        <span>Instantly decode your </span>
        <span className="text-primary">food labels.</span>
      </h1>

      {/* Subheading */}
      <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
        Stop guessing. Paste any product's ingredients and get a simple, clear
        health and nutrition analysis powered by AI. Make smarter choices, effortlessly.
      </p>

      {/* Call to Action Button */}
      <div className="mt-10">
        <Link
          to="/analyze"
          className="bg-primary text-white font-semibold text-lg px-8 py-3 rounded-lg shadow-md hover:opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default HomePage;