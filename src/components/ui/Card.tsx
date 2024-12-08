import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
        'rounded-lg border border-gray-200/50 dark:border-gray-700/50',
        'shadow-sm hover:shadow-lg transition-all duration-300',
        'p-6',
        className
      )}
      {...props}
    />
  );
};