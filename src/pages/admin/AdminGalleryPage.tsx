import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GalleryItem } from '../../types';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminGalleryPage: React.FC = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [album, setAlbum] = useState('Pentecost Feast');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [churchId, setChurchId] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = () => {
    setLoading(true);
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (data.items) setItems(data.items);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          album,
          media_type: 'image',
          media_url: mediaUrl,
          thumbnail_url: thumbnailUrl || mediaUrl,
          caption,
          church_id: churchId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add gallery item');
      }

      setIsModalOpen(false);
      setTitle('');
      setMediaUrl('');
      setThumbnailUrl('');
      setCaption('');
      fetchGallery();
      setMessage('Photo added to gallery successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this photo from gallery?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchGallery();
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
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Media Management</span>
          <h1 className="text-2xl font-bold font-liturgical text-slate-900 mt-0.5">Parish Gallery Media</h1>
          <p className="text-xs text-slate-500">
            Upload photos from Holy Masses, feast days, confirmations, harvest, and youth camps.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Photo</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative h-48 overflow-hidden bg-stone-100">
              <img
                src={item.thumbnail_url || item.media_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-900/80 text-amber-300 text-[10px] font-semibold">
                {item.album}
              </span>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h4>
                {item.caption && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.caption}</p>
                )}
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 capitalize">{item.church_id}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 border border-amber-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-slate-900 font-liturgical text-lg">Add Photo to Gallery</h3>
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
                  placeholder="e.g. St. Anthony Feast Procession"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Album *</label>
                  <select
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Pentecost Feast">Pentecost Feast</option>
                    <option value="Confirmations">Confirmations</option>
                    <option value="St. Anthony Feast">St. Anthony Feast</option>
                    <option value="Harvest & Thanksgiving">Harvest & Thanksgiving</option>
                    <option value="Youth Activities">Youth Activities</option>
                    <option value="Charity & Outreach">Charity & Outreach</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Center</label>
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
              </div>

              <ImageUploader
                value={mediaUrl}
                onChange={setMediaUrl}
                label="Photo Image *"
                helperText="Upload a high-resolution photo from your device or paste an online URL"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Caption explaining the activity..."
                  className="w-full px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none"
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
                  {isSaving ? 'Uploading...' : 'Save to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
