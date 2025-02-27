import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/appContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVSeries from './pages/TVSeries';
import Bookmarked from './pages/Bookmarked';
import './styles.css';

function App() {
  return (
    <React.StrictMode>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tv-series" element={<TVSeries />} />
              <Route path="/bookmarked" element={<Bookmarked />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </React.StrictMode>
  );
}

export default App;
