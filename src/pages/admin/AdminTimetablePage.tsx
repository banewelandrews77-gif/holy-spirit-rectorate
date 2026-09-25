import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Clock, 
  Calendar, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  RotateCcw, 
  ExternalLink,
  MapPin,
  Church,
  Info,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  useParishTimetable, 
  ParishTimetableData, 
  DEFAULT_TIMETABLE_DATA, 
  MassScheduleItem 
} from '../../hooks/useParishTimetable';
import { MassScheduleModal } from '../../components/MassScheduleModal';

type ChurchId = 'holy-spirit' | 'st-anthony' | 'st-matthew';

export const AdminTimetablePage: React.FC = () => {
  const { token, isEditor } = useAuth();
  const { timetable, isLoading, refetch, updateCachedTimetable } = useParishTimetable();
  const [searchParams, setSearchParams] = useSearchParams();
  const stationParam = searchParams.get('station') as ChurchId;

  const [formData, setFormData] = useState<ParishTimetableData>(timetable);
  const [activeChurch, setActiveChurch] = useState<ChurchId>(() => {
    return ['holy-spirit', 'st-anthony', 'st-matthew'].includes(stationParam) ? stationParam : 'holy-spirit';
  });

  useEffect(() => {
    if (['holy-spirit', 'st-anthony', 'st-matthew'].includes(stationParam) && stationParam !== activeChurch) {
      setActiveChurch(stationParam);
    }
  }, [stationParam]);
  
  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // New Mass form state
  const [newMassDay, setNewMassDay] = useState('');
  const [newMassTime, setNewMassTime] = useState('');
  const [newMassType, setNewMassType] = useState('');
  const [showAddMass, setShowAddMass] = useState(false);

  // New Devotion form state
  const [newDevotion, setNewDevotion] = useState('');
  const [showAddDevotion, setShowAddDevotion] = useState(false);

  // Sync formData with loaded timetable
  useEffect(() => {
    if (timetable) {
      setFormData(timetable);
    }
  }, [timetable]);

  const currentChurch = formData[activeChurch];

  const showNotification = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 5000);
  };

  // Center metadata changes
  const handleMetaChange = (field: 'name' | 'location' | 'priestInCharge' | 'patronSaint' | 'specialNotice', value: string) => {
    setFormData(prev => ({
      ...prev,
      [activeChurch]: {
        ...prev[activeChurch],
        [field]: value
      }
    }));
  };

  // Mass Schedule updates
  const handleMassChange = (index: number, field: keyof MassScheduleItem, value: string) => {
    const updatedSchedules = [...currentChurch.massSchedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value
    };

    setFormData(prev => ({
      ...prev,
      [activeChurch]: {
        ...prev[activeChurch],
        massSchedules: updatedSchedules
      }
    }));
  };

  const handleAddMass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMassDay.trim() || !newMassTime.trim()) {
      showNotification('error', 'Please enter both the Day/Occasion and the Mass Time.');
      return;
    }

    const newItem: MassScheduleItem = {
      day: newMassDay.trim(),
      time: newMassTime.trim(),
      type: newMassType.trim() || 'Holy Mass'
    };

    setFormData(prev => ({
      ...prev,
      [activeChurch]: {
        ...prev[activeChurch],
        massSchedules: [...prev[activeChurch].massSchedules, newItem]
      }
    }));

    setNewMassDay('');
    setNewMassTime('');
    setNewMassType('');
    setShowAddMass(false);
    showNotification('success', 'New Mass schedule entry added to draft.');
  };

  const handleDeleteMass = (index: number) => {
    const updatedSchedules = currentChurch.massSchedules.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [activeChurch]: {
        ...prev[activeChurch],
        massSchedules: updatedSchedules
      }
    }));
  };

  const handleMoveMass = (index: number, direction: 'up' | 'down') => {
    const updated = [...currentChurch.massSchedules];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setFormData(prev => ({
      ...prev,
      [activeChurch]: {
        ...prev[activeChurch],
        massSchedules: updated
      }
    }));
  };

  // Devotions updates
  const handleDevotionChange = (index: number, value: string) => {
    const updated = [...currentChurch.devotions];
    updated[index] = value;
    setFormData(prev => ({
      ...prev,
      [activeChurch]: {
        ...prev[activeChurch],
        devotions: updated
      }
    }));
  };

  const handleAddDevotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevotion.trim()) return;

    setFormData(prev => ({
      ...prev,
      [activeChurch]: {
        ...prev[activeChurch],
        devotions: [...prev[activeChurch].devotions, newDevotion.trim()]
      }
    }));

    setNewDevotion('');
    setShowAddDevotion(false);
    showNotification('success', 'New Devotion item added to draft.');
  };

  const handleDeleteDevotion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      [activeChurch]: {
        ...prev[activeChurch],
        devotions: prev[activeChurch].devotions.filter((_, i) => i !== index)
      }
    }));
  };

  // Save all timetable changes
  const handleSave = async () => {
    if (!isEditor) {
      showNotification('error', 'You must have an editor or administrator role to save changes.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key: 'liturgical_timetable',
          value: formData
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save timetable settings.');
      }

      updateCachedTimetable(formData);
      showNotification('success', 'Liturgical Timetable & Mass Schedules saved successfully! Live website updated.');
    } catch (err: any) {
      showNotification('error', err.message || 'Error occurred while saving timetable.');
    } finally {
      setIsSaving(false);
    }
  };

  // Restore Default Schedules
  const handleResetToDefaults = () => {
    if (window.confirm(`Are you sure you want to reset all 3 church schedules to original parish defaults? Any unsaved edits will be replaced.`)) {
      setFormData(DEFAULT_TIMETABLE_DATA);
      showNotification('success', 'Reset to default parish schedules. Click "Save All Changes" to persist.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <span className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* Top Header & Save Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-700">
              <Clock className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Liturgical CMS</span>
          </div>
          <h1 className="text-2xl font-bold font-liturgical text-slate-900 mt-1">
            Liturgical Timetable: Mass & Devotions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Holy Masses, Eucharistic adoration, novenas, and confession schedules for all 3 parish centers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-4 h-4 text-amber-600" />
            <span>Preview Modal</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-slate-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Restore default schedules"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionMessage && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 shadow-sm ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button 
            onClick={() => setActionMessage(null)}
            className="text-stone-400 hover:text-slate-800 font-bold text-sm px-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* Center Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'holy-spirit', label: 'Holy Spirit Rectorate', sub: 'Principal Parish & Seat', icon: '🏛️' },
          { id: 'st-anthony', label: 'St. Anthony of Padua', sub: 'Outstation Community', icon: '⛪' },
          { id: 'st-matthew', label: 'St. Matthew Catholic', sub: 'Outstation Community', icon: '⛪' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveChurch(tab.id as ChurchId);
              setSearchParams({ station: tab.id });
            }}
            className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3 ${
              activeChurch === tab.id
                ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-500/20'
                : 'bg-white text-slate-700 border-stone-200 hover:border-amber-300 hover:bg-stone-50'
            }`}
          >
            <span className="text-2xl mt-0.5">{tab.icon}</span>
            <div>
              <span className="font-bold text-sm block">{tab.label}</span>
              <span className={`text-[11px] block font-medium ${
                activeChurch === tab.id ? 'text-amber-100' : 'text-slate-500'
              }`}>
                {tab.sub}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Center Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8">
        
        {/* Section 1: Center Metadata */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
            <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">1</span>
            <h3 className="font-bold text-slate-900 font-liturgical text-base">Center Overview & Designation</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Church / Sanctuary Name</label>
              <input
                type="text"
                value={currentChurch.name}
                onChange={(e) => handleMetaChange('name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location & Address</label>
              <input
                type="text"
                value={currentChurch.location}
                onChange={(e) => handleMetaChange('location', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priest-in-Charge / Pastor on Call</label>
              <input
                type="text"
                value={currentChurch.priestInCharge}
                onChange={(e) => handleMetaChange('priestInCharge', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patron Saint & Titular Feast</label>
              <input
                type="text"
                value={currentChurch.patronSaint}
                onChange={(e) => handleMetaChange('patronSaint', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Eucharistic Liturgies (Mass Schedules) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="font-bold text-slate-900 font-liturgical text-base">
                Eucharistic Liturgies & Masses ({currentChurch.massSchedules.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowAddMass(!showAddMass)}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-xl border border-amber-200 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddMass ? 'Cancel' : 'Add New Mass'}</span>
            </button>
          </div>

          {/* Add Mass Form */}
          {showAddMass && (
            <form onSubmit={handleAddMass} className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Add Liturgical Mass Schedule</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Day / Occasion *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMassDay}
                    onChange={(e) => setNewMassDay(e.target.value)}
                    placeholder="e.g. Sunday (First Mass) or Wednesday"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Time Span *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMassTime}
                    onChange={(e) => setNewMassTime(e.target.value)}
                    placeholder="e.g. 7:00 AM – 9:00 AM"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-mono font-medium focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Liturgical Type / Details
                  </label>
                  <input
                    type="text"
                    value={newMassType}
                    onChange={(e) => setNewMassType(e.target.value)}
                    placeholder="e.g. Solemn Eucharist (English)"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMass(false)}
                  className="px-4 py-1.5 rounded-xl border border-stone-200 text-xs font-medium text-slate-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                >
                  Add to Schedule
                </button>
              </div>
            </form>
          )}

          {/* List of Mass Cards */}
          <div className="space-y-3">
            {currentChurch.massSchedules.map((schedule, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Day / Occasion
                    </label>
                    <input
                      type="text"
                      value={schedule.day}
                      onChange={(e) => handleMassChange(idx, 'day', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Time Info
                    </label>
                    <input
                      type="text"
                      value={schedule.time}
                      onChange={(e) => handleMassChange(idx, 'time', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono font-bold text-amber-800 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Liturgical Type
                    </label>
                    <input
                      type="text"
                      value={schedule.type}
                      onChange={(e) => handleMassChange(idx, 'type', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-slate-600 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                {/* Move & Delete Controls */}
                <div className="flex items-center gap-1 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 border-stone-200">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveMass(idx, 'up')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-white disabled:opacity-30 transition"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === currentChurch.massSchedules.length - 1}
                    onClick={() => handleMoveMass(idx, 'down')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-white disabled:opacity-30 transition"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMass(idx)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition ml-1"
                    title="Delete Mass entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Devotions & Adoration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">3</span>
              <h3 className="font-bold text-slate-900 font-liturgical text-base">
                Devotions, Adoration & Confession Hours ({currentChurch.devotions.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowAddDevotion(!showAddDevotion)}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-xl border border-amber-200 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddDevotion ? 'Cancel' : 'Add Devotion'}</span>
            </button>
          </div>

          {showAddDevotion && (
            <form onSubmit={handleAddDevotion} className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl flex gap-2">
              <input
                type="text"
                required
                value={newDevotion}
                onChange={(e) => setNewDevotion(e.target.value)}
                placeholder="e.g. Holy Rosary: 30 minutes before every Sunday Mass"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-amber-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Add Item
              </button>
            </form>
          )}

          <div className="space-y-2">
            {currentChurch.devotions.map((dev, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={dev}
                  onChange={(e) => handleDevotionChange(idx, e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-700 focus:outline-none focus:border-amber-600"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteDevotion(idx)}
                  className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                  title="Delete Devotion"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Pastoral Notice / Seasonal Announcement */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
            <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">4</span>
            <h3 className="font-bold text-slate-900 font-liturgical text-base">Seasonal Liturgical Notice</h3>
          </div>
          <p className="text-xs text-slate-500">
            Optional notice displayed at the foot of this center's timetable (e.g. Lent, Advent, or holiday confession adjustments).
          </p>
          <textarea
            rows={2}
            value={currentChurch.specialNotice || ''}
            onChange={(e) => handleMetaChange('specialNotice', e.target.value)}
            placeholder="e.g. Confessions are also heard 30 minutes before every weekday Mass upon request."
            className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-700 focus:outline-none focus:border-amber-600"
          />
        </div>

        {/* Bottom Save Button */}
        <div className="pt-6 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving All Schedules...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Timetable Changes</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Public Modal Live Preview */}
      <MassScheduleModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        defaultChurch={activeChurch}
      />

    </div>
  );
};
