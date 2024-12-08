import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '../../components/theme/ThemeToggle';
import { useAuthStore } from '../../stores/authStore';

export const RegistrationSuccessPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    // If no user is authenticated, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    // Set up redirect timer
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Registration Successful!
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Welcome to Pulse365, {user.firstName}!
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6 text-center">
            <p className="text-gray-700 dark:text-gray-300">
              Your account has been created successfully. You'll be redirected to your dashboard shortly.
            </p>
            
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn inline-flex items-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};