import { LoginForm } from '../../components/auth/LoginForm';
import { ThemeToggle } from '../../components/theme/ThemeToggle';

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-end px-4 sm:px-0 mb-6">
          <ThemeToggle />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to Pulse365
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Need to register your company?{' '}
          <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register here
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};