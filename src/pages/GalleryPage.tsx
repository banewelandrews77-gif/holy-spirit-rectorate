import React, { useState, useEffect } from 'react';
import { Image, Video, Filter, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { GalleryItem } from '../types';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [albums, setAlbums] = useState<string[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let url = '/api/gallery';
    if (selectedAlbum !== 'all') {
      url += `?album=${encodeURIComponent(selectedAlbum)}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.items) setItems(data.items);
        if (data.albums) setAlbums(data.albums);
      })
      .catch(err => console.error(err));
  }, [selectedAlbum]);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const prevImage = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + items.length) % items.length);
    }
  };

  const nextImage = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % items.length);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 lg:py-20 border-b border-amber-500/20 text-center relative">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-400/30">
            Parish Visual Archives
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-liturgical tracking-wide">
            Photo & Video Gallery
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Memories of our Eucharistic feasts, episcopal confirmations, patronal processions, harvest celebrations, and youth outreaches.
          </p>
        </div>
      </section>

      {/* ALBUM FILTER PILLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start sm:justify-center">
          <button
            onClick={() => setSelectedAlbum('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedAlbum === 'all'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            All Albums ({items.length})
          </button>

          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setSelectedAlbum(album)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedAlbum === album
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {album}
            </button>
          ))}
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-2xl transition-all flex flex-col"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={item.thumbnail_url || item.media_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="px-3 py-1.5 rounded-full bg-white/90 text-slate-900 text-xs font-bold shadow-lg">
                    Click to View
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-amber-300 text-[10px] font-semibold backdrop-blur-sm">
                    {item.album}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <h3 className="font-bold text-slate-900 font-liturgical text-base group-hover:text-amber-700 transition-colors leading-snug">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {item.caption}
                  </p>
                )}
                <div className="pt-2 border-t border-stone-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{item.church_id === 'all' ? 'All Centers' : item.church_id.toUpperCase()}</span>
                  <span>{new Date(item.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {activeLightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-fade-in">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center space-y-4">
            <div className="relative max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-amber-400/20">
              <img
                src={items[activeLightboxIndex].media_url}
                alt={items[activeLightboxIndex].title}
                className="max-h-[70vh] max-w-full object-contain mx-auto"
              />
            </div>

            <div className="text-center text-white space-y-1 px-4 max-w-2xl">
              <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">
                {items[activeLightboxIndex].album} • Photo {activeLightboxIndex + 1} of {items.length}
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-liturgical">
                {items[activeLightboxIndex].title}
              </h3>
              {items[activeLightboxIndex].caption && (
                <p className="text-xs sm:text-sm text-slate-300 font-serif">
                  {items[activeLightboxIndex].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
