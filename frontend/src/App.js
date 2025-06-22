import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import './App.css';

// Temporary AccommodationListPage component
const AccommodationListPage = () => {
  return <div>Accommodation List Page</div>;
};

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
