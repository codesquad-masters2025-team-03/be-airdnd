import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MainPage from './pages/MainPage';
import ChatRoom from './components/ChatRoom';
import AccommodationListPage from './pages/AccommodationListPage';
import AccommodationDetailPage from './pages/AccommodationDetailPage';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/accommodations" element={<AccommodationListPage/>}/>
                    <Route path="/accommodations/:id" element={<AccommodationDetailPage/>}/>
                    <Route path="/chatroom" element={<ChatRoom/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
