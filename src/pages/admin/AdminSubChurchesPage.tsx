import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Users, 
  Church, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  ExternalLink, 
  Award, 
  ShieldCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  useSubStationsGovernance, 
  SubStationsGovernanceRecord, 
  DEFAULT_GOVERNANCE_DATA,
  ExecutiveMember 
} from '../../hooks/useSubStationsGovernance';
import { SUB_CHURCHES } from '../../data/parishData';

type StationId = 'st-anthony' | 'st-matthew' | 'holy-spirit';

export const AdminSubChurchesPage: React.FC = () => {
  const { token, isEditor } = useAuth();
  const { governance, isLoading, updateCachedGovernance } = useSubStationsGovernance();
  const [searchParams, setSearchParams] = useSearchParams();
  const stationParam = searchParams.get('station') as StationId;

  const [activeStation, setActiveStation] = useState<StationId>(() => {
    return ['st-anthony', 'st-matthew', 'holy-spirit'].includes(stationParam) 
      ? stationParam 
      : 'st-anthony';
  });

  const [formData, setFormData] = useState<SubStationsGovernanceRecord>(governance);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Society form state
  const [newSocietyName, setNewSocietyName] = useState('');
  const [showAddSociety, setShowAddSociety] = useState(false);

  // New Executive form state
  const [newExecName, setNewExecName] = useState('');
  const [newExecRole, setNewExecRole] = useState('');
  const [showAddExec, setShowAddExec] = useState(false);

  // Inline editing state for executive
  const [editingExecIndex, setEditingExecIndex] = useState<number | null>(null);
  const [editExecName, setEditExecName] = useState('');
  const [editExecRole, setEditExecRole] = useState('');

  // Inline editing state for society
  const [editingSocietyIndex, setEditingSocietyIndex] = useState<number | null>(null);
  const [editSocietyName, setEditSocietyName] = useState('');

  // Sync with loaded governance data
  useEffect(() => {
    if (governance) {
      setFormData(governance);
    }
  }, [governance]);

  // Sync with URL query parameter
  useEffect(() => {
    if (['st-anthony', 'st-matthew', 'holy-spirit'].includes(stationParam) && stationParam !== activeStation) {
      setActiveStation(stationParam);
    }
  }, [stationParam]);

  const showMsg = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const currentStationData = formData[activeStation] || { societies: [], executiveCouncil: [] };
  const currentChurchMeta = activeStation === 'holy-spirit'
    ? {
        name: 'Holy Spirit Rectorate',
        patronSaint: 'The Holy Spirit',
        location: 'Main Parish Avenue, Cathedral Road',
        tagline: 'Principal Parish Seat & Spiritual Mother Church',
        link: '/'
      }
    : {
        name: SUB_CHURCHES[activeStation]?.name || activeStation,
        patronSaint: SUB_CHURCHES[activeStation]?.patronSaint || 'Patron Saint',
        location: SUB_CHURCHES[activeStation]?.location || 'Outstation',
        tagline: SUB_CHURCHES[activeStation]?.tagline || 'Sub-Church Outstation',
        link: `/subchurches/${activeStation}`
      };

  // --- SOCIETY HANDLERS ---
  const handleAddSociety = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocietyName.trim()) return;

    setFormData(prev => ({
      ...prev,
      [activeStation]: {
        ...prev[activeStation],
        societies: [...prev[activeStation].societies, newSocietyName.trim()]
      }
    }));

    setNewSocietyName('');
    setShowAddSociety(false);
    showMsg('success', `Added society to ${currentChurchMeta.name}. Remember to click "Save All Changes".`);
  };

  const handleDeleteSociety = (index: number) => {
    const soc = currentStationData.societies[index];
    if (!window.confirm(`Are you sure you want to remove "${soc}"?`)) return;

    setFormData(prev => ({
      ...prev,
      [activeStation]: {
        ...prev[activeStation],
        societies: prev[activeStation].societies.filter((_, idx) => idx !== index)
      }
    }));
  };

  const handleMoveSociety = (index: number, direction: 'up' | 'down') => {
    const list = [...currentStationData.societies];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;

    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;

    setFormData(prev => ({
      ...prev,
      [activeStation]: {
        ...prev[activeStation],
        societies: list
      }
    }));
  };

  const handleStartEditSociety = (index: number) => {
    setEditingSocietyIndex(index);
    setEditSocietyName(currentStationData.societies[index]);
  };

  const handleSaveEditSociety = (index: number) => {
    if (!editSocietyName.trim()) return;

    const list = [...currentStationData.societies];
    list[index] = editSocietyName.trim();

    setFormData(prev => ({
      ...prev,
      [activeStation]: {
        ...prev[activeStation],
        societies: list
      }
    }));
    setEditingSocietyIndex(null);
  };

  // --- EXECUTIVE HANDLERS ---
  const handleAddExecutive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExecName.trim() || !newExecRole.trim()) return;

    const newMember: ExecutiveMember = {
      name: newExecName.trim(),
      role: newExecRole.trim()
    };

    setFormData(prev => ({
      ...prev,
      [activeStation]: {
        ...prev[activeStation],
        executiveCouncil: [...prev[activeStation].executiveCouncil, newMember]
      }
    }));

    setNewExecName('');
    setNewExecRole('');
    setShowAddExec(false);
    showMsg('success', `Added "${newMember.name}" (${newMember.role}) to leadership. Click "Save All Changes" to persist.`);
  };

  const handleDeleteExecutive = (index: number) => {
    const exec = currentStationData.executiveCouncil[index];
    if (!window.confirm(`Are you sure you want to remove ${exec.name} (${exec.role}) from the executive committee?`)) return;

    setFormData(prev => ({
      ...prev,
      [activeStation]: {
        ...prev[activeStation],
        executiveCouncil: prev[activeStation].executiveCouncil.filter((_, idx) => idx !== index)
      }
    }));
  };

  const handleMoveExecutive = (index: number, direction: 'up' | 'down') => {
    const list = [...currentStationData.executiveCouncil];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;

    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;

    setFormData(prev => ({
      ...prev,
      [activeStation]: {
        ...prev[activeStation],
        executiveCouncil: list
      }
    }));
  };

  const handleStartEditExec = (index: number) => {
    setEditingExecIndex(index);
    setEditExecName(currentStationData.executiveCouncil[index].name);
    setEditExecRole(currentStationData.executiveCouncil[index].role);
  };

  const handleSaveEditExec = (index: number) => {
    if (!editExecName.trim() || !editExecRole.trim()) return;

    const list = [...currentStationData.executiveCouncil];
    list[index] = {
      name: editExecName.trim(),
      role: editExecRole.trim()
    };

    setFormData(prev => ({
      ...prev,
      [activeStation]: {
        ...prev[activeStation],
        executiveCouncil: list
      }
    }));
    setEditingExecIndex(null);
  };

  // --- SAVE ALL CHANGES ---
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key: 'substations_governance',
          value: formData
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save governance settings.');
      }

      updateCachedGovernance(formData);
      showMsg('success', 'Sub-station societies, committees, and executive councils saved successfully! Live website updated.');
    } catch (err: any) {
      showMsg('error', err.message || 'Error occurred while saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset societies and executive committees to default church records?')) {
      setFormData(DEFAULT_GOVERNANCE_DATA);
      showMsg('success', 'Reset to initial default records. Click "Save All Changes" to persist.');
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
              <Users className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Sub-Station CMS</span>
          </div>
          <h1 className="text-2xl font-bold font-liturgical text-slate-900 mt-1">
            Outstation Societies & Executive Committees
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage, add, and update active church societies, guilds, committees, and PPC executive councils.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-slate-700 hover:bg-stone-50 transition"
            title="Reset to default records"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
      {notification && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 shadow-sm ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-stone-400 hover:text-slate-800 font-bold text-sm px-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* Station Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'st-anthony', label: 'St. Anthony of Padua', sub: 'Outstation Community', icon: '⛪' },
          { id: 'st-matthew', label: 'St. Matthew Catholic Church', sub: 'Outstation Community', icon: '⛪' },
          { id: 'holy-spirit', label: 'Holy Spirit Rectorate', sub: 'Principal Parish Seat', icon: '🏛️' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveStation(tab.id as StationId);
              setSearchParams({ station: tab.id });
            }}
            className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3 ${
              activeStation === tab.id
                ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-500/20'
                : 'bg-white text-slate-700 border-stone-200 hover:border-amber-300 hover:bg-stone-50'
            }`}
          >
            <span className="text-2xl mt-0.5">{tab.icon}</span>
            <div>
              <span className="font-bold text-sm block">{tab.label}</span>
              <span className={`text-[11px] block font-medium ${
                activeStation === tab.id ? 'text-amber-100' : 'text-slate-500'
              }`}>
                {tab.sub}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Active Station Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Currently Editing: {currentChurchMeta.name}
          </span>
          <h2 className="text-lg font-bold font-liturgical text-slate-900 mt-1">
            Governance, Societies & Committees
          </h2>
          <p className="text-xs text-slate-500">{currentChurchMeta.location} • Patron: {currentChurchMeta.patronSaint}</p>
        </div>

        <Link
          to={currentChurchMeta.link}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline"
        >
          <span>View Public Station Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* TWO MAIN CMS SECTIONS: SOCIETIES & EXECUTIVES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* SECTION 1: SOCIETIES & GUILDS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <h3 className="text-base font-bold font-liturgical text-slate-900">
                  Societies & Guilds ({currentStationData.societies.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Active fraternities, youth fellowships, and parish choirs at {currentChurchMeta.name}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddSociety(!showAddSociety)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Society</span>
            </button>
          </div>

          {/* Add Society Form */}
          {showAddSociety && (
            <form onSubmit={handleAddSociety} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <span className="text-xs font-bold text-amber-900 block">Add New Church Society / Guild:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newSocietyName}
                  onChange={(e) => setNewSocietyName(e.target.value)}
                  placeholder="e.g., St. Anthony Youth Fellowship or Legion of Mary"
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs focus:outline-none focus:border-amber-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSociety(false)}
                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-slate-700 text-xs font-medium rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Societies List */}
          <div className="space-y-2.5">
            {currentStationData.societies.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No societies listed yet. Click "Add Society" above.</p>
            ) : (
              currentStationData.societies.map((soc, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-stone-200 hover:border-amber-300 bg-stone-50/50 flex items-center justify-between gap-3 transition"
                >
                  {editingSocietyIndex === idx ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editSocietyName}
                        onChange={(e) => setEditSocietyName(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-stone-300 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditSociety(idx)}
                        className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold"
                      >
                        Done
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSocietyIndex(null)}
                        className="px-2 py-1 bg-stone-200 text-slate-700 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate">{soc}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSociety(idx, 'up')}
                          className="p-1 rounded text-stone-400 hover:text-slate-700 hover:bg-stone-200 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === currentStationData.societies.length - 1}
                          onClick={() => handleMoveSociety(idx, 'down')}
                          className="p-1 rounded text-stone-400 hover:text-slate-700 hover:bg-stone-200 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEditSociety(idx)}
                          className="p-1 rounded text-stone-500 hover:text-amber-700 hover:bg-amber-50 ml-1"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSociety(idx)}
                          className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECTION 2: EXECUTIVE COMMITTEE & PPC LEADERSHIP */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <h3 className="text-base font-bold font-liturgical text-slate-900">
                  Executive Committee & Officers ({currentStationData.executiveCouncil.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Chairmen, secretaries, treasurers, and outstation committee leaders.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddExec(!showAddExec)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Leader</span>
            </button>
          </div>

          {/* Add Executive Form */}
          {showAddExec && (
            <form onSubmit={handleAddExecutive} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Add Executive / Committee Member:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newExecName}
                    onChange={(e) => setNewExecName(e.target.value)}
                    placeholder="e.g., Mr. Joseph Tetteh"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs focus:outline-none focus:border-amber-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Role / Office</label>
                  <input
                    type="text"
                    required
                    value={newExecRole}
                    onChange={(e) => setNewExecRole(e.target.value)}
                    placeholder="e.g., Outstation Committee Chairman"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs focus:outline-none focus:border-amber-600 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddExec(false)}
                  className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-slate-700 text-xs font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Save Member
                </button>
              </div>
            </form>
          )}

          {/* Executives List */}
          <div className="space-y-2.5">
            {currentStationData.executiveCouncil.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No executive members listed yet. Click "Add Leader" above.</p>
            ) : (
              currentStationData.executiveCouncil.map((exec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-stone-200 hover:border-amber-300 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                >
                  {editingExecIndex === idx ? (
                    <div className="flex-1 space-y-2 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editExecName}
                          onChange={(e) => setEditExecName(e.target.value)}
                          placeholder="Member Name"
                          className="px-2.5 py-1 text-xs rounded-lg border border-stone-300 bg-white"
                        />
                        <input
                          type="text"
                          value={editExecRole}
                          onChange={(e) => setEditExecRole(e.target.value)}
                          placeholder="Role"
                          className="px-2.5 py-1 text-xs rounded-lg border border-stone-300 bg-white"
                        />
                      </div>
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSaveEditExec(idx)}
                          className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold"
                        >
                          Done
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingExecIndex(null)}
                          className="px-2 py-1 bg-stone-200 text-slate-700 rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 block font-liturgical text-sm">
                          {exec.name}
                        </span>
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 inline-block">
                          {exec.role}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveExecutive(idx, 'up')}
                          className="p-1 rounded text-stone-400 hover:text-slate-700 hover:bg-stone-200 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === currentStationData.executiveCouncil.length - 1}
                          onClick={() => handleMoveExecutive(idx, 'down')}
                          className="p-1 rounded text-stone-400 hover:text-slate-700 hover:bg-stone-200 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEditExec(idx)}
                          className="p-1 rounded text-stone-500 hover:text-amber-700 hover:bg-amber-50 ml-1"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExecutive(idx)}
                          className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
