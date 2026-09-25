import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Filter, 
  ChevronRight, 
  Sparkles, 
  Share2, 
  Check
} from 'lucide-react';
import { ParishEvent } from '../types';

export const EventsCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<ParishEvent[]>([]);
  const [selectedChurch, setSelectedChurch] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    let url = `/api/events?church_id=${selectedChurch}&category=${selectedCategory}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.events) setEvents(data.events);
      })
      .catch(err => console.error(err));
  }, [selectedChurch, selectedCategory]);

  const handleShare = (event: ParishEvent) => {
    const text = `${event.title} - ${event.time_info} at ${event.location}. Holy Spirit Rectorate Parish`;
    navigator.clipboard.writeText(text);
    setCopiedId(event.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-16 pb-20">
      


      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 lg:py-20 border-b border-amber-500/20 text-center relative">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-400/30">
            Liturgical & Parish Life
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-liturgical tracking-wide">
            Events & Liturgical Calendar
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Participate in the spiritual celebrations, solemnities, retreats, parish feasts, and community fellowships across Holy Spirit, St. Anthony, and St. Matthew.
          </p>
        </div>
      </section>

      {/* FILTER CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            
            {/* Church Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Center:
              </span>
              {[
                { id: 'all', label: 'All Centers' },
                { id: 'holy-spirit', label: 'Holy Spirit' },
                { id: 'st-anthony', label: 'St. Anthony' },
                { id: 'st-matthew', label: 'St. Matthew' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChurch(c.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedChurch === c.id
                      ? 'bg-amber-700 text-white shadow-sm'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="font-bold text-slate-500 mr-1">Type:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'mass', label: 'Eucharist / Mass' },
                { id: 'feast', label: 'Patronal Feast' },
                { id: 'retreat', label: 'Retreat / Adoration' },
                { id: 'meeting', label: 'Societies' },
                { id: 'youth', label: 'Youth' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* EVENTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div 
              key={event.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                    {event.category}
                  </span>
                  <span className="text-[10px] font-semibold uppercase text-slate-500 bg-stone-100 px-2 py-0.5 rounded">
                    {event.church_id === 'all' ? 'All Centers' : event.church_id.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  {/* Date badge */}
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col items-center justify-center shrink-0 shadow-inner">
                    <span className="text-[10px] font-bold uppercase text-amber-700">
                      {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold font-mono leading-none">
                      {new Date(event.start_date).getDate()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 font-liturgical text-base leading-snug">
                      {event.title}
                    </h3>
                    <span className="text-xs text-amber-800 font-medium flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {event.time_info}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-serif pt-1">
                  {event.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 truncate max-w-[180px]">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </span>
                
                <button
                  onClick={() => handleShare(event)}
                  className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-semibold shrink-0"
                >
                  {copiedId === event.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3 h-3" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
