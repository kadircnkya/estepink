import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('No #root element found');

// Sayfa yenilendiğinde tarayıcının eski kaydırma konumuna atlamasını engelle
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (!window.location.hash) window.scrollTo(0, 0);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
