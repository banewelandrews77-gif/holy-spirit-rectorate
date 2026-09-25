import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SUB_CHURCHES } from '../data/parishData';
import { SubChurchHeader } from '../components/layout/SubChurchHeader';
import { MassScheduleModal } from '../components/MassScheduleModal';
import { 
  Church, 
  Clock, 
  MapPin, 
  Calendar, 
  Users, 
  Heart, 
  CheckCircle2, 
  Award,
  Sparkles
} from 'lucide-react';
import { useParishTimetable } from '../hooks/useParishTimetable';
import { useSubStationsGovernance } from '../hooks/useSubStationsGovernance';

export const SubChurchStAnthonyPage: React.FC = () => {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const { timetable } = useParishTimetable();
  const { governance } = useSubStationsGovernance();
  const baseChurch = SUB_CHURCHES['st-anthony'];
  const church = {
    ...baseChurch,
    name: timetable['st-anthony']?.name || baseChurch.name,
    location: timetable['st-anthony']?.location || baseChurch.location,
    priestInCharge: timetable['st-anthony']?.priestInCharge || baseChurch.priestInCharge,
    massSchedules: timetable['st-anthony']?.massSchedules || baseChurch.massSchedules,
    devotions: timetable['st-anthony']?.devotions || baseChurch.devotions,
    societies: governance['st-anthony']?.societies || baseChurch.societies,
    executiveCouncil: governance['st-anthony']?.executiveCouncil || baseChurch.executiveCouncil,
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Dedicated Outstation Hero */}
      <SubChurchHeader 
        church={church} 
        onOpenSchedule={() => setScheduleModalOpen(true)} 
      />

      {/* PATRON SAINT & HISTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Outstation Heritage</span>
            <h2 className="text-3xl font-bold font-liturgical text-slate-900">
              The Journey of St. Anthony of Padua Community
            </h2>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed font-serif">
              <p>
                {church.history}
              </p>
              <p>
                St. Anthony of Padua, renowned throughout the universal Church as the "Doctor of the Gospel" and the patron of lost things and the poor, inspires our outstation with his profound humility and compassion. Every Tuesday, our sanctuary fills with devotees seeking his intercession and partaking in the blessing of St. Anthony’s Bread.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block">Patron Saint:</span>
                <span className="text-amber-800">{church.patronSaint}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block">Feast Day:</span>
                <span className="text-amber-800">June 13 (Solemn High Mass)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-gradient-to-tr from-amber-700 to-amber-900 rounded-3xl p-6 text-white shadow-xl space-y-4 relative overflow-hidden">
              <span className="text-4xl text-amber-300 font-liturgical block">✠</span>
              <h3 className="text-xl font-bold font-liturgical">St. Anthony Novena & Bread</h3>
              <p className="text-xs text-amber-100 leading-relaxed">
                Join our traditional 13 Tuesdays Devotion to St. Anthony of Padua. Bring your bread for blessing and support the charity basket for needy community members.
              </p>
              <div className="pt-2 text-xs font-semibold text-amber-200">
                Every Tuesday at 6:30 PM
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* DETAILED MASS TIMETABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 rounded-3xl p-8 sm:p-10 border border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Liturgical Timetable</span>
              <h2 className="text-2xl font-bold font-liturgical text-slate-900 mt-0.5">
                Masses & Devotions at St. Anthony
              </h2>
            </div>
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-sm"
            >
              Open Printable Timetable
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {church.massSchedules.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">{item.day}</span>
                <span className="text-xl font-mono font-bold text-slate-900 block">{item.time}</span>
                <p className="text-xs text-slate-500">{item.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIETIES & LOCAL EXECUTIVE COUNCIL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Active Societies */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Fellowship & Guilds</span>
            <h3 className="text-2xl font-bold font-liturgical text-slate-900">
              Societies at St. Anthony
            </h3>
            <p className="text-xs text-slate-600">
              Deepen your spiritual life and make lifelong Catholic friendships by joining one of our active outstation societies.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {church.societies.map((soc, idx) => (
                <div key={idx} className="p-3.5 bg-white rounded-xl border border-stone-200 flex items-center gap-2.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800">{soc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Outstation Committee Executives */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Outstation Governance</span>
            <h3 className="text-2xl font-bold font-liturgical text-slate-900">
              Executive Committee
            </h3>
            <p className="text-xs text-slate-600">
              Dedicated leadership team overseeing the physical and spiritual upkeep of the St. Anthony sanctuary.
            </p>

            <div className="space-y-2.5 pt-2">
              {church.executiveCouncil.map((exec, idx) => (
                <div key={idx} className="p-3.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between shadow-sm">
                  <span className="text-xs font-bold text-slate-800">{exec.name}</span>
                  <span className="text-xs text-amber-800 font-medium px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                    {exec.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SUPPORT ST ANTHONY PROJECT CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-500/30">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold font-liturgical text-white">
              Support St. Anthony Outstation Projects
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Your donations toward the building fund, novena bread for the poor, or general offertory directly uplift the St. Anthony of Padua community.
            </p>
          </div>
          <Link
            to="/donate?church=st-anthony"
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-xl transition-all whitespace-nowrap"
          >
            Donate to St. Anthony
          </Link>
        </div>
      </section>

      <MassScheduleModal 
        isOpen={scheduleModalOpen} 
        onClose={() => setScheduleModalOpen(false)} 
        defaultChurch="st-anthony" 
      />

    </div>
  );
};
