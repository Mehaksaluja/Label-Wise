import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, History, LogOut } from 'lucide-react'; // Added LogOut icon

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
        }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-semibold">{children}</span>
    </Link>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/'); // Redirect to landing page on logout
    window.location.reload(); // Force a reload to clear all state
  };

  return (
    <aside className="w-64 bg-white h-screen fixed top-0 left-0 border-r border-secondary p-4 flex flex-col">
      {/* Top Section: Logo and Navigation */}
      <div>
        <div className="text-3xl font-bold text-primary mb-10 px-2">
          Label-Wise 🌿
        </div>
        <nav className="flex flex-col space-y-2">
          <NavLink to="/dashboard" icon={Home}>Dashboard</NavLink>
          <NavLink to="/analyze" icon={FileText}>Analyze</NavLink>
          <NavLink to="/history" icon={History}>History</NavLink>
        </nav>
      </div>

      {/* Bottom Section: User Profile and Logout */}
      <div className="mt-auto">
        <div className="border-t border-secondary pt-4">
          <div className="flex items-center gap-3 px-2">
            {/* You can add a user avatar here later */}
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-primary">
              {userInfo?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-bold">{userInfo?.name}</p>
              <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
            </div>
          </div>
          <button
            onClick={logoutHandler}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 mt-4 text-left"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;