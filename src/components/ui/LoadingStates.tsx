import React from 'react';
import { Card, Skeleton } from './';

// Artist Card Skeleton with modern styling
export const ArtistCardSkeleton: React.FC = () => (
  <Card className="h-full overflow-hidden">
    <div className="aspect-square">
      <Skeleton className="w-full h-full" />
    </div>
    <div className="p-6 space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <Skeleton className="h-3 w-12 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </Card>
);

// Dashboard Skeleton
export const DashboardSkeleton: React.FC = () => (
  <Card className="p-6">
    <div className="flex items-center gap-2 mb-6">
      <Skeleton className="w-6 h-6" />
      <Skeleton className="h-6 w-1/3" />
    </div>
    
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="w-6 h-6" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-32" />
        </Card>
      ))}
    </div>

    {/* Content sections */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-5 w-1/3" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="w-12 h-4" />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  </Card>
);

// AI Component Skeleton
export const AIComponentSkeleton: React.FC = () => (
  <Card className="p-6">
    {/* Header */}
    <div className="flex items-center gap-2 mb-6">
      <Skeleton className="w-5 h-5" />
      <Skeleton className="h-6 w-1/3" />
    </div>
    
    {/* Input area */}
    <div className="space-y-4 mb-6">
      <div>
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
    
    {/* Results area */}
    <div className="space-y-4">
      <Skeleton className="h-5 w-1/3" />
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-3/4" />
        </Card>
      ))}
    </div>
  </Card>
);

// Playlist Skeleton
export const PlaylistSkeleton: React.FC = () => (
  <Card className="p-6">
    {/* Header */}
    <div className="flex items-center gap-2 mb-6">
      <Skeleton className="w-6 h-6" />
      <Skeleton className="h-7 w-1/3" />
    </div>
    
    {/* Input */}
    <div className="space-y-4 mb-6">
      <div>
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
      <div>
        <Skeleton className="h-4 w-1/6 mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 rounded border" />
          ))}
        </div>
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
    
    {/* Generated playlist */}
    <div className="space-y-6">
      {/* Playlist header */}
      <Card className="p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16 rounded" />
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-lg" />
          </div>
        </div>
      </Card>
      
      {/* Track list */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/6 mb-3" />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="w-12 h-4" />
          </div>
        ))}
      </div>
    </div>
  </Card>
);

// Search Results Skeleton
export const SearchSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center space-x-3 p-3 border-b border-gray-700/50 last:border-b-0">
        <Skeleton className="w-12 h-12 rounded" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="w-16 h-4" />
      </div>
    ))}
  </div>
);

// Loading Spinner with modern styling
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-blue-500',
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} ${color} animate-spin`}>
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Pulse animation for content loading
export const ContentPulse: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="animate-pulse opacity-60">
    {children}
  </div>
);

// Grid skeleton for artist listings
export const ArtistGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }, (_, i) => (
      <ArtistCardSkeleton key={i} />
    ))}
  </div>
);

// Infinite loading indicator
export const InfiniteLoadingIndicator: React.FC = () => (
  <div className="flex justify-center py-8">
    <Card className="p-4">
      <LoadingSpinner text="Loading more artists..." />
    </Card>
  </div>
);

// Error state with retry
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We encountered an error while loading the content.",
  onRetry
}) => (
  <Card className="p-8 text-center">
    <div className="w-16 h-16 mx-auto mb-4 text-red-400">
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 mb-6 max-w-md mx-auto">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn-primary"
      >
        Try Again
      </button>
    )}
  </Card>
);

// Empty state
interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  action,
  icon
}) => (
  <Card className="p-8 text-center">
    {icon && (
      <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 mb-6 max-w-md mx-auto">{message}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="btn-primary"
      >
        {action.label}
      </button>
    )}
  </Card>
);