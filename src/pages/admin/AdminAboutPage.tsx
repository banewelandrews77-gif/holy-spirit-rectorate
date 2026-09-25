import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  Church, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  RefreshCw,
  Quote
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ImageUploader } from '../../components/common/ImageUploader';

interface ClergyMember {
  name: string;
  title: string;
  role: string;
  image: string;
}

interface PpcExecutive {
  name: string;
  title: string;
}

interface CoreValue {
  title: string;
  desc: string;
}

interface AboutPageData {
  diocese: string;
  headerSubtitle: string;
  historyText: string;
  rectorMessage: {
    name: string;
    title: string;
    image: string;
    greetingHeadline: string;
    paragraphs: string[];
  };
  vision: string;
  mission: string;
  coreValues: CoreValue[];
  clergy: ClergyMember[];
  ppcExecutives: PpcExecutive[];
}

const DEFAULT_ABOUT_DATA: AboutPageData = {
  diocese: 'Catholic Diocese of Sekondi-Takoradi',
  headerSubtitle: 'The Holy Spirit Rectorate stands as an active beacon of Catholic faith, uniting the main sanctuary with St. Anthony of Padua and St. Matthew Catholic Church under the Catholic Diocese of Sekondi-Takoradi.',
  historyText: 'Established to address the rapid spiritual growth of the Catholic faithful in the municipality, Holy Spirit Rectorate has grown into a spiritual sanctuary renowned for vibrant liturgical celebrations, deep community involvement, and warm Christian brotherhood.',
  rectorMessage: {
    name: 'Rev. Fr. Albin Kissi Ernim',
    title: 'Parish Rector',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop',
    greetingHeadline: '"A House of Prayer for All Faithful"',
    paragraphs: [
      "Dear brothers and sisters in Christ, it gives me great pastoral joy to welcome you to the online sanctuary of Holy Spirit Rectorate and our cherished outstations, St. Anthony of Padua and St. Matthew Catholic Church.",
      "As a Rectorate, our foremost mission is the sanctification of souls through the reverent celebration of the Holy Eucharist, the sacraments, and generous Christian charity. Whether you are a lifelong parishioner, a newcomer in our community, or a visitor exploring the Catholic faith, you have a home here.",
      "May the gifts and fruits of the Holy Spirit abide with you and your households always."
    ]
  },
  vision: 'To be a vibrant, Christ-centered Catholic community empowered by the Holy Spirit to witness, evangelize, and serve in unity and love.',
  mission: 'To proclaim the Gospel through reverent liturgical worship, comprehensive pastoral care, deep sacramental life, and proactive community charity across Holy Spirit Rectorate, St. Anthony of Padua, and St. Matthew Catholic Church.',
  coreValues: [
    { title: 'Reverent Worship', desc: 'Fostering deep prayer, Eucharistic adoration, and active liturgical participation.' },
    { title: 'Evangelization & Faith Formation', desc: 'Nurturing sound Catholic doctrine through ongoing catechism, youth formation, and Bible study.' },
    { title: 'Communion & Unity', desc: 'Building strong bonds of brotherhood across the Rectorate and its outstations.' },
    { title: 'Compassionate Charity', desc: 'Extending Christ’s healing hands to the poor, elderly, sick, and vulnerable.' }
  ],
  clergy: [
    {
      name: 'Rev. Fr. Albin Kissi Ernim',
      title: 'Parish Rector',
      role: 'Overall spiritual leader, pastoral coordinator, and administrator of the Rectorate and sub-churches.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop'
    },
    {
      name: 'Rev. Fr. Augustine K. Mensah',
      title: 'Associate Priest',
      role: 'Pastoral ministry coordinator, youth chaplain, and outstation spiritual animator.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
    },
    {
      name: 'Rev. Deacon Francis Xavier Boakye',
      title: 'Permanent Deacon',
      role: 'Liturgical assistant, baptism coordinator, and St. Vincent de Paul advisor.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop'
    }
  ],
  ppcExecutives: [
    { name: 'Dr. Kwabena Asante', title: 'PPC Chairman' },
    { name: 'Mrs. Evelyn Arthur', title: 'PPC Vice-Chairperson' },
    { name: 'Mr. Patrick Senyo', title: 'PPC Secretary' },
    { name: 'Mrs. Grace Osei-Bonsu', title: 'Finance Committee Chairperson' },
    { name: 'Mr. Victor Ansah', title: 'Church Youth President' }
  ]
};

export const AdminAboutPage: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<AboutPageData>(DEFAULT_ABOUT_DATA);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'rector' | 'vision' | 'clergy' | 'ppc' | 'general'>('rector');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Clergy modal / editing
  const [clergyModalOpen, setClergyModalOpen] = useState(false);
  const [clergyEditIndex, setClergyEditIndex] = useState<number | null>(null);
  const [clergyForm, setClergyForm] = useState<ClergyMember>({ name: '', title: '', role: '', image: '' });

  // PPC modal / editing
  const [ppcModalOpen, setPpcModalOpen] = useState(false);
  const [ppcEditIndex, setPpcEditIndex] = useState<number | null>(null);
  const [ppcForm, setPpcForm] = useState<PpcExecutive>({ name: '', title: '' });

  // Core Value modal / editing
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [valueEditIndex, setValueEditIndex] = useState<number | null>(null);
  const [valueForm, setValueForm] = useState<CoreValue>({ title: '', desc: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const json = await res.json();
      if (json.settings && json.settings.about_page) {
        setData({
          ...DEFAULT_ABOUT_DATA,
          ...json.settings.about_page
        });
      }
    } catch (err) {
      console.error('Failed to load about settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          key: 'about_page',
          value: data
        })
      });
      const result = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'About Us page content saved successfully!' });
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage({ type: 'error', text: result.error || 'Failed to save settings' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error occurred while saving.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Clergy handlers
  const openAddClergy = () => {
    setClergyEditIndex(null);
    setClergyForm({
      name: '',
      title: 'Associate Priest',
      role: '',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop'
    });
    setClergyModalOpen(true);
  };

  const openEditClergy = (index: number) => {
    setClergyEditIndex(index);
    setClergyForm({ ...data.clergy[index] });
    setClergyModalOpen(true);
  };

  const saveClergyMember = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...data.clergy];
    if (clergyEditIndex !== null) {
      updated[clergyEditIndex] = clergyForm;
    } else {
      updated.push(clergyForm);
    }
    setData({ ...data, clergy: updated });
    setClergyModalOpen(false);
  };

  const deleteClergyMember = (index: number) => {
    if (window.confirm(`Are you sure you want to remove ${data.clergy[index].name} from the clergy list?`)) {
      const updated = data.clergy.filter((_, i) => i !== index);
      setData({ ...data, clergy: updated });
    }
  };

  // PPC handlers
  const openAddPpc = () => {
    setPpcEditIndex(null);
    setPpcForm({ name: '', title: '' });
    setPpcModalOpen(true);
  };

  const openEditPpc = (index: number) => {
    setPpcEditIndex(index);
    setPpcForm({ ...data.ppcExecutives[index] });
    setPpcModalOpen(true);
  };

  const savePpcExecutive = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...data.ppcExecutives];
    if (ppcEditIndex !== null) {
      updated[ppcEditIndex] = ppcForm;
    } else {
      updated.push(ppcForm);
    }
    setData({ ...data, ppcExecutives: updated });
    setPpcModalOpen(false);
  };

  const deletePpcExecutive = (index: number) => {
    if (window.confirm(`Remove ${data.ppcExecutives[index].name} from the council list?`)) {
      const updated = data.ppcExecutives.filter((_, i) => i !== index);
      setData({ ...data, ppcExecutives: updated });
    }
  };

  // Core Value handlers
  const openAddValue = () => {
    setValueEditIndex(null);
    setValueForm({ title: '', desc: '' });
    setValueModalOpen(true);
  };

  const openEditValue = (index: number) => {
    setValueEditIndex(index);
    setValueForm({ ...data.coreValues[index] });
    setValueModalOpen(true);
  };

  const saveValue = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...data.coreValues];
    if (valueEditIndex !== null) {
      updated[valueEditIndex] = valueForm;
    } else {
      updated.push(valueForm);
    }
    setData({ ...data, coreValues: updated });
    setValueModalOpen(false);
  };

  const deleteValue = (index: number) => {
    const updated = data.coreValues.filter((_, i) => i !== index);
    setData({ ...data, coreValues: updated });
  };

  // Rector Message paragraph helpers
  const handleParagraphChange = (index: number, val: string) => {
    const paragraphs = [...data.rectorMessage.paragraphs];
    paragraphs[index] = val;
    setData({
      ...data,
      rectorMessage: { ...data.rectorMessage, paragraphs }
    });
  };

  const addParagraph = () => {
    setData({
      ...data,
      rectorMessage: {
        ...data.rectorMessage,
        paragraphs: [...data.rectorMessage.paragraphs, '']
      }
    });
  };

  const removeParagraph = (index: number) => {
    if (data.rectorMessage.paragraphs.length <= 1) {
      alert('At least one paragraph is required.');
      return;
    }
    const paragraphs = data.rectorMessage.paragraphs.filter((_, i) => i !== index);
    setData({
      ...data,
      rectorMessage: { ...data.rectorMessage, paragraphs }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <span className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-700 font-bold">
            <span>Parish Content Management</span>
            <span>•</span>
            <span className="text-slate-500">Live Editor</span>
          </div>
          <h1 className="text-2xl font-bold font-liturgical text-slate-900 mt-1">
            Edit "About Us" Page
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize the Rector's message, vision, pastoral pillars, clergy directory, and PPC leadership.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-slate-700 hover:bg-stone-50 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Page</span>
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm hover:shadow disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish Updates</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
          statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-200 space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'rector', label: "Rector's Message", icon: Quote },
          { id: 'clergy', label: 'Clergy & Pastoral Team', icon: Church },
          { id: 'ppc', label: 'PPC Executives', icon: Users },
          { id: 'vision', label: 'Vision, Mission & Values', icon: Award },
          { id: 'general', label: 'Diocese & Overview', icon: CheckCircle2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                active 
                  ? 'bg-slate-900 text-amber-400 shadow-sm' 
                  : 'text-slate-600 hover:bg-stone-200/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: RECTOR'S MESSAGE */}
      {activeTab === 'rector' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h2 className="text-lg font-bold font-liturgical text-slate-900">Rector's Pastoral Welcome Message</h2>
            <p className="text-xs text-slate-500">This features prominently at the top of the About Us page.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rector's Full Name</label>
              <input
                type="text"
                value={data.rectorMessage.name}
                onChange={(e) => setData({
                  ...data,
                  rectorMessage: { ...data.rectorMessage, name: e.target.value }
                })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                placeholder="e.g. Rev. Fr. Albin Kissi Ernim"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Title / Designation</label>
              <input
                type="text"
                value={data.rectorMessage.title}
                onChange={(e) => setData({
                  ...data,
                  rectorMessage: { ...data.rectorMessage, title: e.target.value }
                })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                placeholder="e.g. Parish Rector"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Greeting Headline (Quote)</label>
              <input
                type="text"
                value={data.rectorMessage.greetingHeadline}
                onChange={(e) => setData({
                  ...data,
                  rectorMessage: { ...data.rectorMessage, greetingHeadline: e.target.value }
                })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                placeholder='e.g. "A House of Prayer for All Faithful"'
              />
            </div>

            <div className="md:col-span-2">
              <ImageUploader
                value={data.rectorMessage.image}
                onChange={(newUrl) => setData({
                  ...data,
                  rectorMessage: { ...data.rectorMessage, image: newUrl }
                })}
                label="Rector Portrait Photo"
                helperText="Upload official portrait from device or paste an online image URL"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Message Body Paragraphs</h3>
                <p className="text-[11px] text-slate-500">Each block represents a formatted paragraph in the message.</p>
              </div>
              <button
                type="button"
                onClick={addParagraph}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Paragraph</span>
              </button>
            </div>

            {data.rectorMessage.paragraphs.map((p, idx) => (
              <div key={idx} className="flex gap-3 items-start bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-xs font-mono font-bold text-amber-700 mt-2.5">#{idx + 1}</span>
                <textarea
                  rows={3}
                  value={p}
                  onChange={(e) => handleParagraphChange(idx, e.target.value)}
                  className="flex-1 text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-sans"
                  placeholder="Enter paragraph text..."
                />
                <button
                  type="button"
                  onClick={() => removeParagraph(idx)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition mt-1"
                  title="Delete paragraph"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CLERGY & PASTORAL TEAM */}
      {activeTab === 'clergy' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h2 className="text-lg font-bold font-liturgical text-slate-900">Priests & Pastoral Ministers</h2>
              <p className="text-xs text-slate-500">Manage the priests, associate clergy, and deacons ministering to the parish.</p>
            </div>
            <button
              type="button"
              onClick={openAddClergy}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-400 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Clergy Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.clergy.map((c, idx) => (
              <div key={idx} className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:border-amber-400 transition shadow-sm">
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src={c.image} 
                      alt={c.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop'; }}
                    />
                    <span className="absolute bottom-2 left-2 bg-slate-950/80 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {c.title}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h4 className="font-bold text-sm text-slate-900 font-liturgical">{c.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{c.role}</p>
                  </div>
                </div>

                <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEditClergy(idx)}
                    className="flex items-center gap-1 text-xs text-slate-700 hover:text-amber-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteClergyMember(idx)}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PPC COUNCIL EXECUTIVES */}
      {activeTab === 'ppc' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h2 className="text-lg font-bold font-liturgical text-slate-900">Parish Pastoral Council (PPC) Executives</h2>
              <p className="text-xs text-slate-500">Executive leaders collaborating with the parish priests on administration and ministries.</p>
            </div>
            <button
              type="button"
              onClick={openAddPpc}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-400 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Council Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.ppcExecutives.map((exec, idx) => (
              <div key={idx} className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{exec.name}</h4>
                  <span className="text-[11px] font-semibold text-amber-700">{exec.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditPpc(idx)}
                    className="p-1.5 text-slate-600 hover:text-amber-700 rounded-lg hover:bg-white transition"
                    title="Edit executive"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePpcExecutive(idx)}
                    className="p-1.5 text-rose-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition"
                    title="Delete executive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VISION, MISSION & VALUES */}
      {activeTab === 'vision' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h2 className="text-lg font-bold font-liturgical text-slate-900">Vision, Mission & Core Values</h2>
            <p className="text-xs text-slate-500">Core guiding statements that define the spirit of Holy Spirit Rectorate.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parish Vision Statement</label>
              <textarea
                rows={3}
                value={data.vision}
                onChange={(e) => setData({ ...data, vision: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parish Mission Statement</label>
              <textarea
                rows={3}
                value={data.mission}
                onChange={(e) => setData({ ...data, mission: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-sans"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Core Pastoral Pillars</h3>
                <p className="text-[11px] text-slate-500">Displayed in the 4-column guiding principles grid.</p>
              </div>
              <button
                type="button"
                onClick={openAddValue}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Value Pillar</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.coreValues.map((val, idx) => (
                <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 font-liturgical">{val.title}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditValue(idx)}
                        className="p-1 text-slate-600 hover:text-amber-700 rounded hover:bg-white transition"
                        title="Edit value"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteValue(idx)}
                        className="p-1 text-rose-600 hover:text-rose-700 rounded hover:bg-rose-50 transition"
                        title="Delete value"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GENERAL & DIOCESE */}
      {activeTab === 'general' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h2 className="text-lg font-bold font-liturgical text-slate-900">Diocese & Overview Texts</h2>
            <p className="text-xs text-slate-500">Configure Diocesan jurisdiction and introductory banner text.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Diocese Name</label>
              <input
                type="text"
                value={data.diocese}
                onChange={(e) => setData({ ...data, diocese: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Header Subtitle</label>
              <textarea
                rows={3}
                value={data.headerSubtitle}
                onChange={(e) => setData({ ...data, headerSubtitle: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parish History & Overview Summary</label>
              <textarea
                rows={4}
                value={data.historyText}
                onChange={(e) => setData({ ...data, historyText: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CLERGY MEMBER */}
      {clergyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-base font-liturgical text-slate-900">
                {clergyEditIndex !== null ? 'Edit Clergy Member' : 'Add New Clergy Member'}
              </h3>
              <button
                onClick={() => setClergyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveClergyMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name & Title</label>
                <input
                  type="text"
                  required
                  value={clergyForm.name}
                  onChange={(e) => setClergyForm({ ...clergyForm, name: e.target.value })}
                  placeholder="e.g. Rev. Fr. Augustine K. Mensah"
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ecclesial Designation</label>
                <input
                  type="text"
                  required
                  value={clergyForm.title}
                  onChange={(e) => setClergyForm({ ...clergyForm, title: e.target.value })}
                  placeholder="e.g. Associate Priest, Deacon, Parish Rector"
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ministry Assignment / Pastoral Role</label>
                <textarea
                  rows={3}
                  required
                  value={clergyForm.role}
                  onChange={(e) => setClergyForm({ ...clergyForm, role: e.target.value })}
                  placeholder="Brief pastoral description, chaplaincies, or responsibilities..."
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <ImageUploader
                value={clergyForm.image}
                onChange={(newUrl) => setClergyForm({ ...clergyForm, image: newUrl })}
                label="Clergy Member Photo"
                helperText="Upload photo from your device or paste an online image URL"
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setClergyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-stone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition shadow"
                >
                  {clergyEditIndex !== null ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PPC EXECUTIVE */}
      {ppcModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-base font-liturgical text-slate-900">
                {ppcEditIndex !== null ? 'Edit PPC Executive' : 'Add Council Executive'}
              </h3>
              <button
                onClick={() => setPpcModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={savePpcExecutive} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Executive Name</label>
                <input
                  type="text"
                  required
                  value={ppcForm.name}
                  onChange={(e) => setPpcForm({ ...ppcForm, name: e.target.value })}
                  placeholder="e.g. Dr. Kwabena Asante"
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Office / Portfolio Title</label>
                <input
                  type="text"
                  required
                  value={ppcForm.title}
                  onChange={(e) => setPpcForm({ ...ppcForm, title: e.target.value })}
                  placeholder="e.g. PPC Chairman, Finance Committee Chairperson"
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setPpcModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-stone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition shadow"
                >
                  {ppcEditIndex !== null ? 'Save Executive' : 'Add Executive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CORE VALUE */}
      {valueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-base font-liturgical text-slate-900">
                {valueEditIndex !== null ? 'Edit Core Value' : 'Add Pastoral Pillar'}
              </h3>
              <button
                onClick={() => setValueModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveValue} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Value Title</label>
                <input
                  type="text"
                  required
                  value={valueForm.title}
                  onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })}
                  placeholder="e.g. Reverent Worship"
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={valueForm.desc}
                  onChange={(e) => setValueForm({ ...valueForm, desc: e.target.value })}
                  placeholder="Explain this core pillar..."
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setValueModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-stone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition shadow"
                >
                  {valueEditIndex !== null ? 'Save Value' : 'Add Value'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
