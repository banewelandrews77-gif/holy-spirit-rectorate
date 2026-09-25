import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  RefreshCw, 
  CheckCircle2, 
  FileText,
  Trash2,
  AlertTriangle,
  Key,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Donation, DonationReceipt } from '../../types';
import { DonationReceiptModal } from '../../components/DonationReceiptModal';

export const AdminDonationsPage: React.FC = () => {
  const { token, isAdmin } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  
  // Filters
  const [churchFilter, setChurchFilter] = useState('all');
  const [fundFilter, setFundFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<DonationReceipt | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Paystack Settings Modal
  const [paystackModalOpen, setPaystackModalOpen] = useState(false);
  const [paystackKey, setPaystackKey] = useState('');
  const [savingKey, setSavingKey] = useState(false);

  useEffect(() => {
    fetchDonations();
    fetchPaystackKey();
  }, [churchFilter, fundFilter, paymentFilter]);

  const fetchPaystackKey = () => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings?.paystack_public_key) {
          setPaystackKey(data.settings.paystack_public_key);
        }
      })
      .catch(err => console.error(err));
  };

  const handleSavePaystackKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKey(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key: 'paystack_public_key',
          value: paystackKey.trim()
        })
      });
      if (!res.ok) throw new Error('Failed to save Paystack key');
      setActionMessage('Paystack Public Key saved successfully! The online donation portal will now use this key.');
      setTimeout(() => setActionMessage(''), 5000);
      setPaystackModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingKey(false);
    }
  };

  const fetchDonations = () => {
    setLoading(true);
    let url = `/api/donations?church_id=${churchFilter}&fund_category=${fundFilter}&payment_method=${paymentFilter}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.donations) setDonations(data.donations);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDonations();
  };

  const exportCSV = () => {
    let url = `/api/donations?format=csv&church_id=${churchFilter}&fund_category=${fundFilter}&payment_method=${paymentFilter}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `HolySpiritRectorate_Donations_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(err => alert('Failed to download CSV: ' + err.message));
  };

  const openReceipt = (receiptNumber: string) => {
    fetch(`/api/donations/receipt/${receiptNumber}`)
      .then(res => res.json())
      .then(data => {
        if (data.receipt) {
          setSelectedReceipt(data.receipt);
          setReceiptModalOpen(true);
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeleteDonation = async (id: number, receiptNumber: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete donation ${receiptNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete donation');
      }

      fetchDonations();
      setActionMessage(`Donation ${receiptNumber} deleted successfully.`);
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleClearDemo = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete ALL seeded demo donation records?\n\n' +
      'This will remove all test transactions (Kofi Mensah, Akosua Boateng, Dr. Patricia Osei, etc.) and leave your ledger completely clean for actual parish records.'
    );
    if (!confirmed) return;

    try {
      const res = await fetch('/api/donations/clear-demo', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to clear demo records');
      }

      fetchDonations();
      setActionMessage(data.message || 'Demo donations cleared successfully.');
      setTimeout(() => setActionMessage(''), 5000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const totalSum = donations.reduce((sum, d) => sum + (d.status === 'completed' ? d.amount : 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Financial Stewardship</span>
          <h1 className="text-2xl font-bold font-liturgical text-slate-900 mt-0.5">Donations & Offerings Ledger</h1>
          <p className="text-xs text-slate-500">
            Filtered Total: <strong className="font-mono text-amber-900 text-sm">GHS {totalSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> ({donations.length} transactions)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <>
              <button
                onClick={() => setPaystackModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition shadow-xs"
                title="Configure Paystack Gateway Public Key"
              >
                <Key className="w-4 h-4 text-teal-600" />
                <span>Paystack Key</span>
              </button>

              <button
                onClick={handleClearDemo}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition shadow-xs"
                title="Delete all demo test donations"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Clear Demo Records</span>
              </button>
            </>
          )}

          <button
            onClick={fetchDonations}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* FILTER CONTROLS */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by donor name, email, or receipt number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-amber-600"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
          >
            Filter
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-stone-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Center</label>
            <select
              value={churchFilter}
              onChange={(e) => setChurchFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
            >
              <option value="all">All Worship Centers</option>
              <option value="holy-spirit">Holy Spirit Rectorate</option>
              <option value="st-anthony">St. Anthony of Padua</option>
              <option value="st-matthew">St. Matthew Catholic Church</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Fund</label>
            <select
              value={fundFilter}
              onChange={(e) => setFundFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
            >
              <option value="all">All Funds</option>
              <option value="tithe">Tithe & First Fruits</option>
              <option value="offertory">Sunday Offertory</option>
              <option value="building">Building Fund</option>
              <option value="harvest">Harvest & Thanksgiving</option>
              <option value="intentions">Mass Intentions</option>
              <option value="welfare">St. Vincent de Paul / Welfare</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Payment Method</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
            >
              <option value="all">All Gateways</option>
              <option value="paystack">Paystack (MoMo & Card)</option>
              <option value="momo">Direct Mobile Money (MoMo)</option>
              <option value="card">Card (Stripe / Bank)</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
        </div>
      </div>

      {/* DONATIONS TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6">
        {loading ? (
          <div className="p-12 text-center">
            <span className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin inline-block" />
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No donations match the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Receipt No</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Donor Name</th>
                  <th className="pb-3">Center</th>
                  <th className="pb-3">Fund Category</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Gateway</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-slate-700">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 font-mono font-bold text-amber-900">{d.receipt_number}</td>
                    <td className="py-3 text-slate-500">
                      {new Date(d.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 font-medium text-slate-900">
                      <div>{d.donor_name}</div>
                      <div className="text-[10px] text-slate-400">{d.donor_email}</div>
                    </td>
                    <td className="py-3 capitalize text-slate-600">{d.church_id.replace('-', ' ')}</td>
                    <td className="py-3 capitalize text-slate-600">{d.fund_category}</td>
                    <td className="py-3 font-mono font-bold text-slate-900">
                      {d.currency} {d.amount.toFixed(2)}
                    </td>
                    <td className="py-3 uppercase text-[10px] font-semibold text-slate-600">
                      {d.payment_method === 'paystack' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-900 border border-cyan-300">
                          PAYSTACK
                        </span>
                      ) : (
                        `${d.payment_method} ${d.momo_network ? `(${d.momo_network})` : ''}`
                      )}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openReceipt(d.receipt_number)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded-lg border border-amber-200 text-[11px] transition-colors"
                          title="View official parish receipt"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteDonation(d.id, d.receipt_number)}
                            className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                            title="Delete this donation record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official Receipt Modal */}
      <DonationReceiptModal
        receipt={selectedReceipt}
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
      />

      {/* Paystack Key Configuration Modal */}
      {paystackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 rounded-xl text-teal-700">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Paystack Gateway Configuration</h3>
                  <p className="text-xs text-slate-500">Connect live or test Ghana Mobile Money and Card payments</p>
                </div>
              </div>
              <button 
                onClick={() => setPaystackModalOpen(false)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePaystackKey} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Paystack Public Key (pk_test_... or pk_live_...) *
                </label>
                <input
                  type="text"
                  required
                  value={paystackKey}
                  onChange={(e) => setPaystackKey(e.target.value)}
                  placeholder="pk_test_xxxxxxxxxxxxxxxxxxxxxxxx or pk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-mono text-xs focus:outline-none focus:border-teal-600 bg-stone-50"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  Provide your <strong>Public Key</strong> starting with <code className="bg-stone-100 px-1 rounded">pk_test_</code> or <code className="bg-stone-100 px-1 rounded">pk_live_</code>. Never share your secret key.
                </span>
              </div>

              <div className="bg-cyan-50/70 border border-cyan-200 p-4 rounded-2xl text-xs space-y-2 text-cyan-950">
                <span className="font-bold block flex items-center gap-1.5 text-cyan-900">
                  How to obtain your parish Paystack Public Key:
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                  <li>Log in to your <strong>Paystack Dashboard</strong> at <a href="https://dashboard.paystack.com/#/settings/developer" target="_blank" rel="noreferrer" className="text-cyan-700 underline font-semibold inline-flex items-center gap-0.5">dashboard.paystack.com <ExternalLink className="w-3 h-3" /></a></li>
                  <li>Go to <strong>Settings</strong> &rarr; <strong>API Keys & Webhooks</strong>.</li>
                  <li>Copy your <strong>Public Key</strong> (<code className="bg-cyan-100/70 px-1 rounded font-mono">pk_test_...</code> for testing, or <code className="bg-cyan-100/70 px-1 rounded font-mono">pk_live_...</code> for real parish offerings).</li>
                  <li>Paste it above and click Save.</li>
                </ol>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setPaystackModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-stone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingKey}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-600 transition shadow disabled:opacity-50"
                >
                  {savingKey ? 'Saving Key...' : 'Save Paystack Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
