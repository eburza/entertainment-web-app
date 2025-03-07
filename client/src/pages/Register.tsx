import { useAppContext } from '@/context/AppContext';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  // Get the register function from the context
  const { register, isError, errorMessage, isLoading } = useAppContext();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear password error when user types in password fields
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  // Handle password check
  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    } else if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    } else if (!passwordRegex.test(formData.password)) {
      setPasswordError(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate password
    if (!validatePassword()) {
      return; // Stop if password validation fails
    }

    try {
      // Register user
      const success = await register(formData.name, formData.email, formData.password);
      if (success) {
        // Redirect to login after successful registration
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-blue p-4">
      <div className="w-full max-w-md p-8 rounded-lg bg-semi-dark-blue">
        <h1 className="text-2xl font-bold text-white mb-6">Create an account</h1>

        {isError && (
          <div className="p-3 mb-4 bg-red-900/30 border border-red-500 rounded-md text-red-500">
            {errorMessage || 'There was an error creating your account'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="bg-transparent border-b border-greyish-blue text-white w-full px-0 py-2 focus:outline-none focus:border-white"
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="bg-transparent border-b border-greyish-blue text-white w-full px-0 py-2 focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="bg-transparent border-b border-greyish-blue text-white w-full px-0 py-2 focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="bg-transparent border-b border-greyish-blue text-white w-full px-0 py-2 focus:outline-none focus:border-white"
              required
            />
          </div>

          {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}

          <button
            type="submit"
            disabled={isLoading === true}
            className="w-full py-3 bg-red hover:bg-white hover:text-black transition-colors rounded-md mt-6"
          >
            {isLoading ? 'Creating account...' : 'Create an account'}
          </button>

          <p className="text-center text-white mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-red hover:text-white">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
