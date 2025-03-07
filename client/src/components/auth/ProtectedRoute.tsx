import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ProtectedRouteProps } from '../../types/interface';

// ProtectedRoute component
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAppContext();
  const location = useLocation();

  // If still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-blue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the children
  return <>{children}</>;
}
