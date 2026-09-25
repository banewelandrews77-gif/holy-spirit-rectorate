import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Image',
  helperText = 'Upload a photo from your computer/phone or enter an online URL'
}) => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, GIF).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15MB limit.');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // Convert file to Base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              image: base64Data,
              filename: file.name
            })
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || 'Failed to upload image');
          }

          onChange(data.url);
        } catch (uploadErr: any) {
          setError(uploadErr.message || 'Error uploading file to server');
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read selected image file.');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Failed to process file');
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        <div className="flex items-center space-x-1 bg-stone-100 p-0.5 rounded-lg text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
              activeTab === 'upload' ? 'bg-white text-amber-800 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
              activeTab === 'url' ? 'bg-white text-amber-800 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Web URL</span>
          </button>
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: DIRECT FILE UPLOAD */}
      {activeTab === 'upload' ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-4 text-center transition ${
              dragOver ? 'border-amber-500 bg-amber-50/50' : 'border-stone-300 hover:border-amber-400 bg-stone-50/50 hover:bg-stone-50'
            }`}
          >
            {isUploading ? (
              <div className="py-4 flex flex-col items-center justify-center space-y-2">
                <RefreshCw className="w-6 h-6 text-amber-600 animate-spin" />
                <span className="text-xs font-bold text-slate-700">Uploading photo to parish storage...</span>
              </div>
            ) : (
              <div className="py-2 flex flex-col items-center justify-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-800">
                  Click to browse from device or drag & drop here
                </div>
                <span className="text-[10px] text-slate-500">
                  Supports JPG, PNG, WebP, GIF (Max 15MB)
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TAB 2: WEB URL INPUT */
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/... or /uploads/..."
            className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-slate-700"
          />
        </div>
      )}

      {/* CURRENT IMAGE PREVIEW */}
      {value && (
        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div className="w-14 h-14 rounded-lg overflow-hidden border border-stone-300 bg-white shrink-0 relative">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as any).style.display = 'none'; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Image Active
            </span>
            <p className="text-xs font-mono text-slate-600 truncate mt-0.5">{value}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Clear image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
