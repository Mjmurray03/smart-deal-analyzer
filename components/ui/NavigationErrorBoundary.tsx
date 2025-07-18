'use client';

import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface NavigationErrorBoundaryProps {
  children: React.ReactNode;
}

export function NavigationErrorBoundary({ 
  children
}: NavigationErrorBoundaryProps) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}

export default NavigationErrorBoundary;