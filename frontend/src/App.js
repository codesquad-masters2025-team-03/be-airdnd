import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import AccommodationListPage from './pages/AccommodationListPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/accommodations" element={<AccommodationListPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
