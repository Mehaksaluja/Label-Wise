import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    // nav container: padding, bottom border with our secondary color
    <nav className="bg-background px-4 sm:px-6 lg:px-8 py-4 border-b border-secondary">
      {/* Flex container for alignment */}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / App Name */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Label-Wise 🌿
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-text hover:text-primary transition-colors duration-300"
          >
            Home
          </Link>
          {/* Styled as a button to encourage action */}
          <Link
            to="/analyze"
            className="bg-primary text-background font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity duration-300"
          >
            Analyze Product
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;