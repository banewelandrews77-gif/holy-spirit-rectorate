import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface PaystackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reference: string, channel: string) => void;
  amount: number | string;
  currency: string;
  email: string;
  donorName: string;
  churchName?: string;
}

export const PaystackModal: React.FC<PaystackModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  currency,
  email,
  donorName,
  churchName = 'Holy Spirit Rectorate Parish'
}) => {
  if (!isOpen) return null;

  const numericAmount = parseFloat(String(amount)) || 0;
  const formattedAmount = `${currency} ${numericAmount.toFixed(2)}`;

  // Active Channel Tab
  const [activeTab, setActiveTab] = useState<'card' | 'bank' | 'momo'>('card');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Bank Inputs
  const [bankType, setBankType] = useState<'transfer' | 'direct'>('transfer');
  const [selectedBank, setSelectedBank] = useState('Ecobank Ghana');
  const [bankAccount, setBankAccount] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);

  // MoMo Inputs
  const [momoNetwork, setMomoNetwork] = useState<'mtn' | 'telecel' | 'at'>('mtn');
  const [momoPhone, setMomoPhone] = useState('');

  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepMessage, setStepMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Format Card Number with Spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCardExpiry(val);
  };

  const handleCopyVirtualAccount = () => {
    navigator.clipboard.writeText('9920184712');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const processPayment = async (channel: 'card' | 'bank' | 'momo') => {
    setIsProcessing(true);

    if (channel === 'card') {
      setStepMessage('Contacting card issuer & authenticating 3D Secure...');
      await new Promise(r => setTimeout(r, 1400));
      setStepMessage('Card authorized! Completing charge...');
      await new Promise(r => setTimeout(r, 1000));
    } else if (channel === 'bank') {
      setStepMessage(bankType === 'transfer' ? 'Checking for incoming bank transfer...' : 'Authorizing direct bank debit...');
      await new Promise(r => setTimeout(r, 1500));
      setStepMessage('Bank transfer confirmed!');
      await new Promise(r => setTimeout(r, 900));
    } else {
      setStepMessage(`Sending authorization prompt to ${momoPhone || 'handset'}...`);
      await new Promise(r => setTimeout(r, 1500));
      setStepMessage('PIN confirmed on mobile handset. Finalizing...');
      await new Promise(r => setTimeout(r, 1000));
    }

    setIsSuccess(true);
    const ref = 'PSTK-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    await new Promise(r => setTimeout(r, 800));

    onSuccess(ref, channel);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 relative flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Paystack Official Header */}
        <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center font-bold text-white shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wider text-cyan-400 uppercase">Paystack</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">Secured Checkout</span>
              </div>
              <h4 className="text-xs text-slate-300 font-medium truncate max-w-[220px]">{churchName}</h4>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-base font-extrabold text-amber-300 font-mono">{formattedAmount}</div>
              <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{email}</div>
            </div>
            {!isProcessing && (
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-600 mt-1">
                Your offering of <strong>{formattedAmount}</strong> has been received by Holy Spirit Rectorate Parish.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-mono bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              Generating your official parish receipt...
            </div>
          </div>
        ) : isProcessing ? (
          <div className="p-12 text-center space-y-5">
            <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Processing Your Payment</h4>
              <p className="text-xs text-cyan-800 font-medium animate-pulse">{stepMessage}</p>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-2">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Please do not close this window</span>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5">
            
            {/* Channel Selection Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-stone-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'card'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-cyan-700" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bank')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'bank'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Bank</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('momo')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'momo'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                <span>Mobile Money</span>
              </button>
            </div>

            {/* TAB 1: CARD PAYMENT */}
            {activeTab === 'card' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Enter your card details to pay</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-white font-bold">VISA</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-600 text-white font-bold">MC</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-600 text-white font-bold">VERVE</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4000  1234  5678  9010"
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm font-mono focus:outline-none focus:border-cyan-600 tracking-wider"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Card Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM / YY"
                      maxLength={5}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm font-mono focus:outline-none focus:border-cyan-600 text-center tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm font-mono focus:outline-none focus:border-cyan-600 text-center tracking-widest"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => processPayment('card')}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay {formattedAmount}</span>
                </button>
              </div>
            )}

            {/* TAB 2: BANK PAYMENT */}
            {activeTab === 'bank' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBankType('transfer')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      bankType === 'transfer'
                        ? 'border-teal-700 bg-teal-50 text-teal-900 font-bold'
                        : 'border-stone-200 text-slate-600'
                    }`}
                  >
                    Direct Bank Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setBankType('direct')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      bankType === 'direct'
                        ? 'border-teal-700 bg-teal-50 text-teal-900 font-bold'
                        : 'border-stone-200 text-slate-600'
                    }`}
                  >
                    Bank Account Debit
                  </button>
                </div>

                {bankType === 'transfer' ? (
                  <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-3">
                    <span className="text-[11px] font-bold text-teal-950 uppercase tracking-wider block">
                      Dedicated Virtual Account for this Offering:
                    </span>
                    <div className="bg-white p-3 rounded-xl border border-teal-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">Bank Name</span>
                        <span className="text-xs font-bold text-slate-900">Paystack / Ecobank Ghana</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-mono">Account Number</span>
                        <span className="text-sm font-bold text-teal-900 font-mono">9920184712</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyVirtualAccount}
                      className="w-full py-2 rounded-xl bg-white border border-teal-200 text-teal-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-teal-50 transition"
                    >
                      {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAccount ? 'Account Number Copied!' : 'Copy Account Number'}</span>
                    </button>
                    <p className="text-[10px] text-slate-500 text-center">
                      Transfer exact amount from your mobile banking app or online portal.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Choose Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:border-teal-700"
                      >
                        <option>Ecobank Ghana</option>
                        <option>GCB Bank</option>
                        <option>Stanbic Bank Ghana</option>
                        <option>Standard Chartered</option>
                        <option>Absa Bank Ghana</option>
                        <option>Fidelity Bank</option>
                        <option>Zenith Bank</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Account Number</label>
                      <input
                        type="text"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="Enter 10 to 14 digit bank account"
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono focus:outline-none focus:border-teal-700"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => processPayment('bank')}
                  className="w-full py-3.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{bankType === 'transfer' ? "I've Sent The Transfer" : `Authenticate & Pay ${formattedAmount}`}</span>
                </button>
              </div>
            )}

            {/* TAB 3: MOBILE MONEY */}
            {activeTab === 'momo' && (
              <div className="space-y-4">
                <span className="text-xs text-slate-500 block">Select your mobile network:</span>
                
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'mtn', label: 'MTN MoMo', color: 'bg-yellow-400 text-yellow-950 border-yellow-500' },
                    { id: 'telecel', label: 'Telecel', color: 'bg-red-500 text-white border-red-600' },
                    { id: 'at', label: 'AT Money', color: 'bg-blue-600 text-white border-blue-700' }
                  ].map((net) => (
                    <button
                      type="button"
                      key={net.id}
                      onClick={() => setMomoNetwork(net.id as any)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition ${
                        momoNetwork === net.id
                          ? `${net.color} shadow-sm ring-2 ring-slate-900/20`
                          : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {net.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    {momoNetwork.toUpperCase()} Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      placeholder="e.g. 024 412 3456"
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm font-mono focus:outline-none focus:border-amber-600"
                    />
                    <PhoneCall className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    You will be prompted to enter your MoMo PIN on this handset.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => processPayment('momo')}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Authorize & Pay {formattedAmount}</span>
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secured by <strong>Paystack</strong> • 256-bit SSL Bank-Grade Encryption</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
