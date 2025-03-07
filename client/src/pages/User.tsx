import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function User() {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">User Profile</h1>

      {user && (
        <div className="bg-semi-dark-blue p-6 rounded-lg">
          <div className="mb-4">
            <h2 className="text-xl text-white mb-2">Name</h2>
            <p className="text-greyish-blue">{user.name}</p>
          </div>

          <div className="mb-4">
            <h2 className="text-xl text-white mb-2">Email</h2>
            <p className="text-greyish-blue">{user.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 px-4 py-2 bg-red text-white rounded-md hover:bg-white hover:text-black transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
