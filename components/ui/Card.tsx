import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

/**
 * Reusable card component with white background, shadow, and rounded corners
 * Uses Tailwind CSS for styling
 */
export default function Card({ children, title, className = '' }: CardProps) {
  // Base styles for the card
  const baseStyles = 'bg-white rounded-lg shadow-md overflow-hidden';
  
  // Optional title styles
  const titleStyles = 'px-6 py-4 border-b border-gray-200';
  
  // Content styles
  const contentStyles = 'p-6';

  return (
    <div className={`${baseStyles} ${className}`}>
      {title && (
        <div className={titleStyles}>
          <h3 className="text-lg font-medium text-gray-900">
            {title}
          </h3>
        </div>
      )}
      <div className={contentStyles}>
        {children}
      </div>
    </div>
  );
} 