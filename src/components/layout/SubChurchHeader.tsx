import React from 'react';
import { Link } from 'react-router-dom';
import { Church, MapPin, Calendar, Clock, Heart, Users, ArrowLeft } from 'lucide-react';
import { ChurchProfile } from '../../data/parishData';

interface SubChurchHeaderProps {
  church: ChurchProfile;
  onOpenSchedule: () => void;
}

export const SubChurchHeader: React.FC<SubChurchHeaderProps> = ({ church, onOpenSchedule }) => {
  return (
    <div className="relative bg-slate-950 text-white overflow-hidden py-16 lg:py-24 border-b border-amber-500/20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={church.heroImage} 
          alt={church.name} 
          className="w-full h-full object-cover object-center opacity-25 filter brightness-75 scale-105 transform animate-pulse duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back breadcrumb */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold mb-6 transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Holy Spirit Rectorate Home</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-amber-600/30 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                {church.roleTitle}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                Feast Day: <strong>{church.feastDay}</strong>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-liturgical text-white tracking-wide leading-tight">
              {church.name}
            </h1>

            <p className="text-amber-200 text-base sm:text-lg font-serif italic">
              "{church.tagline}"
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {church.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{church.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Church className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Priest: <strong>{church.priestInCharge}</strong></span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={onOpenSchedule}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-400/30 text-white text-sm font-semibold transition-all shadow"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>View Full Mass Schedules</span>
              </button>

              <Link
                to={`/donate?church=${church.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-sm font-semibold transition-all shadow-lg shadow-amber-900/40"
              >
                <Heart className="w-4 h-4 fill-white/80" />
                <span>Support {church.name.split(' ')[0]}</span>
              </Link>
            </div>

          </div>

          {/* Quick Schedule Highlights Card */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-md shadow-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sunday Liturgy Times
            </h3>
            
            <div className="space-y-2">
              {church.massSchedules.slice(0, 3).map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-white block">{item.day}</span>
                    <span className="text-slate-400 text-[11px]">{item.type}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold">
                    {item.time.split('–')[0].trim()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
              <span>Direct Inquiries: <strong>{church.contactPhone}</strong></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
