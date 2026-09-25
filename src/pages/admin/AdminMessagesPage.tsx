import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Calendar, 
  User, 
  Phone, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ContactMessage } from '../../types';

export const AdminMessagesPage: React.FC = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, [statusFilter, categoryFilter]);

  const fetchMessages = () => {
    setLoading(true);
    let url = `/api/contact?status=${statusFilter}&category=${categoryFilter}`;
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.messages) setMessages(data.messages);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/contact/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchMessages();
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
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Pastoral Communications</span>
          <h1 className="text-2xl font-bold font-liturgical text-slate-900 mt-0.5">Parishioner Inquiries & Intentions</h1>
          <p className="text-xs text-slate-500">
            Inbox of prayer requests, Mass intentions booking, pastoral appointments, and sacramental queries.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-700 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
          Total: {messages.length} inquiries
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500 uppercase">Status:</span>
          {['all', 'unread', 'responded', 'archived'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                statusFilter === s
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500 uppercase">Category:</span>
          {['all', 'general', 'mass_intention', 'pastoral_counseling', 'sacraments'].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                categoryFilter === c
                  ? 'bg-slate-900 text-white shadow-sm font-semibold'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
            <span className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin inline-block" />
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-slate-500 text-xs">
            No inquiries match the selected filter.
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`bg-white p-6 rounded-3xl border shadow-sm transition-all space-y-3 ${
                m.status === 'unread' ? 'border-amber-300 bg-amber-50/20' : 'border-stone-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    m.status === 'unread' 
                      ? 'bg-amber-600 text-white' 
                      : m.status === 'responded' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-stone-100 text-slate-600'
                  }`}>
                    {m.status}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold uppercase">
                    {m.category.replace('_', ' ')}
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-slate-500 text-[10px] capitalize">
                    {m.church_id.replace('-', ' ')}
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{m.subject}</h3>
                <p className="text-xs text-slate-700 font-serif leading-relaxed mt-1 whitespace-pre-line">
                  {m.message}
                </p>
              </div>

              {m.intention_date && (
                <div className="inline-flex items-center gap-1.5 p-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>Requested Mass Date: <strong>{m.intention_date}</strong></span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 text-slate-600">
                  <span className="font-semibold text-slate-900">{m.sender_name}</span>
                  <a href={`mailto:${m.sender_email}`} className="text-amber-700 hover:underline">
                    {m.sender_email}
                  </a>
                  {m.sender_phone && (
                    <a href={`tel:${m.sender_phone}`} className="text-slate-500 hover:text-slate-800">
                      {m.sender_phone}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {m.status !== 'responded' && (
                    <button
                      onClick={() => updateStatus(m.id, 'responded')}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-lg border border-emerald-200 transition-colors"
                    >
                      Mark Responded
                    </button>
                  )}

                  {m.status !== 'archived' && (
                    <button
                      onClick={() => updateStatus(m.id, 'archived')}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors"
                    >
                      Archive
                    </button>
                  )}

                  <button
                    onClick={() => deleteMessage(m.id)}
                    className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
