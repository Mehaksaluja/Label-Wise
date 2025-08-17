import { Link } from 'react-router-dom';

// Yeh Navbar sirf logged-out users ke liye hai.
const Navbar = () => {
  return (
    <header className="bg-white px-4 sm:px-6 lg:px-8 py-4 border-b border-secondary shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Label-Wise 🌿
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/login"
            className="text-text hover:text-primary transition-colors duration-300 font-semibold"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-primary text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;