import { useAppContext } from '../context/AppContext';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the login function from the context
  const { login, isError, errorMessage, isLoading } = useAppContext();

  // Get the redirect path from the location state or default to '/'
  const redirectPath = location.state?.redirectPath || '/';

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate(redirectPath);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-dark-blue p-4">
      <div className="w-full max-w-md p-8 rounded-lg bg-semi-dark-blue">
        <h1 className="text-2xl font-bold text-white mb-2">Login to your account</h1>

        {isError && (
          <div className="p-3 mb-4 bg-red-900/30 border border-red-500 rounded-md text-red-500">
            {errorMessage || 'Invalid email or password'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent border-b border-greyish-blue text-white w-full px-0 py-2 focus:outline-none focus:border-white"
              required
            />
          </div>
          <div className="space-y-2">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent border-b border-greyish-blue text-white w-full px-0 py-2 focus:outline-none focus:border-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red hover:bg-white hover:text-black transition-colors rounded-md mt-6"
          >
            {isLoading ? 'Logging in...' : 'Login to your account'}
          </button>

          <p className="text-center text-white mt-6">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
