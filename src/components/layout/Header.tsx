import { ThemeToggle } from '../theme/ThemeToggle';
import { useAuthStore } from '../../stores/authStore';
import { LogOut } from 'lucide-react';
import { removeAuthToken } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Pulse365</h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user.firstName} {user.lastName}
              </span>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}
          
          {!user && <ThemeToggle />}
        </div>
      </div>
    </header>
  );
};