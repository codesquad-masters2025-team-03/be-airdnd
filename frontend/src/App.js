import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MainPage from './pages/MainPage';
import ChatPage from './pages/ChatPage';
import AccommodationListPage from './pages/AccommodationListPage';
import AccommodationDetailPage from './pages/AccommodationDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailPage from './pages/PaymentFailPage';
import ReservationListPage from './pages/ReservationListPage';
import AiChatPage from './pages/AiChatPage';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/accommodations" element={<AccommodationListPage/>}/>
                    <Route path="/accommodations/:id" element={<AccommodationDetailPage/>}/>
                    <Route path="/chatroom" element={<ChatPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/signup" element={<SignupPage/>}/>
                    <Route path="/payment/success" element={<PaymentSuccessPage/>}/>
                    <Route path="/payment/fail" element={<PaymentFailPage/>}/>
                    <Route path="/reservations" element={<ReservationListPage/>}/>
                    <Route path="/ai-chat" element={<AiChatPage/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
