import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit3, 
  Pin, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Announcement } from '../../types';

export const AdminAnnouncementsPage: React.FC = () => {
  const { token, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const stationParam = searchParams.get('station') || 'all';

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStationFilter, setSelectedStationFilter] = useState(stationParam);

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [churchId, setChurchId] = useState(stationParam !== 'all' ? stationParam : 'all');
  const [category, setCategory] = useState('general');
  const [isPinned, setIsPinned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (stationParam) {
      setSelectedStationFilter(stationParam);
    }
  }, [stationParam]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    setLoading(true);
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (data.announcements) setAnnouncements(data.announcements);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setContent('');
    setChurchId(selectedStationFilter !== 'all' ? selectedStationFilter : 'all');
    setCategory('general');
    setIsPinned(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Announcement) => {
    setEditingItem(item);
    setTitle(item.title);
    setContent(item.content);
    setChurchId(item.church_id);
    setCategory(item.category);
    setIsPinned(item.is_pinned === 1);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    const url = editingItem 
      ? `/api/announcements/${editingItem.id}` 
      : '/api/announcements';
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
          content,
          church_id: churchId,
          category,
          is_pinned: isPinned ? 1 : 0
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save announcement');
      }

      setIsModalOpen(false);
      fetchAnnouncements();
      setMessage('Announcement saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Content Management</span>
          <h1 className="text-2xl font-bold font-liturgical text-slate-900 mt-0.5">Parish Announcements</h1>
          <p className="text-xs text-slate-500">
            Publish notices, liturgical updates, and sub-church circulars.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Station Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center bg-white p-2.5 rounded-2xl border border-stone-200 shadow-sm text-xs">
        <span className="text-slate-400 font-medium px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter by Station:
        </span>
        {[
          { id: 'all', label: 'All Centers' },
          { id: 'holy-spirit', label: '🏛️ Holy Spirit Rectorate' },
          { id: 'st-anthony', label: '⛪ St. Anthony of Padua' },
          { id: 'st-matthew', label: '⛪ St. Matthew' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedStationFilter(tab.id);
              if (tab.id === 'all') {
                searchParams.delete('station');
                setSearchParams(searchParams);
              } else {
                setSearchParams({ station: tab.id });
              }
            }}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedStationFilter === tab.id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements
          .filter(item => selectedStationFilter === 'all' || item.church_id === selectedStationFilter || item.church_id === 'all')
          .map((item) => (
          <div
            key={item.id}
            className={`bg-white p-6 rounded-3xl border shadow-sm transition-all flex flex-col sm:flex-row justify-between gap-4 items-start ${
              item.is_pinned === 1 ? 'border-amber-300 bg-amber-50/20' : 'border-stone-200'
            }`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                {item.is_pinned === 1 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold uppercase">
                    <Pin className="w-2.5 h-2.5" /> Pinned
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-slate-700 text-[10px] font-semibold uppercase">
                  {item.church_id === 'all' ? 'All Centers' : item.church_id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[10px] font-semibold uppercase">
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(item.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              <h3 className="text-lg font-bold font-liturgical text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-serif line-clamp-3">
                {item.content}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => openEditModal(item)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 transition-colors"
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 border border-amber-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-slate-900 font-liturgical text-lg">
                {editingItem ? 'Edit Announcement' : 'Create New Announcement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solemnity of Pentecost Mass Schedules"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Center</label>
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
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="general">General</option>
                    <option value="urgent">Urgent</option>
                    <option value="liturgical">Liturgical</option>
                    <option value="youth">Youth</option>
                    <option value="societies">Societies</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="pinNotice" className="text-xs font-semibold text-slate-700">
                  Pin this notice to the top of announcements
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Body *</label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detailed text of the announcement..."
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-amber-600 font-serif"
                />
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
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
