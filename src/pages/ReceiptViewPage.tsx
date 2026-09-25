import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DonationReceipt } from '../types';
import { DonationReceiptModal } from '../components/DonationReceiptModal';
import { Printer, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ReceiptViewPage: React.FC = () => {
  const { receiptNumber } = useParams<{ receiptNumber: string }>();
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (receiptNumber) {
      fetch(`/api/donations/receipt/${receiptNumber}`)
        .then(res => res.json())
        .then(data => {
          if (data.receipt) {
            setReceipt(data.receipt);
          } else {
            setError(data.error || 'Receipt not found');
          }
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [receiptNumber]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-liturgical">Receipt Lookup</h2>
        <p className="text-xs text-rose-600">{error || 'Receipt not found'}</p>
        <Link to="/" className="inline-block px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between no-print">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Parish Website</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* RENDER EMBEDDED RECEIPT */}
      <div id="printable-receipt" className="p-8 sm:p-10 bg-[#fdfbf7] rounded-3xl border-2 border-amber-300 shadow-2xl relative text-slate-800 font-serif">
        <div className="border-4 border-double border-amber-700/60 p-6 sm:p-8 rounded-2xl relative bg-white shadow-inner">
          
          <div className="text-center pb-6 border-b-2 border-amber-900/20">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-700/10 border-2 border-amber-600 flex items-center justify-center text-amber-700 mb-2">
              <span className="text-2xl font-bold font-liturgical">✠</span>
            </div>
            <p className="text-[11px] font-sans uppercase tracking-widest text-amber-800 font-semibold">
              Catholic Diocese of Sekondi-Takoradi
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold font-liturgical text-slate-900 tracking-wide mt-0.5">
              HOLY SPIRIT RECTORATE
            </h1>
            <p className="text-xs font-sans text-slate-600 mt-1">
              And Outstations: St. Anthony of Padua • St. Matthew Catholic Church
            </p>
            <div className="inline-block mt-3 px-4 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-sans font-semibold tracking-wider uppercase">
              Official Parish Donor Certificate
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs font-sans py-3 px-4 bg-stone-100/90 rounded-xl my-5 border border-stone-200">
            <div>
              <span className="text-slate-500 font-medium">Receipt No: </span>
              <span className="font-mono font-bold text-amber-900 text-sm">{receipt.receiptNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Date: </span>
              <span className="font-semibold text-slate-800">{new Date(receipt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Status: </span>
              <span className="font-bold text-emerald-700 uppercase tracking-wider">{receipt.status}</span>
            </div>
          </div>

          <div className="space-y-4 font-sans text-sm my-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Benefactor (Donor)</span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">{receipt.donorName}</span>
                <span className="text-xs text-slate-600 block">{receipt.donorEmail}</span>
                {receipt.donorPhone && <span className="text-xs text-slate-600 block">{receipt.donorPhone}</span>}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Designated Church / Outstation</span>
                <span className="text-base font-bold text-amber-900 block mt-0.5">{receipt.churchName}</span>
                <span className="text-xs text-slate-600 block">Purpose: <strong>{receipt.fundName}</strong></span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-amber-800 block">Amount Offered</span>
                <span className="text-xs text-slate-500">Frequency: {receipt.frequency}</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-amber-950 font-serif tracking-tight">
                  {receipt.currency} {receipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <div className="text-[11px] text-slate-600 flex items-center justify-end gap-1 mt-0.5">
                  <span>via {receipt.paymentMethod.toUpperCase()}</span>
                  {receipt.momoNetwork && <span>({receipt.momoNetwork.toUpperCase()})</span>}
                </div>
              </div>
            </div>

            {receipt.notes && (
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                <span className="font-bold text-slate-600 block mb-0.5">Donor's Intention / Notes:</span>
                <span className="italic text-slate-700">"{receipt.notes}"</span>
              </div>
            )}
          </div>

          <div className="text-center py-4 my-4 bg-amber-700/5 rounded-xl border border-amber-700/20 px-4">
            <p className="text-xs italic text-amber-950 font-serif leading-relaxed">
              {receipt.blessing}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 items-end pt-6 border-t-2 border-stone-200 font-sans text-xs text-slate-600">
            <div>
              <div className="w-32 h-12 flex items-end justify-center mb-1">
                <span className="font-serif italic text-amber-900 text-base font-bold">Fr. Albin Kissi Ernim</span>
              </div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
                Rev. Fr. Albin Kissi Ernim (Rector)
              </div>
              <div className="text-[10px] text-slate-500">Holy Spirit Rectorate Parish</div>
            </div>

            <div className="text-right">
              <div className="inline-block p-2 rounded-xl bg-stone-100 border border-stone-300 text-center mb-1 font-mono text-[9px] text-slate-600 leading-tight">
                <div className="w-14 h-14 bg-white border border-stone-300 mx-auto flex items-center justify-center font-bold text-amber-700 text-xs">
                  [QR SEAL]
                </div>
                <span>REF: {receipt.transactionRef}</span>
              </div>
              <div className="text-[10px] text-slate-500">Verified Electronic Parish Stamp</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
