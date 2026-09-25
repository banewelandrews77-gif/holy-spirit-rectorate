import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SubChurchStAnthonyPage } from './pages/SubChurchStAnthonyPage';
import { SubChurchStMatthewPage } from './pages/SubChurchStMatthewPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { EventsCalendarPage } from './pages/EventsCalendarPage';
import { SacramentsPage } from './pages/SacramentsPage';
import { GalleryPage } from './pages/GalleryPage';
import { DonatePage } from './pages/DonatePage';
import { ContactPage } from './pages/ContactPage';
import { ReceiptViewPage } from './pages/ReceiptViewPage';

// Admin CMS
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminAboutPage } from './pages/admin/AdminAboutPage';
import { AdminTimetablePage } from './pages/admin/AdminTimetablePage';
import { AdminDonationsPage } from './pages/admin/AdminDonationsPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminSubChurchesPage } from './pages/admin/AdminSubChurchesPage';

// Public Layout Container
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-slate-900 selection:bg-amber-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/subchurches/st-anthony" element={<SubChurchStAnthonyPage />} />
            <Route path="/subchurches/st-matthew" element={<SubChurchStMatthewPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/events" element={<EventsCalendarPage />} />
            <Route path="/sacraments" element={<SacramentsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/receipt/:receiptNumber" element={<ReceiptViewPage />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Portal Protected Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="about" element={<AdminAboutPage />} />
            <Route path="timetable" element={<AdminTimetablePage />} />
            <Route path="subchurches" element={<AdminSubChurchesPage />} />
            <Route path="donations" element={<AdminDonationsPage />} />
            <Route path="announcements" element={<AdminAnnouncementsPage />} />
            <Route path="events" element={<AdminEventsPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="gallery" element={<AdminGalleryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
