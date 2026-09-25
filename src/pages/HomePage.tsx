import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Church, 
  Heart, 
  Clock, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Bell, 
  FileText, 
  Users, 
  CheckCircle, 
  BookOpen, 
  ShieldCheck,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { PARISH_INFO, SUB_CHURCHES } from '../data/parishData';
import { Announcement, ParishEvent } from '../types';
import { MassScheduleModal } from '../components/MassScheduleModal';
import { useParishTimetable } from '../hooks/useParishTimetable';

export const HomePage: React.FC = () => {
  const { timetable } = useParishTimetable();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<ParishEvent[]>([]);
  const [massModalOpen, setMassModalOpen] = useState(false);
  const [selectedChurchForModal, setSelectedChurchForModal] = useState<'holy-spirit' | 'st-anthony' | 'st-matthew'>('holy-spirit');

  useEffect(() => {
    // Fetch announcements
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (data.announcements) setAnnouncements(data.announcements.slice(0, 4));
      })
      .catch(err => console.error('Error fetching announcements:', err));

    // Fetch events
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.events) setEvents(data.events.slice(0, 4));
      })
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  const openChurchModal = (churchId: 'holy-spirit' | 'st-anthony' | 'st-matthew') => {
    setSelectedChurchForModal(churchId);
    setMassModalOpen(true);
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-slate-950 text-white overflow-hidden">
        {/* Background Image with warm ecclesiastical gradient */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1548625361-197e415d4872?q=80&w=1920&auto=format&fit=crop" 
            alt="Holy Spirit Sanctuary" 
            className="w-full h-full object-cover object-center opacity-30 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-amber-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{PARISH_INFO.motto}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-liturgical text-white tracking-wide leading-tight sm:leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">Holy Spirit Rectorate</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-200 font-serif leading-relaxed">
              A vibrant Eucharistic communion united in prayer, sacramental grace, and joyful fellowship across our Rectorate and Outstations — <strong className="text-amber-300 font-semibold">St. Anthony of Padua</strong> and <strong className="text-amber-300 font-semibold">St. Matthew Catholic Church</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link 
                to="/donate" 
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-amber-900/40 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>Support the Parish (Donate)</span>
              </Link>

              <button 
                onClick={() => openChurchModal('holy-spirit')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md transition-all"
              >
                <Clock className="w-5 h-5 text-amber-400" />
                <span>Mass & Confession Times</span>
              </button>
            </div>

            {/* Quick stats / Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs sm:text-sm text-slate-300">
              <div>
                <span className="text-amber-400 font-bold block text-lg font-mono">3</span>
                <span>Worship Centers</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold block text-lg font-mono">10+</span>
                <span>Active Societies & Guilds</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold block text-lg font-mono">24/7</span>
                <span>Adoration Chapel</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK LITURGICAL TIMETABLE AT A GLANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">This Sunday's Mass Timetable</span>
              <h2 className="text-2xl font-bold font-liturgical text-slate-900 mt-0.5">Worship With Us At Any Center</h2>
            </div>
            <button
              onClick={() => openChurchModal('holy-spirit')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200"
            >
              <span>Full Weekly Schedule</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            
            {/* Center 1: Holy Spirit Rectorate */}
            <div className="bg-stone-50/80 rounded-2xl p-5 border border-stone-200/80 hover:border-amber-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                    Main Sanctuary
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Pentecost</span>
                </div>
                <h3 className="font-bold text-slate-900 font-liturgical text-lg">{timetable['holy-spirit'].name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  {timetable['holy-spirit'].location}
                </p>

                <div className="space-y-2 text-xs">
                  {timetable['holy-spirit'].massSchedules.slice(0, 2).map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white border border-stone-200">
                      <span className="font-semibold text-slate-700 truncate pr-2">{s.day}</span>
                      <span className="font-mono font-bold text-amber-800 text-[11px] shrink-0">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openChurchModal('holy-spirit')}
                className="w-full mt-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-amber-600 hover:text-white rounded-xl border border-stone-200 transition-colors text-center"
              >
                View Weekday Masses
              </button>
            </div>

            {/* Center 2: St. Anthony of Padua */}
            <div className="bg-stone-50/80 rounded-2xl p-5 border border-stone-200/80 hover:border-amber-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                    Sub-Church
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Feast: June 13</span>
                </div>
                <h3 className="font-bold text-slate-900 font-liturgical text-lg">{timetable['st-anthony'].name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  {timetable['st-anthony'].location}
                </p>

                <div className="space-y-2 text-xs">
                  {timetable['st-anthony'].massSchedules.slice(0, 2).map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white border border-stone-200">
                      <span className="font-semibold text-slate-700 truncate pr-2">{s.day}</span>
                      <span className="font-mono font-bold text-amber-800 text-[11px] shrink-0">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/subchurches/st-anthony"
                className="w-full mt-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-amber-600 hover:text-white rounded-xl border border-stone-200 transition-colors text-center block"
              >
                Explore St. Anthony Portal
              </Link>
            </div>

            {/* Center 3: St. Matthew Catholic Church */}
            <div className="bg-stone-50/80 rounded-2xl p-5 border border-stone-200/80 hover:border-amber-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                    Sub-Church
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Feast: Sept 21</span>
                </div>
                <h3 className="font-bold text-slate-900 font-liturgical text-lg">{timetable['st-matthew'].name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  {timetable['st-matthew'].location}
                </p>

                <div className="space-y-2 text-xs">
                  {timetable['st-matthew'].massSchedules.slice(0, 2).map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white border border-stone-200">
                      <span className="font-semibold text-slate-700 truncate pr-2">{s.day}</span>
                      <span className="font-mono font-bold text-amber-800 text-[11px] shrink-0">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/subchurches/st-matthew"
                className="w-full mt-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-amber-600 hover:text-white rounded-xl border border-stone-200 transition-colors text-center block"
              >
                Explore St. Matthew Portal
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* DEDICATED SUB-CHURCHES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Our Outstation Communities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-liturgical text-slate-900">
            The Sub-Churches of the Rectorate
          </h2>
          <p className="text-sm text-slate-600">
            Dedicated worship hubs extending our pastoral outreach, sacramental life, and Christian charity into neighboring communities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* St. Anthony */}
          <div className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-lg hover:shadow-2xl transition-all flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img 
                src="/images/st-anthony.jpg" 
                alt="St. Anthony of Padua"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Patronal Feast: June 13
                </span>
                <h3 className="text-2xl font-bold font-liturgical mt-0.5">St. Anthony of Padua</h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                {SUB_CHURCHES['st-anthony'].description}
              </p>

              <div className="space-y-2 border-t border-stone-100 pt-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Sunday Mass: <strong>7:30 AM</strong> | Tuesday Novena: <strong>6:30 PM</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>{timetable['st-anthony']?.location || SUB_CHURCHES['st-anthony'].location}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link 
                  to="/subchurches/st-anthony"
                  className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-bold text-sm"
                >
                  <span>Visit St. Anthony Page</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/donate?church=st-anthony"
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition-colors"
                >
                  Support Outstation
                </Link>
              </div>
            </div>
          </div>

          {/* St. Matthew */}
          <div className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-lg hover:shadow-2xl transition-all flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img 
                src="/images/st-matthew.jpg" 
                alt="St. Matthew the Apostle & Evangelist"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Patronal Feast: September 21
                </span>
                <h3 className="text-2xl font-bold font-liturgical mt-0.5">St. Matthew Catholic Church</h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                {SUB_CHURCHES['st-matthew'].description}
              </p>

              <div className="space-y-2 border-t border-stone-100 pt-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Sunday Mass: <strong>8:00 AM</strong> | Wednesday Midweek: <strong>6:30 PM</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>{timetable['st-matthew']?.location || SUB_CHURCHES['st-matthew'].location}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link 
                  to="/subchurches/st-matthew"
                  className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-bold text-sm"
                >
                  <span>Visit St. Matthew Page</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/donate?church=st-matthew"
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition-colors"
                >
                  Support Outstation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ONLINE DONATION SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 rounded-3xl text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
            <span className="text-[300px] font-liturgical">✠</span>
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-200 font-bold bg-amber-900/50 px-3 py-1 rounded-full border border-amber-400/30">
              Online Giving Portal
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-liturgical text-white tracking-wide">
              Support the Mission & Projects of Our Parish
            </h2>

            <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
              Whether offering your monthly tithe, supporting outstation sanctuary building, giving to the harvest thanksgiving, or booking Mass intentions — your generous offerings sustain God's work.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-lg bg-black/20 text-xs text-amber-200 font-medium">
                MTN MoMo
              </span>
              <span className="px-3 py-1 rounded-lg bg-black/20 text-xs text-amber-200 font-medium">
                Telecel Cash
              </span>
              <span className="px-3 py-1 rounded-lg bg-black/20 text-xs text-amber-200 font-medium">
                AT Money
              </span>
              <span className="px-3 py-1 rounded-lg bg-black/20 text-xs text-amber-200 font-medium">
                Debit / Credit Cards
              </span>
              <span className="px-3 py-1 rounded-lg bg-black/20 text-xs text-amber-200 font-medium">
                PayPal
              </span>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link 
                to="/donate" 
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-amber-100 font-bold text-sm shadow-xl transition-all"
              >
                <Heart className="w-4 h-4 fill-amber-600 text-amber-600" />
                <span>Give Online Now</span>
              </Link>
              <span className="text-xs text-amber-200 italic">
                * Instant official parish receipt generated for every donation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS & UPCOMING LITURGIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Announcements (8 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Parish Notices</span>
                <h2 className="text-2xl font-bold font-liturgical text-slate-900 mt-0.5">Latest Announcements</h2>
              </div>
              <Link 
                to="/announcements" 
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {announcements.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-amber-300 shadow-sm hover:shadow-md transition-all space-y-2"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.is_pinned === 1 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                        Important
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-slate-600 text-[10px] font-semibold uppercase">
                      {item.church_id === 'all' ? 'All Centers' : item.church_id}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(item.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 font-liturgical text-base hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Events Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Liturgical Calendar</span>
                <h2 className="text-2xl font-bold font-liturgical text-slate-900 mt-0.5">Upcoming Events</h2>
              </div>
              <Link 
                to="/events" 
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>Full Calendar</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200 hover:border-amber-300 shadow-sm flex items-start gap-4 transition-all"
                >
                  {/* Date badge */}
                  <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-amber-700">
                      {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold font-mono leading-none">
                      {new Date(event.start_date).getDate()}
                    </span>
                  </div>

                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 block">
                      {event.category} • {event.time_info}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {event.title}
                    </h4>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {event.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* DAILY SCRIPTURE & PASTORAL REFLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 rounded-3xl p-8 sm:p-12 border border-amber-200/80 text-center max-w-3xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-700/10 text-amber-700 flex items-center justify-center mx-auto text-xl font-bold font-liturgical">
            ✠
          </div>
          <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">Scripture of the Week</span>
          <blockquote className="text-lg sm:text-xl font-serif italic text-slate-800 leading-relaxed">
            "For where two or three are gathered together in my name, there am I in the midst of them."
          </blockquote>
          <span className="text-xs font-bold text-amber-700 block font-sans tracking-wide uppercase">
            — Matthew 18:20
          </span>
        </div>
      </section>

      {/* Mass Schedule Modal */}
      <MassScheduleModal 
        isOpen={massModalOpen} 
        onClose={() => setMassModalOpen(false)}
        defaultChurch={selectedChurchForModal}
      />

    </div>
  );
};
