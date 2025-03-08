import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVSeries from './pages/TVSeries';
import Bookmarked from './pages/Bookmarked';
import User from './pages/User';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './styles.css';

function App() {
  return (
    <React.StrictMode>
      <AppProvider>
        <Router>
          <Routes>
            {/* Layout wrapper for all main content pages */}
            <Route path="/" element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Public routes - accessible to all users */}
              <Route index element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tv-series" element={<TVSeries />} />

              {/* Protected routes - require authentication */}
              <Route
                path="/bookmarked"
                element={
                  <ProtectedRoute>
                    <Bookmarked />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user"
                element={
                  <ProtectedRoute>
                    <User />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </React.StrictMode>
  );
}

export default App;
