import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  X,
  ExternalLink,
  Search,
  Filter,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ParishEvent } from '../../types';

export const AdminEventsPage: React.FC = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const stationParam = searchParams.get('station') || 'all';

  const [events, setEvents] = useState<ParishEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [filterChurch, setFilterChurch] = useState(stationParam);
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ParishEvent | null>(null);

  const [title, setTitle] = useState('');
  const [churchId, setChurchId] = useState('all');
  const [category, setCategory] = useState<'mass' | 'feast' | 'retreat' | 'meeting' | 'youth'>('mass');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeInfo, setTimeInfo] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.events) setEvents(data.events);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const getStationDefaultLocation = (st: string) => {
    if (st === 'st-anthony') return 'St. Anthony of Padua Catholic Church';
    if (st === 'st-matthew') return 'St. Matthew Catholic Church';
    return 'Holy Spirit Main Sanctuary';
  };

  const openCreateModal = () => {
    const targetStation = filterChurch !== 'all' ? filterChurch : 'all';
    setEditingItem(null);
    setTitle('');
    setChurchId(targetStation);
    setCategory('mass');
    setDescription('');
    setLocation(getStationDefaultLocation(targetStation));
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate('');
    setTimeInfo('7:00 AM - 9:00 AM');
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ParishEvent) => {
    setEditingItem(item);
    setTitle(item.title);
    setChurchId(item.church_id);
    setCategory(item.category);
    setDescription(item.description);
    setLocation(item.location);
    setStartDate(item.start_date);
    setEndDate(item.end_date || '');
    setTimeInfo(item.time_info);
    setIsFeatured(item.is_featured === 1);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const url = editingItem 
      ? `/api/events/${editingItem.id}` 
      : '/api/events';
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          church_id: churchId,
          category,
          description,
          location,
          start_date: startDate,
          end_date: endDate || null,
          time_info: timeInfo,
          is_featured: isFeatured ? 1 : 0
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      setIsModalOpen(false);
      fetchEvents();
      setMessage(editingItem ? 'Event updated successfully!' : 'Event created successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this event from the calendar?')) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchEvents();
        setMessage('Event deleted from calendar.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = !search || 
      e.title.toLowerCase().includes(search.toLowerCase()) || 
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchesChurch = filterChurch === 'all' || e.church_id === filterChurch || e.church_id === 'all';
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
    return matchesSearch && matchesChurch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Liturgical Schedule & Calendar CMS</span>
          <h1 className="text-2xl font-bold font-liturgical text-slate-900 mt-0.5">Parish Calendar Events</h1>
          <p className="text-xs text-slate-500">
            Coordinate and edit upcoming Holy Masses, patronal feast days, novenas, retreats, and society meetings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <a
            href="/events"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-slate-700 hover:bg-stone-50 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Calendar</span>
          </a>

          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Event</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, locations..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-amber-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={filterChurch}
            onChange={(e) => {
              setFilterChurch(e.target.value);
              if (e.target.value === 'all') {
                searchParams.delete('station');
                setSearchParams(searchParams);
              } else {
                setSearchParams({ station: e.target.value });
              }
            }}
            className="text-xs py-2 px-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none font-medium"
          >
            <option value="all">All Worship Centers</option>
            <option value="holy-spirit">Holy Spirit Rectorate</option>
            <option value="st-anthony">St. Anthony of Padua</option>
            <option value="st-matthew">St. Matthew Catholic Church</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none font-medium"
          >
            <option value="all">All Categories</option>
            <option value="mass">Mass / Liturgy</option>
            <option value="feast">Patronal Feast</option>
            <option value="retreat">Retreat / Adoration</option>
            <option value="meeting">Society Meeting</option>
            <option value="youth">Youth Event</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:border-amber-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase">
                    {event.category}
                  </span>
                  {event.is_featured === 1 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold bg-stone-100 px-2 py-0.5 rounded">
                  {event.church_id === 'all' ? 'All Centers' : event.church_id}
                </span>
              </div>

              <h3 className="text-base font-bold font-liturgical text-slate-900">{event.title}</h3>
              
              <div className="text-xs text-amber-800 flex items-center gap-2 font-medium">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {event.start_date}
                  {event.end_date && event.end_date !== event.start_date ? ` to ${event.end_date}` : ''} • {event.time_info}
                </span>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{event.location}</span>
              </div>

              <p className="text-xs text-slate-600 font-serif line-clamp-2 pt-1">
                {event.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <span className="text-[11px] font-semibold text-slate-400">ID #{event.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(event)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-amber-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-slate-900 font-liturgical text-lg">
                {editingItem ? 'Edit Calendar Event' : 'Add New Calendar Event'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solemn High Mass of Thanksgiving"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Worship Center</label>
                  <select
                    value={churchId}
                    onChange={(e) => setChurchId(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="all">All Centers</option>
                    <option value="holy-spirit">Holy Spirit Rectorate</option>
                    <option value="st-anthony">St. Anthony of Padua</option>
                    <option value="st-matthew">St. Matthew Catholic Church</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="mass">Mass / Liturgy</option>
                    <option value="feast">Patronal Feast</option>
                    <option value="retreat">Retreat / Adoration</option>
                    <option value="meeting">Society Meeting</option>
                    <option value="youth">Youth Event</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Info *</label>
                  <input
                    type="text"
                    required
                    value={timeInfo}
                    onChange={(e) => setTimeInfo(e.target.value)}
                    placeholder="e.g. 7:00 AM - 9:00 AM"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Holy Spirit Main Sanctuary"
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of the liturgy, celebrant, choir..."
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none font-serif"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Feature this event on the Homepage highlights
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition-colors"
                >
                  {isSaving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
