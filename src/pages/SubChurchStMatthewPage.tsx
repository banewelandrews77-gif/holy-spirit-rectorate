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
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useParishTimetable } from '../hooks/useParishTimetable';
import { useSubStationsGovernance } from '../hooks/useSubStationsGovernance';

export const SubChurchStMatthewPage: React.FC = () => {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const { timetable } = useParishTimetable();
  const { governance } = useSubStationsGovernance();
  const baseChurch = SUB_CHURCHES['st-matthew'];
  const church = {
    ...baseChurch,
    name: timetable['st-matthew']?.name || baseChurch.name,
    location: timetable['st-matthew']?.location || baseChurch.location,
    priestInCharge: timetable['st-matthew']?.priestInCharge || baseChurch.priestInCharge,
    massSchedules: timetable['st-matthew']?.massSchedules || baseChurch.massSchedules,
    devotions: timetable['st-matthew']?.devotions || baseChurch.devotions,
    societies: governance['st-matthew']?.societies || baseChurch.societies,
    executiveCouncil: governance['st-matthew']?.executiveCouncil || baseChurch.executiveCouncil,
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
              The Journey of St. Matthew Catholic Church
            </h2>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed font-serif">
              <p>
                {church.history}
              </p>
              <p>
                St. Matthew, Apostle and Evangelist, responded immediately to Jesus' command: "Follow me." Inspired by his swift obedience and zeal for the Word of God, the St. Matthew Catholic Church actively promotes bible sharing circles, vibrant choir praise, and community harvest thanksgiving.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block">Patron Saint:</span>
                <span className="text-amber-800">{church.patronSaint}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block">Feast Day:</span>
                <span className="text-amber-800">September 21 (Patronal Feast)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-gradient-to-tr from-slate-900 to-amber-950 rounded-3xl p-6 text-white shadow-xl space-y-4 relative overflow-hidden border border-amber-500/20">
              <span className="text-4xl text-amber-300 font-liturgical block">✠</span>
              <h3 className="text-xl font-bold font-liturgical">Bible Study & Divine Mercy</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Join our bi-weekly St. Matthew Bible Study Circle and Friday Divine Mercy devotion at 6:00 PM. Enrich your understanding of Sacred Scripture and Eucharistic adoration.
              </p>
              <div className="pt-2 text-xs font-semibold text-amber-300">
                Every Friday at 6:00 PM
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
                Masses & Devotions at St. Matthew
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
              Societies at St. Matthew
            </h3>
            <p className="text-xs text-slate-600">
              Serve God and our outstation community through liturgical ministries, social outreach, and youth fellowship.
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
              Parishioners chosen to coordinate activities, projects, and pastoral welfare for St. Matthew Catholic Church.
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

      {/* SUPPORT ST MATTHEW PROJECT CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-500/30">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold font-liturgical text-white">
              Support St. Matthew Annual Harvest & Sanctuary Fund
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Partner with St. Matthew Catholic Church as we build, expand our educational programs, and worship with gratitude.
            </p>
          </div>
          <Link
            to="/donate?church=st-matthew"
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-xl transition-all whitespace-nowrap"
          >
            Donate to St. Matthew
          </Link>
        </div>
      </section>

      <MassScheduleModal 
        isOpen={scheduleModalOpen} 
        onClose={() => setScheduleModalOpen(false)} 
        defaultChurch="st-matthew" 
      />

    </div>
  );
};
