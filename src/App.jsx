import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavBar } from './components/layout/TopNavBar';
import InsightSettings from './pages/InsightSettings';
import AdsDashboard from './pages/AdsDashboard';
import AdsOptimization from './pages/AdsOptimization';
import InsightDashboard from './pages/InsightDashboard';
import MedicalCheckup from './pages/MedicalCheckup';
import LandingPage from './pages/LandingPage';

// ── Layout: TopNavBar full-width + Sidebar left + Content right ───────────────
// TopNavBar: sticky at top (z-50)
// Below: Sidebar (left, h-auto) + main content (scrollable)
function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TopNavBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}

// ── React Router v7: flat routes (no nested <Routes> inside element) ────────
// Note: <Route element={<Comp />}><Routes>...</Routes></Route> breaks in RRv7.
// Each route renders AppLayout directly with the page component.
export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Standalone — no sidebar */}
          <Route path="/" element={<LandingPage />} />

          {/* App shell — with sidebar */}
          <Route path="/insight/settings" element={
            <AppLayout><InsightSettings /></AppLayout>
          } />
          <Route path="/insight/dashboard" element={
            <AppLayout><AdsDashboard /></AppLayout>
          } />
          <Route path="/insight/insight-dashboard" element={
            <AppLayout><InsightDashboard /></AppLayout>
          } />
          <Route path="/insight/ads-optimization" element={
            <AppLayout><AdsOptimization /></AppLayout>
          } />
          <Route path="/insight/medical-checkup" element={
            <AppLayout><MedicalCheckup /></AppLayout>
          } />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
