import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { WalletProvider } from './contexts/WalletContext';
import { RewardsProvider } from './contexts/RewardsContext';
import { DealsProvider } from './contexts/DealsContext';
import { BrandsProvider } from './contexts/BrandsContext';
import { CouponsProvider } from './contexts/CouponsContext';
import { StoresProvider } from './contexts/StoresContext';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import './src/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <WalletProvider>
            <RewardsProvider>
              <DealsProvider>
                <BrandsProvider>
                  <CouponsProvider>
                    <StoresProvider>
                      <App />
                      <Toaster 
                        position="top-center"
                        toastOptions={{
                          duration: 3000,
                          style: {
                            background: '#111811',
                            color: '#fff',
                            fontWeight: 'bold',
                            borderRadius: '12px',
                          },
                          success: {
                            iconTheme: {
                              primary: '#13ec13',
                              secondary: '#111811',
                            },
                          },
                          error: {
                            iconTheme: {
                              primary: '#ef4444',
                              secondary: '#fff',
                            },
                          },
                        }}
                      />
                    </StoresProvider>
                  </CouponsProvider>
                </BrandsProvider>
              </DealsProvider>
            </RewardsProvider>
          </WalletProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
