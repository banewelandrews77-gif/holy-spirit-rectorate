import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Church, Heart, Mail, Phone, MapPin, Clock, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import { PARISH_INFO } from '../../data/parishData';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Parish Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold font-liturgical text-xl shadow-lg">
                ✠
              </div>
              <div>
                <span className="font-liturgical text-lg font-bold text-white tracking-wide block leading-tight">
                  {PARISH_INFO.name}
                </span>
                <span className="text-xs text-amber-400 font-medium tracking-wide uppercase block">
                  {PARISH_INFO.diocese}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              "{PARISH_INFO.motto}" — Proclaiming the Gospel of Jesus Christ through active liturgy, community solidarity, and dedicated charity in Sekondi-Takoradi.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Emergency Pastoral Sick Call: <a href="tel:0205388058" className="font-bold text-amber-300 hover:underline">0205388058</a></span>
              </div>
            </div>
          </div>

          {/* Column 2: Sub-Churches */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 font-sans">
              Sub-Churches
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/subchurches/st-anthony" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  St. Anthony of Padua
                </Link>
                <span className="text-[11px] text-slate-500 block pl-4.5">Feast Day: June 13</span>
              </li>
              <li className="pt-2">
                <Link to="/subchurches/st-matthew" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  St. Matthew Church
                </Link>
                <span className="text-[11px] text-slate-500 block pl-4.5">Feast Day: Sept 21</span>
              </li>
              <li className="pt-2">
                <Link to="/about" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-xs text-slate-400">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  Parish Organizational Tree
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 font-sans">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/announcements" className="hover:text-amber-300 transition-colors">Parish Announcements</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-amber-300 transition-colors">Calendar & Liturgies</Link>
              </li>
              <li>
                <Link to="/sacraments" className="hover:text-amber-300 transition-colors">Sacraments & Formations</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-amber-300 transition-colors">Photo & Video Gallery</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors">Mass Intentions Booking</Link>
              </li>
              <li>
                <Link to="/donate" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-amber-400" />
                  Online Giving Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Bulletin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 font-sans">
              Weekly Bulletin
            </h4>
            <p className="text-xs text-slate-400">
              Receive the parish newsletter, scripture readings, and upcoming events in your inbox.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Thank you! You are subscribed to our bulletin.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition-colors"
                >
                  Subscribe to Bulletin
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Holy Spirit Rectorate Parish. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-slate-300">History & Leadership</Link>
            <Link to="/contact" className="hover:text-slate-300">Parish Office</Link>
            <Link to="/admin/login" className="text-amber-500/80 hover:text-amber-400">Staff Portal</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
