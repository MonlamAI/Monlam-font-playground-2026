import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App.tsx';
import { AdminApp } from './admin/AdminApp.tsx';
import { LicencePage } from './components/LicencePage.tsx';
import { I18nProvider } from './i18n/I18nProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/licence" element={<LicencePage />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  </StrictMode>
);
