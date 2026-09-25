import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Church,
  AlertCircle,
  Calendar,
  PhoneCall
} from 'lucide-react';
import { PARISH_INFO, SUB_CHURCHES } from '../data/parishData';
import { useParishTimetable } from '../hooks/useParishTimetable';

export const ContactPage: React.FC = () => {
  const { timetable } = useParishTimetable();
  const [searchParams] = useSearchParams();
  const defaultCategory = searchParams.get('category') || 'general';
  const defaultSubject = searchParams.get('subject') || '';

  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [churchId, setChurchId] = useState('holy-spirit');
  const [category, setCategory] = useState(defaultCategory);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState('');
  const [intentionDate, setIntentionDate] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: senderName,
          sender_email: senderEmail,
          sender_phone: senderPhone,
          church_id: churchId,
          category,
          subject,
          message,
          intention_date: category === 'mass_intention' ? intentionDate : null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccessMessage(data.message || 'Your message has been sent successfully. God bless you!');
      setSenderName('');
      setSenderEmail('');
      setSenderPhone('');
      setSubject('');
      setMessage('');
      setIntentionDate('');
      setIsSubmitting(false);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'An error occurred while submitting your message.');
    }
  };

  return (
    <div className="space-y-16 pb-20">

      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 lg:py-20 border-b border-amber-500/20 text-center relative">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-400/30">
            Parish Secretariat
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-liturgical tracking-wide">
            Contact Us & Mass Intentions
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Get in touch with the parish office, book Mass intentions, schedule pastoral counseling, or request sacramental records across our three centers.
          </p>
        </div>
      </section>

      {/* CONTACT INFO CARDS & FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Emergency Hotline Alert */}
            <div className="p-5 rounded-3xl bg-amber-700/10 border border-amber-600/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <PhoneCall className="w-4 h-4 text-amber-700" />
                <span>Emergency Sick Call Line</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                For urgent pastoral assistance, hospital visitation, and  / Anointing of the Sick:
              </p>
              <a
                href="tel:0205388058"
                className="text-lg font-mono font-bold text-amber-900 block hover:underline"
              >
                0205388058
              </a>
            </div>

            {/* Holy Spirit Main Office */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
                <Church className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-slate-900 font-liturgical text-base">Holy Spirit Parish Office</h3>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Main Parish Avenue, Kansaworodo, P.O. Box AX 1801, Sekondi-Takoradi, Ghana</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>+233 205388058 / +233 595934551</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>[EMAIL_ADDRESS]</span>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-stone-100">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-700 block">Office Hours:</span>
                    <span>Monday – Friday: 8:30 AM – 5:00 PM</span>
                    <span className="block">Saturday: 9:00 AM – 1:00 PM</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <span className="font-bold text-slate-700 block">Priest Consultation Days:</span>
                  <span>Tuesdays & Thursdays: 9:00 AM – 1:00 PM</span>
                </div>
              </div>
            </div>

            {/* Outstations Info */}
            <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 space-y-4">
              <h3 className="font-bold text-slate-900 font-liturgical text-sm">Sub-Churches Contacts</h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-slate-900 block">{timetable['st-anthony']?.name || 'St. Anthony of Padua'}</span>
                  <span className="text-slate-500 block">{timetable['st-anthony']?.location || 'Outstation in Kansaworodo'}</span>
                  <span className="text-amber-800 font-semibold block">Tel: +233 59 5934551 / +233 595934551</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-slate-900 block">{timetable['st-matthew']?.name || 'St. Matthew Catholic Church'}</span>
                  <span className="text-slate-500 block">{timetable['st-matthew']?.location || 'Ntankoful'}</span>
                  <span className="text-amber-800 font-semibold block">Tel: +233 20 5388058</span>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Contact & Mass Booking Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6">

              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Online Portal</span>
                <h2 className="text-2xl font-bold font-liturgical text-slate-900 mt-0.5">
                  Send Message or Book Mass Intention
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  All inquiries and intentions are reviewed directly by the parish office and clergy.
                </p>
              </div>

              {successMessage && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Category & Church Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose / Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-amber-600 font-medium"
                    >
                      <option value="general">General Parish Inquiry</option>
                      <option value="mass_intention">Book Holy Mass Intention</option>
                      <option value="pastoral_counseling">Priest Appointment / Counseling</option>
                      <option value="sacraments">Sacramental Records / Catechism</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Church Center *</label>
                    <select
                      value={churchId}
                      onChange={(e) => setChurchId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-amber-600 font-medium"
                    >
                      <option value="holy-spirit">Holy Spirit Rectorate (Main)</option>
                      <option value="st-anthony">St. Anthony of Padua</option>
                      <option value="st-matthew">St. Matthew Catholic Church</option>
                    </select>
                  </div>
                </div>

                {/* Sender Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Mary Asantewaa"
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="e.g. +233 24 412 3456"
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  {category === 'mass_intention' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Mass Date</label>
                      <input
                        type="date"
                        value={intentionDate}
                        onChange={(e) => setIntentionDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Thanksgiving Mass for Birthday / Baptism Booking"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Details *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide detailed information regarding your inquiry, prayer intention, or appointment request..."
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending to Parish Office...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Message to Office</span>
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>

        </div>
      </section>

      {/* LOCATION MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Directions & Church Locations</span>
            <h3 className="text-2xl font-bold font-liturgical text-slate-900">
              Visit Us in Person
            </h3>
            <p className="text-xs text-slate-500">
              Easily accessible across the Sekondi-Takoradi metropolis with ample parking and serene prayer grounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {[
              {
                title: 'Holy Spirit Rectorate',
                badge: 'Main Church',
                desc: 'Main Parish Avenue, Kansaworado. Landmark:',
                link: 'https://maps.google.com'
              },
              {
                title: 'St. Anthony of Padua',
                badge: 'Outstation',
                desc: 'St. Anthony Outstation Road, Kansaworado. Landmark:',
                link: 'https://maps.google.com'
              },
              {
                title: 'St. Matthew Catholic Church',
                badge: 'Outstation',
                desc: 'Community Center Junction, Ntankoful. Landmark: ',
                link: 'https://maps.google.com'
              }
            ].map((loc, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    {loc.badge}
                  </span>
                  <h4 className="font-bold text-slate-900 font-liturgical text-base mt-2">{loc.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{loc.desc}</p>
                </div>
                <a
                  href={loc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 pt-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Get Driving Directions</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
