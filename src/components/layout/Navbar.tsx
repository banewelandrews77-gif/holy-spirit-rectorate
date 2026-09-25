import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Church, 
  Heart, 
  Clock, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LogOut, 
  LayoutDashboard,
  Calendar,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MassScheduleModal } from '../MassScheduleModal';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subChurchesDropdown, setSubChurchesDropdown] = useState(false);
  const [massModalOpen, setMassModalOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isViewer } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/20 text-white shadow-xl">
        {/* Top Info Bar */}
        <div className="bg-amber-700/90 text-amber-50 px-4 py-1.5 text-xs font-medium border-b border-amber-600/30">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-900/60 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-amber-200">
                Catholic Diocese of Sekondi-Takoradi
              </span>
              <span>Holy Spirit Rectorate Parish • St. Anthony of Padua • St. Matthew</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <a 
                href="tel:0205388058"
                className="hidden md:inline-flex items-center gap-1 text-amber-100 hover:text-white transition-colors"
                title="Call Emergency Pastoral Line"
              >
                <PhoneCall className="w-3 h-3 text-amber-200" />
                Emergency Pastoral Call: <span className="font-semibold text-amber-200">0205388058</span>
              </a>
              <button 
                onClick={() => setMassModalOpen(true)}
                className="hover:underline text-amber-200 flex items-center gap-1 font-semibold"
              >
                <Clock className="w-3 h-3" />
                View Mass Schedules
              </button>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <span className="text-amber-400 text-2xl font-bold font-liturgical">✠</span>
                </div>
              </div>
              <div>
                <span className="font-liturgical text-lg sm:text-xl font-bold tracking-wider text-white block leading-tight group-hover:text-amber-300 transition-colors">
                  HOLY SPIRIT RECTORATE
                </span>
                <span className="text-[10px] sm:text-xs text-amber-400/80 font-medium tracking-wide uppercase block">
                  Catholic Church & Outstations
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/') ? 'text-amber-400 bg-white/5 font-semibold' : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </Link>

              <Link 
                to="/about" 
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/about') ? 'text-amber-400 bg-white/5 font-semibold' : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                About Us
              </Link>

              {/* Sub-churches dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setSubChurchesDropdown(true)}
                onMouseLeave={() => setSubChurchesDropdown(false)}
              >
                <button 
                  className={`px-3 py-2 rounded-xl transition-all inline-flex items-center gap-1 ${
                    location.pathname.startsWith('/subchurches') ? 'text-amber-400 bg-white/5 font-semibold' : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Sub-Churches</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {subChurchesDropdown && (
                  <div className="absolute top-full left-0 w-64 pt-2 shadow-2xl animate-fade-in">
                    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-2 shadow-2xl space-y-1">
                      <Link
                        to="/subchurches/st-anthony"
                        onClick={() => setSubChurchesDropdown(false)}
                        className="block p-3 rounded-xl hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30 transition-all"
                      >
                        <span className="font-semibold text-white block text-sm">St. Anthony of Padua</span>
                        <span className="text-xs text-amber-400/80 block mt-0.5">Outstation • Feast: June 13</span>
                      </Link>
                      <Link
                        to="/subchurches/st-matthew"
                        onClick={() => setSubChurchesDropdown(false)}
                        className="block p-3 rounded-xl hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30 transition-all"
                      >
                        <span className="font-semibold text-white block text-sm">St. Matthew Catholic Church</span>
                        <span className="text-xs text-amber-400/80 block mt-0.5">Outstation • Feast: Sept 21</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link 
                to="/announcements" 
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/announcements') ? 'text-amber-400 bg-white/5 font-semibold' : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Announcements
              </Link>

              <Link 
                to="/events" 
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/events') ? 'text-amber-400 bg-white/5 font-semibold' : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Calendar
              </Link>

              <Link 
                to="/sacraments" 
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/sacraments') ? 'text-amber-400 bg-white/5 font-semibold' : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Sacraments
              </Link>

              <Link 
                to="/gallery" 
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/gallery') ? 'text-amber-400 bg-white/5 font-semibold' : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Gallery
              </Link>

              <Link 
                to="/contact" 
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/contact') ? 'text-amber-400 bg-white/5 font-semibold' : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link 
                to="/donate"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold text-sm shadow-lg shadow-amber-900/30 hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <Heart className="w-4 h-4 fill-white/80" />
                <span>Donate Online</span>
              </Link>

              {isViewer ? (
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-700">
                  <Link
                    to="/admin"
                    className="p-2 rounded-xl bg-slate-800 text-amber-300 hover:bg-slate-700 transition-colors"
                    title="Staff Dashboard"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 rounded-xl bg-slate-800 text-rose-300 hover:bg-slate-700 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs flex items-center gap-1"
                  title="Parish Staff Login"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden xl:inline">Staff</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 lg:hidden">
              <Link 
                to="/donate"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs shadow"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Give</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-900/98 px-4 pt-3 pb-6 space-y-2 animate-fade-in">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:text-amber-400 hover:bg-white/5"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:text-amber-400 hover:bg-white/5"
            >
              About Us & Leadership
            </Link>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 space-y-2 my-2">
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block px-1">
                Sub-Churches
              </span>
              <Link 
                to="/subchurches/st-anthony" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-white hover:bg-amber-600/20"
              >
                St. Anthony of Padua Catholic Church
              </Link>
              <Link 
                to="/subchurches/st-matthew" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-white hover:bg-amber-600/20"
              >
                St. Matthew Catholic Church
              </Link>
            </div>

            {/* Mobile Emergency Call Banner */}
            <a
              href="tel:0205388058"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-300" />
                Emergency Pastoral Call
              </span>
              <span className="font-mono text-amber-300 font-bold">0205388058</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setMassModalOpen(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-amber-300 hover:bg-white/5 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Mass & Confession Schedules
              </span>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">View</span>
            </button>

            <Link 
              to="/announcements" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:text-amber-400 hover:bg-white/5"
            >
              Announcements & Notices
            </Link>

            <Link 
              to="/events" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:text-amber-400 hover:bg-white/5"
            >
              Parish Calendar & Events
            </Link>

            <Link 
              to="/sacraments" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:text-amber-400 hover:bg-white/5"
            >
              Sacraments & Ministries
            </Link>

            <Link 
              to="/gallery" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:text-amber-400 hover:bg-white/5"
            >
              Photo & Video Gallery
            </Link>

            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-medium text-slate-200 hover:text-amber-400 hover:bg-white/5"
            >
              Contact Us & Mass Intentions
            </Link>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              {isViewer ? (
                <div className="flex items-center justify-between w-full">
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-amber-400 text-sm font-semibold flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Staff Dashboard ({user?.role})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-rose-400 text-xs font-semibold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 text-xs hover:text-white flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  Parish Staff Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mass Schedule Modal */}
      <MassScheduleModal 
        isOpen={massModalOpen} 
        onClose={() => setMassModalOpen(false)} 
      />
    </>
  );
};
