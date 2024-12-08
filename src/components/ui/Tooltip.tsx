import { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  icon?: boolean;
}

export const Tooltip = ({ content, children, icon = true }: TooltipProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="inline-flex items-center"
      >
        {children}
        {icon && <Info className="ml-1 h-4 w-4 text-gray-400 hover:text-gray-500" />}
      </div>
      {show && (
        <div className="absolute z-10 w-64 px-3 py-2 mt-1 text-sm text-white bg-gray-900 rounded-lg shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};