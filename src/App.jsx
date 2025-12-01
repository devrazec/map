import React, { useEffect, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AOS from 'aos';

import './assets/css/app.css';
import 'aos/dist/aos.css';

import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Home />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
