import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import '@/styles/globals.css';

import '@/components/charts/config/chartConfig';

// Import pages
import Dashboard from '@/pages/internal/Dashboard/Dashboard';
import Home from '@/pages/website/Home';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Routes>
        {/* <Route exact path="/" element={<Dashboard />} /> */}
        <Route exact path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;