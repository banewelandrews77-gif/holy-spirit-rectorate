import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Download, Share2, Heart } from 'lucide-react';
import { DonationReceipt } from '../types';

interface DonationReceiptModalProps {
  receipt: DonationReceipt | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DonationReceiptModal: React.FC<DonationReceiptModalProps> = ({ receipt, isOpen, onClose }) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/receipt/' + receipt.receiptNumber);
    alert('Receipt link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border-2 border-amber-300 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold tracking-wide text-amber-300">Official Donation Receipt</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              title="Copy link"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div id="printable-receipt" className="p-8 sm:p-10 bg-[#fdfbf7] relative text-slate-800 font-serif">
          {/* Decorative Liturgical Border */}
          <div className="border-4 border-double border-amber-700/60 p-6 sm:p-8 rounded-2xl relative bg-white shadow-inner">
            
            {/* Watermark / Seal Icon in background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <span className="text-[260px] font-liturgical select-none">✠</span>
            </div>

            {/* Parish Header */}
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

            {/* Receipt Reference Bar */}
            <div className="flex flex-wrap items-center justify-between text-xs font-sans py-3 px-4 bg-stone-100/90 rounded-xl my-5 border border-stone-200">
              <div>
                <span className="text-slate-500 font-medium">Receipt No: </span>
                <span className="font-mono font-bold text-amber-900 text-sm">{receipt.receiptNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Date: </span>
                <span className="font-semibold text-slate-800">{new Date(receipt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Status: </span>
                <span className="font-bold text-emerald-700 uppercase tracking-wider">{receipt.status}</span>
              </div>
            </div>

            {/* Donor & Offering Details */}
            <div className="space-y-4 font-sans text-sm my-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Benefactor (Donor)</span>
                  <span className="text-base font-bold text-slate-900 block mt-0.5">{receipt.donorName}</span>
                  <span className="text-xs text-slate-600 block">{receipt.donorEmail}</span>
                  {receipt.donorPhone && (
                    <span className="text-xs text-slate-600 block">{receipt.donorPhone}</span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Designated Church / Outstation</span>
                  <span className="text-base font-bold text-amber-900 block mt-0.5">{receipt.churchName}</span>
                  <span className="text-xs text-slate-600 block">Purpose: <strong>{receipt.fundName}</strong></span>
                </div>
              </div>

              {/* Amount Highlight Box */}
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

            {/* Scripture Blessing */}
            <div className="text-center py-4 my-4 bg-amber-700/5 rounded-xl border border-amber-700/20 px-4">
              <p className="text-xs italic text-amber-950 font-serif leading-relaxed">
                {receipt.blessing}
              </p>
            </div>

            {/* Signatures & Seal */}
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

          <p className="text-[10px] font-sans text-center text-slate-400 mt-4 no-print">
            This is an authentic, computer-generated receipt from Holy Spirit Rectorate. Tax-exempt religious donation.
          </p>
        </div>

        {/* Modal Footer (Hidden in Print) */}
        <div className="no-print bg-stone-100 p-4 px-6 border-t border-stone-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors shadow"
          >
            Done & Close
          </button>
        </div>
      </div>
    </div>
  );
};
