import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="text-lg font-semibold text-slate-800">Welcome</div>
      <button 
        onClick={handleLogout}
        className="text-sm text-slate-600 hover:text-slate-900 font-medium"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
