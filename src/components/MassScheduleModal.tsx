import React, { useState } from 'react';
import { X, Clock, MapPin, Calendar, Church, Info } from 'lucide-react';
import { useParishTimetable } from '../hooks/useParishTimetable';

interface MassScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChurch?: 'holy-spirit' | 'st-anthony' | 'st-matthew';
}

export const MassScheduleModal: React.FC<MassScheduleModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultChurch = 'holy-spirit' 
}) => {
  const [selectedChurch, setSelectedChurch] = useState<'holy-spirit' | 'st-anthony' | 'st-matthew'>(defaultChurch);
  const { timetable } = useParishTimetable();

  if (!isOpen) return null;

  const church = timetable[selectedChurch];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-amber-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close Mass schedule modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-3 mb-2 pr-10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-400/40 text-amber-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">Liturgical Timetable</span>
              <h2 className="text-xl font-bold font-liturgical text-white">Mass & Devotion Schedules</h2>
            </div>
          </div>
          <p className="text-slate-300 text-sm">Select a church center below to view Eucharistic liturgies, devotions, and confessions.</p>
        </div>

        {/* Church Selector Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 p-2 gap-2 overflow-x-auto">
          {(['holy-spirit', 'st-anthony', 'st-matthew'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setSelectedChurch(id)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap text-center ${
                selectedChurch === id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {id === 'holy-spirit' && 'Holy Spirit Rectorate'}
              {id === 'st-anthony' && 'St. Anthony of Padua'}
              {id === 'st-matthew' && 'St. Matthew Church'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex items-start justify-between bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
            <div>
              <h3 className="font-bold text-slate-900 font-liturgical text-base">{church.name}</h3>
              <p className="text-xs text-amber-800 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                {church.location}
              </p>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300">
              {church.patronSaint}
            </span>
          </div>

          {/* Eucharistic Liturgies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              Eucharistic Liturgies ({church.massSchedules.length})
            </h4>
            <div className="grid gap-2.5">
              {church.massSchedules.map((schedule, idx) => (
                <div 
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-stone-50 transition-colors"
                >
                  <div className="mb-1 sm:mb-0">
                    <span className="font-semibold text-slate-900 text-sm">{schedule.day}</span>
                    <span className="block text-xs text-slate-500">{schedule.type}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 font-mono text-xs font-semibold self-start sm:self-auto">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {schedule.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devotions & Adoration */}
          {church.devotions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Devotions, Adoration & Confessions</h4>
              <ul className="space-y-1.5 text-xs text-slate-600 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                {church.devotions.map((dev, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{dev}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Seasonal Notice */}
          {church.specialNotice && (
            <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block">Liturgical Notice:</span>
                <span>{church.specialNotice}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 p-4 px-6 flex justify-between items-center text-xs text-slate-500">
          <span>Priest on call: <strong className="text-slate-700">{church.priestInCharge}</strong></span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
