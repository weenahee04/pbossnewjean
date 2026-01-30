
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './screens/Home';
import Scan from './screens/Scan';
import Rewards from './screens/Rewards';
import Wallet from './screens/Wallet';
import Profile from './screens/Profile';
import History from './screens/History';
import Notifications from './screens/Notifications';
import StoreFinder from './screens/StoreFinder';
import Coupons from './screens/Coupons';
import Settings from './screens/Settings';
import Login from './screens/Login';
import ForgotPassword from './screens/ForgotPassword';
import Navbar from './components/Navbar';
import { User } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState<User>({
    name: 'อเล็กซ์ จอห์นสัน',
    tier: 'Platinum',
    memberSince: '2023',
    points: 4250,
    walletBalance: 1240.50,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlYvFoqSDUxOAnBxwGGtCvdgMEzqRY-vU9tzWNOIgy5QHhYYqC2zSU-LtzAAkZ6stX5jCsgSvO1_QSxcb_N0QFUowBUtIjhugEjw7_rp_Ele9evcJuOQfPVTh4gxIS4Na12G-slm1AK_4R6hjeh2Db7ywOHP-LHKoCtPo0hJDJlwgQ7571Cms90SxMSGGYHs9r0ca-W461C-EwJBVz0NWu6Rk61-aUjohKWKNTHjqUR4ddNbDSvQkC0BO_RNoeK0AyztC-7C2zUzed'
  });

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <div className="min-h-screen font-sans flex justify-center py-0 md:py-8">
        <div className="w-full max-w-md bg-white shadow-2xl relative flex flex-col min-h-screen overflow-x-hidden md:rounded-[3rem] md:border-[8px] md:border-dark-green/5">
          
          {/* Internal App Background Decoration */}
          <div className="app-bg-pattern">
            <div className="bg-blob -top-20 -right-20"></div>
            <div className="bg-blob top-[40%] -left-40 scale-150"></div>
            <div className="bg-blob -bottom-20 -right-20 opacity-[0.03]"></div>
          </div>

          <div className="relative z-10 flex flex-col flex-1">
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {isLoggedIn ? (
                <>
                  <Route path="/" element={<Home user={user} />} />
                  <Route path="/scan" element={<Scan user={user} />} />
                  <Route path="/rewards" element={<Rewards user={user} />} />
                  <Route path="/wallet" element={<Wallet user={user} />} />
                  <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/stores" element={<StoreFinder />} />
                  <Route path="/coupons" element={<Coupons />} />
                  <Route path="/settings" element={<Settings user={user} setUser={setUser} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" replace />} />
              )}
            </Routes>
          </div>
          {isLoggedIn && <Navbar />}
        </div>
      </div>
    </Router>
  );
};

export default App;