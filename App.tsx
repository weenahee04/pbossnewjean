import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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
import Register from './screens/Register';
import ForgotPassword from './screens/ForgotPassword';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const { isLoggedIn, user } = useAuth();

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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              <Route path="/" element={<ProtectedRoute><Home user={user!} /></ProtectedRoute>} />
              <Route path="/scan" element={<ProtectedRoute><Scan user={user!} /></ProtectedRoute>} />
              <Route path="/rewards" element={<ProtectedRoute><Rewards user={user!} /></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><Wallet user={user!} /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile user={user!} /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/stores" element={<ProtectedRoute><StoreFinder /></ProtectedRoute>} />
              <Route path="/coupons" element={<ProtectedRoute><Coupons /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings user={user!} /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          {isLoggedIn && <Navbar />}
        </div>
      </div>
    </Router>
  );
};

export default App;