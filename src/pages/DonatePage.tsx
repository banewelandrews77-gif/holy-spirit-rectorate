import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  CheckCircle2, 
  Building2, 
  Copy, 
  Check, 
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { DonationReceipt, ChurchId, FundCategory, PaymentMethod } from '../types';
import { DonationReceiptModal } from '../components/DonationReceiptModal';
import { PaystackModal } from '../components/PaystackModal';

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

export const DonatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedChurch = searchParams.get('church') as ChurchId || 'holy-spirit';

  // Form State
  const [churchId, setChurchId] = useState<ChurchId>(preselectedChurch);
  const [fundCategory, setFundCategory] = useState<FundCategory>('tithe');
  const [frequency, setFrequency] = useState<'one-time' | 'weekly' | 'monthly'>('one-time');
  const [currency, setCurrency] = useState('GHS');
  const [amount, setAmount] = useState<number | string>(100);
  const [customAmount, setCustomAmount] = useState('');
  
  // Donor details
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Payment Method - 100% Paystack
  const paymentMethod: PaymentMethod = 'paystack';

  // Paystack Key (Loaded securely from server settings)
  const [paystackKey, setPaystackKey] = useState<string>(() => {
    return (import.meta as any).env?.VITE_PAYSTACK_PUBLIC_KEY || '';
  });

  // Processing & Receipt
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [paystackModalOpen, setPaystackModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);

  // Fetch parish settings for Paystack Public Key
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings?.paystack_public_key) {
          const remoteKey = String(data.settings.paystack_public_key).trim();
          if (remoteKey) {
            setPaystackKey(remoteKey);
          }
        }
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const isValidPaystackKey = (key: string) => {
    if (!key) return false;
    const trimmed = key.trim();
    return (trimmed.startsWith('pk_test_') || trimmed.startsWith('pk_live_')) && 
           trimmed.length >= 25 && 
           !trimmed.includes('41ed1553c3917d5cba1bba69d3000676b7f32cfb') && 
           !trimmed.includes('c7076aa9811e10d462169a470f6697ed4f53fd87') &&
           !trimmed.includes('placeholder');
  };

  useEffect(() => {
    if (preselectedChurch) {
      setChurchId(preselectedChurch);
    }
  }, [preselectedChurch]);

  const presetAmounts = currency === 'GHS' 
    ? [50, 100, 200, 500, 1000] 
    : [25, 50, 100, 250, 500];

  const handleAmountClick = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    setAmount(val);
  };

  const executeDonationPost = async (transactionRef?: string) => {
    setIsProcessing(true);
    const numericAmount = parseFloat(String(amount));

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: donorPhone || null,
          church_id: churchId,
          fund_category: fundCategory,
          amount: numericAmount,
          currency,
          frequency,
          payment_method: 'paystack',
          transaction_ref: transactionRef || undefined,
          notes
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Donation submission failed');
      }

      // Trigger Confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      setReceipt(data.receipt);
      setReceiptModalOpen(true);
      setIsProcessing(false);

      // Reset fields
      setDonorName('');
      setDonorEmail('');
      setDonorPhone('');
      setNotes('');
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'An error occurred while processing your donation.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const numericAmount = parseFloat(String(amount));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Please select or enter a valid donation amount.');
      return;
    }

    if (!donorName || !donorEmail) {
      setErrorMessage('Please enter your name and email address for receipt delivery.');
      return;
    }

    const hasValidKey = isValidPaystackKey(paystackKey);

    // If a valid live key is configured by parish admin and script is loaded, launch live Paystack checkout
    if (hasValidKey && window.PaystackPop) {
      setIsProcessing(true);
      try {
        const handler = window.PaystackPop.setup({
          key: paystackKey.trim(),
          email: donorEmail.trim(),
          amount: Math.round(numericAmount * 100), // amount in pesewas
          currency: currency,
          channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
          ref: 'HSR-PSTK-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          metadata: {
            custom_fields: [
              { display_name: "Donor Name", variable_name: "donor_name", value: donorName },
              { display_name: "Worship Center", variable_name: "church_id", value: churchId },
              { display_name: "Giving Category", variable_name: "fund_category", value: fundCategory },
              { display_name: "Phone Number", variable_name: "donor_phone", value: donorPhone || 'N/A' },
              { display_name: "Frequency", variable_name: "frequency", value: frequency },
              { display_name: "Notes / Prayer Request", variable_name: "notes", value: notes || 'None' }
            ]
          },
          callback: function(response: { reference: string; trxref?: string }) {
            const ref = response.reference || response.trxref;
            executeDonationPost(ref);
          },
          onClose: function() {
            setIsProcessing(false);
            setErrorMessage('Payment dialog was closed. Your card, bank account, or mobile money has not been debited.');
          }
        });

        handler.openIframe();
        return;
      } catch (err: any) {
        console.warn('Paystack popup trigger error:', err);
        setIsProcessing(false);
      }
    }

    // Launch official Paystack checkout modal (supporting Cards, Bank, and MoMo)
    setIsProcessing(false);
    setPaystackModalOpen(true);
  };

  const handlePaystackSuccess = async (ref: string) => {
    setPaystackModalOpen(false);
    await executeDonationPost(ref);
  };

  const copyBankDetails = () => {
    const details = `Ecobank Ghana - Holy Spirit Rectorate Parish, Account: 1441001234567`;
    navigator.clipboard.writeText(details);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 lg:py-20 border-b border-amber-500/20 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 space-y-3 relative z-10">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-400/30">
            Secure Giving Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-liturgical tracking-wide">
            Support God's Work Online
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-serif italic max-w-xl mx-auto">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." (2 Cor 9:7)
          </p>
        </div>
      </section>

      {/* MAIN DONATION WIZARD */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-2xl space-y-8">
          
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* STEP 1: CHOOSE CHURCH & FUND */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="font-bold text-slate-900 font-liturgical text-base">Select Center & Purpose</h3>
              </div>

              {/* Target Church Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Designated Worship Center
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'holy-spirit', label: 'Holy Spirit Rectorate', sub: 'Principal Parish' },
                    { id: 'st-anthony', label: 'St. Anthony of Padua', sub: 'Outstation Community' },
                    { id: 'st-matthew', label: 'St. Matthew Catholic', sub: 'Outstation Community' }
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setChurchId(c.id as ChurchId)}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        churchId === c.id
                          ? 'border-amber-600 bg-amber-50/70 text-slate-900 ring-2 ring-amber-500/20 shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 text-slate-700'
                      }`}
                    >
                      <span className="text-sm font-bold block">{c.label}</span>
                      <span className="text-[11px] text-amber-800 font-medium block">{c.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fund Category Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Giving Fund / Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'tithe', label: 'Tithe & First Fruits' },
                    { id: 'offertory', label: 'Sunday Offertory' },
                    { id: 'building', label: 'Church Building Fund' },
                    { id: 'harvest', label: 'Harvest & Thanksgiving' },
                    { id: 'intentions', label: 'Mass Intentions Stipend' },
                    { id: 'welfare', label: 'St. Vincent de Paul / Poor' }
                  ].map((f) => (
                    <button
                      type="button"
                      key={f.id}
                      onClick={() => setFundCategory(f.id as FundCategory)}
                      className={`p-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                        fundCategory === f.id
                          ? 'bg-slate-900 text-amber-300 border-slate-900 shadow'
                          : 'bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 2: AMOUNT & FREQUENCY */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="font-bold text-slate-900 font-liturgical text-base">Select Amount & Frequency</h3>
              </div>

              {/* Frequency buttons */}
              <div className="flex rounded-xl bg-stone-100 p-1 max-w-sm">
                {(['one-time', 'weekly', 'monthly'] as const).map((freq) => (
                  <button
                    type="button"
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold capitalize transition-all ${
                      frequency === freq
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>

              {/* Currency & Preset Amounts */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Amount ({currency})
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 focus:outline-none"
                  >
                    <option value="GHS">GHS (Ghana Cedi ₵)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {presetAmounts.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => handleAmountClick(p)}
                      className={`py-2.5 px-3 rounded-xl text-sm font-mono font-bold border transition-all ${
                        amount === p && !customAmount
                          ? 'border-amber-600 bg-amber-600 text-white shadow-md'
                          : 'border-stone-200 bg-white text-slate-800 hover:bg-stone-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div>
                  <input
                    type="number"
                    placeholder={`Or enter custom amount in ${currency}...`}
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-600 font-mono"
                    min="1"
                    step="any"
                  />
                </div>
              </div>
            </div>

            {/* STEP 3: DONOR DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="font-bold text-slate-900 font-liturgical text-base">Donor Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Benefactor *</label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Kofi & Akosua Mensah"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (For Receipt) *</label>
                  <input
                    type="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="donor@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Prayer Request / Intention / Note (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Thanksgiving for family healing, blessing of new home, or memorial for beloved..."
                  className="w-full px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {/* STEP 4: PAYMENT GATEWAY (100% PAYSTACK - CARDS, BANK & MOMO) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                <h3 className="font-bold text-slate-900 font-liturgical text-base">Payment Method: Paystack Gateway</h3>
              </div>

              {/* Unified Official Gateway Container */}
              <div className="bg-gradient-to-br from-cyan-50/70 via-teal-50/40 to-amber-50/30 border-2 border-teal-600/30 rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm">
                
                {/* Header Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md shrink-0">
                      <Sparkles className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">Paystack Official Parish Checkout</h4>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-700 text-white">
                          Verified Gateway
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Accepting Credit/Debit Cards, Direct Bank Accounts, and Mobile Money across Ghana and globally.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 Channels Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Cards Channel */}
                  <div className="p-4 rounded-2xl bg-white border border-teal-100/80 shadow-2xs space-y-2 hover:border-teal-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-slate-900 text-white">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Instant</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Credit & Debit Cards</span>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        Visa, Mastercard & Verve (Local & International)
                      </span>
                    </div>
                  </div>

                  {/* Bank Accounts Channel */}
                  <div className="p-4 rounded-2xl bg-white border border-teal-100/80 shadow-2xs space-y-2 hover:border-teal-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-teal-800 text-white">
                        <Building2 className="w-4 h-4 text-teal-200" />
                      </span>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">Secure</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Bank Accounts & Transfer</span>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        Direct bank account debit and instant bank transfer
                      </span>
                    </div>
                  </div>

                  {/* Mobile Money Channel */}
                  <div className="p-4 rounded-2xl bg-white border border-teal-100/80 shadow-2xs space-y-2 hover:border-teal-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-amber-600 text-white">
                        <Smartphone className="w-4 h-4 text-white" />
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">All Networks</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Ghana Mobile Money</span>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        MTN MoMo, Telecel Cash & AT Money
                      </span>
                    </div>
                  </div>

                </div>

                {/* How it Works Reassurance */}
                <div className="bg-white/90 border border-teal-100 p-4 rounded-2xl text-xs text-slate-700 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                    <p>
                      Clicking <strong>Give via Paystack</strong> below will open Paystack's official secure payment dialog.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                    <p>
                      You can select <strong>Card</strong>, <strong>Bank</strong>, or <strong>Mobile Money</strong> inside the popup to complete your offering.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                    <p>
                      An official rectorate donation receipt and certificate will be generated and displayed for download immediately.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 hover:from-teal-600 hover:to-slate-800"
              >
                {isProcessing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting to Paystack Secure Checkout...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 fill-white" />
                    <span>Give {currency} {amount ? Number(amount).toFixed(2) : '0.00'} via Paystack</span>
                  </>
                )}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  PCI-DSS Level 1 Encrypted
                </span>
                <span>•</span>
                <span>Cards, Bank & Mobile Money</span>
                <span>•</span>
                <span>Instant Parish Receipt Issued</span>
              </div>
            </div>

          </form>

        </div>
      </section>

      {/* PARISH BANK WIRE DETAILS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Parish Secretariat Wire</span>
              <h3 className="text-xl font-bold font-liturgical text-slate-900 mt-0.5">
                Official Bank Wire & Physical Parish Endowments
              </h3>
            </div>
            <button
              onClick={copyBankDetails}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-stone-200"
            >
              {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBank ? 'Copied' : 'Copy Details'}</span>
            </button>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1 text-xs">
            <span className="font-bold text-slate-900 block text-sm">Ecobank Ghana (Parish Treasury)</span>
            <span className="text-slate-500 block">Account Number: <strong>1441001234567</strong></span>
            <span className="text-slate-500 block">Account Name: <strong>Holy Spirit Rectorate Parish</strong></span>
            <span className="text-slate-500 block">Branch: <strong>Parish Main Branch, Sekondi-Takoradi</strong></span>
          </div>
        </div>
      </section>

      {/* Paystack Official Checkout Dialog (Cards, Bank, and MoMo) */}
      <PaystackModal
        isOpen={paystackModalOpen}
        onClose={() => setPaystackModalOpen(false)}
        onSuccess={handlePaystackSuccess}
        amount={amount}
        currency={currency}
        email={donorEmail}
        donorName={donorName}
        churchName={
          churchId === 'st-anthony'
            ? 'St. Anthony of Padua Catholic Church'
            : churchId === 'st-matthew'
            ? 'St. Matthew Catholic Church'
            : 'Holy Spirit Rectorate Parish'
        }
      />

      {/* Official Receipt Modal */}
      <DonationReceiptModal
        receipt={receipt}
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
      />

    </div>
  );
};
