import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Sidebar from './Sidebar';

// Yeh Layout component logged-in users ke liye Sidebar aur Top Bar ko combine karta hai.
const Layout = ({ children }) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        {/* Top Bar for welcome message and logout */}
        <header className="bg-white h-16 flex items-center justify-end px-8 border-b border-secondary">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Welcome, {userInfo?.name}!</span>
            <button
              onClick={logoutHandler}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;