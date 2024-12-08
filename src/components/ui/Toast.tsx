import { Toaster as HotToaster, toast as hotToast } from 'react-hot-toast';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToastProps {
  t: { id: string };
  message: string;
  icon: any;
  iconColor: string;
  borderColor: string;
  progressColor: string;
}

const ToastContent = ({ t, message, icon: Icon, iconColor, borderColor, progressColor }: ToastProps) => {
  const handleDismiss = () => {
    hotToast.dismiss(t.id);
  };

  return (
    <div
      role="alert"
      onClick={handleDismiss}
      className={cn(
        'relative flex items-center w-[350px] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer mb-2 overflow-hidden',
        'transform transition-all duration-300 hover:scale-[1.02]',
        `border-l-4 ${borderColor}`
      )}
    >
      <Icon className={cn('h-5 w-5 mr-3 flex-shrink-0', iconColor)} />
      <p className="text-sm text-gray-900 dark:text-white flex-grow pr-6">{message}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="absolute right-2 top-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
      <div 
        className={cn(
          'absolute bottom-0 left-0 h-1 w-full transform origin-left',
          progressColor
        )}
        style={{
          animation: 'shrink 4000ms linear forwards',
        }}
      />
    </div>
  );
};

export const toast = {
  success: (message: string) => {
    hotToast.custom(
      (t) => (
        <ToastContent
          t={t}
          message={message}
          icon={CheckCircle}
          iconColor="text-green-500"
          borderColor="border-green-500"
          progressColor="bg-green-500"
        />
      ),
      { duration: 4000 }
    );
  },
  
  error: (message: string) => {
    hotToast.custom(
      (t) => (
        <ToastContent
          t={t}
          message={message}
          icon={AlertCircle}
          iconColor="text-red-500"
          borderColor="border-red-500"
          progressColor="bg-red-500"
        />
      ),
      { duration: 4000 }
    );
  },

  info: (message: string) => {
    hotToast.custom(
      (t) => (
        <ToastContent
          t={t}
          message={message}
          icon={Info}
          iconColor="text-blue-500"
          borderColor="border-blue-500"
          progressColor="bg-blue-500"
        />
      ),
      { duration: 4000 }
    );
  },
};

export const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
      gutter={8}
    />
  );
};