import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { Sidebar } from './components/layout/Sidebar';
import InsightSettings from './pages/InsightSettings';
import AdsDashboard from './pages/AdsDashboard';
import InsightDashboard from './pages/InsightDashboard';

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/insight/settings" replace />} />
            <Route path="/insight/settings" element={<InsightSettings />} />
            <Route path="/insight/dashboard" element={<AdsDashboard />} />
            <Route path="/insight/insight-dashboard" element={<InsightDashboard />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ToastProvider>
  );
}
