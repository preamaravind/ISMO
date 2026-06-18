import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Projects', path: '/projects' },
    { name: 'Tasks', path: '/tasks' }
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="h-16 flex items-center px-6 text-xl font-bold border-b border-slate-800">
        ProjectFlow
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="text-sm font-medium">{user?.full_name}</div>
        <div className="text-xs text-slate-400">{user?.email}</div>
      </div>
    </div>
  );
};

export default Sidebar;
