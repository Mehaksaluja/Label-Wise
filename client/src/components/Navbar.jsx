import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for user info when the component loads
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const logoutHandler = () => {
    // Remove user info from localStorage
    localStorage.removeItem('userInfo');
    // Reset the state and redirect to the login page
    setUserInfo(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white px-4 sm:px-6 lg:px-8 py-4 border-b border-secondary shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / App Name */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Label-Wise 🌿
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {userInfo ? (
            // If user is logged in, show their name and a logout button
            <>
              <span className="font-semibold">Welcome, {userInfo.name}!</span>
              <button
                onClick={logoutHandler}
                className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            // If user is logged out, show Login and Sign Up links
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;