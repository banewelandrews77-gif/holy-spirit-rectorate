import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  Pin, 
  Calendar, 
  Download, 
  FileText, 
  Share2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Announcement, Bulletin } from '../types';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [search, setSearch] = useState('');
  const [selectedChurch, setSelectedChurch] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchAnnouncements();
    fetchBulletins();
  }, [selectedChurch, selectedCategory]);

  const fetchAnnouncements = () => {
    let url = `/api/announcements?church_id=${selectedChurch}&category=${selectedCategory}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.announcements) setAnnouncements(data.announcements);
      })
      .catch(err => console.error(err));
  };

  const fetchBulletins = () => {
    fetch('/api/bulletins')
      .then(res => res.json())
      .then(data => {
        if (data.bulletins) setBulletins(data.bulletins);
      })
      .catch(err => console.error(err));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnnouncements();
  };

  const handleShare = (item: Announcement) => {
    navigator.clipboard.writeText(`${window.location.origin}/announcements#${item.slug}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 lg:py-20 border-b border-amber-500/20 text-center relative">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-400/30">
            Parish Communications
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-liturgical tracking-wide">
            Announcements & Bulletins
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Stay informed with official notices, liturgical instructions, society announcements, and downloadable weekly newsletters for Holy Spirit Rectorate and our Outstations.
          </p>
        </div>
      </section>

      {/* FILTER & SEARCH BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-4">
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search announcements by title or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-100 text-xs">
            
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
              <span className="font-bold text-slate-500 mr-1">Category:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'general', label: 'General' },
                { id: 'urgent', label: 'Urgent' },
                { id: 'liturgical', label: 'Liturgical' },
                { id: 'youth', label: 'Youth' },
                { id: 'societies', label: 'Societies' }
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

      {/* ANNOUNCEMENTS FEED & BULLETINS SIDEBAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Feed (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold font-liturgical text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-700" />
              Notices & Pastoral Updates ({announcements.length})
            </h2>

            {announcements.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 text-slate-500">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2 opacity-50" />
                <p>No announcements found matching the selected filters.</p>
              </div>
            ) : (
              announcements.map((item) => (
                <article
                  key={item.id}
                  id={item.slug}
                  className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm transition-all space-y-4 ${
                    item.is_pinned === 1 ? 'border-amber-300 bg-gradient-to-r from-amber-50/40 via-white to-white' : 'border-stone-200 hover:border-amber-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.is_pinned === 1 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider">
                          <Pin className="w-2.5 h-2.5" /> Pinned Notice
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-slate-700 text-[10px] font-semibold uppercase tracking-wider">
                        {item.church_id === 'all' ? 'All Centers' : item.church_id.toUpperCase()}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-semibold uppercase">
                        {item.category}
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(item.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-liturgical text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-serif">
                    {item.content}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs text-slate-500">
                    <span>Authorized by: {item.author_name || 'Parish Secretariat'}</span>
                    <button
                      onClick={() => handleShare(item)}
                      className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-semibold"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Link Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Bulletins Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-bold font-liturgical text-slate-900">Weekly Bulletins</h3>
              </div>
              <p className="text-xs text-slate-500">
                Official Sunday bulletin containing liturgical reflections, mass intentions, and financial reports.
              </p>

              <div className="space-y-3 pt-2">
                {bulletins.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-300 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {b.week_label}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(b.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{b.title}</h4>
                    {b.summary && <p className="text-xs text-slate-500 line-clamp-2">{b.summary}</p>}

                    <a
                      href={b.download_url}
                      onClick={(e) => {
                        if (b.download_url === '#') {
                          e.preventDefault();
                          alert('Official PDF bulletin download simulated for ' + b.title);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 pt-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF Bulletin</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Mass intention notice */}
            <div className="bg-stone-100 rounded-3xl p-6 border border-amber-200 space-y-3">
              <h4 className="font-bold text-slate-900 font-liturgical text-sm">Have a Mass Intention?</h4>
              <p className="text-xs text-slate-600">
                Book your thanksgiving, memorial, or intercessory Mass intentions through our online portal or at the parish office.
              </p>
              <a 
                href="/contact" 
                className="inline-block w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-center text-xs font-semibold transition-colors"
              >
                Book Mass Intention
              </a>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
