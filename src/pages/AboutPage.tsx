import React, { useState, useEffect } from 'react';
import { Church, Users, Shield, Heart, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { PARISH_INFO } from '../data/parishData';

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

export const AboutPage: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutPageData>({
    diocese: PARISH_INFO.diocese,
    headerSubtitle: 'The Holy Spirit Rectorate stands as an active beacon of Catholic faith, uniting the main sanctuary with St. Anthony of Padua and St. Matthew Catholic Church under the Catholic Diocese of Sekondi-Takoradi.',
    historyText: 'Established to address the rapid spiritual growth of the Catholic faithful in the municipality, Holy Spirit Rectorate has grown into a spiritual sanctuary renowned for vibrant liturgical celebrations, deep community involvement, and warm Christian brotherhood.',
    rectorMessage: {
      name: PARISH_INFO.clergy[0]?.name || 'Rev. Fr. Albin Kissi Ernim',
      title: PARISH_INFO.clergy[0]?.title || 'Parish Rector',
      image: PARISH_INFO.clergy[0]?.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop',
      greetingHeadline: '"A House of Prayer for All Faithful"',
      paragraphs: [
        "Dear brothers and sisters in Christ, it gives me great pastoral joy to welcome you to the online sanctuary of Holy Spirit Rectorate and our cherished outstations, St. Anthony of Padua and St. Matthew Catholic Church.",
        "As a Rectorate, our foremost mission is the sanctification of souls through the reverent celebration of the Holy Eucharist, the sacraments, and generous Christian charity. Whether you are a lifelong parishioner, a newcomer in our community, or a visitor exploring the Catholic faith, you have a home here.",
        "May the gifts and fruits of the Holy Spirit abide with you and your households always."
      ]
    },
    vision: PARISH_INFO.vision,
    mission: PARISH_INFO.mission,
    coreValues: PARISH_INFO.coreValues,
    clergy: PARISH_INFO.clergy,
    ppcExecutives: PARISH_INFO.ppcExecutives
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings && data.settings.about_page) {
          setAboutData(prev => ({
            ...prev,
            ...data.settings.about_page
          }));
        }
      })
      .catch(err => console.error('Failed to fetch about page settings:', err));
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">

      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 lg:py-20 border-b border-amber-500/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-400/30">
            About Our Parish Community
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-liturgical tracking-wide mt-4">
            History, Leadership & Structure
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            {aboutData.headerSubtitle}
          </p>
        </div>
      </section>

      {/* RECTOR'S MESSAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 text-center">
            <div className="w-48 h-48 mx-auto rounded-3xl overflow-hidden shadow-xl border-4 border-amber-200 relative mb-4">
              <img 
                src={aboutData.rectorMessage.image} 
                alt={aboutData.rectorMessage.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as any).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop';
                }}
              />
            </div>
            <h3 className="font-bold text-slate-900 font-liturgical text-lg">{aboutData.rectorMessage.name}</h3>
            <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider">{aboutData.rectorMessage.title}</p>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Pastoral Greeting</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-liturgical text-slate-900">
              {aboutData.rectorMessage.greetingHeadline}
            </h2>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed font-serif">
              {aboutData.rectorMessage.paragraphs.map((para, idx) => (
                <p key={idx} className={idx === aboutData.rectorMessage.paragraphs.length - 1 ? "italic text-slate-800 pt-1" : ""}>
                  {para}
                </p>
              ))}
            </div>
            <div className="pt-2 text-xs font-semibold text-slate-500">
              {aboutData.rectorMessage.name} • {aboutData.rectorMessage.title}
            </div>
          </div>
        </div>
      </section>

      {/* VISION, MISSION & PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 space-y-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-700/10 text-amber-700 flex items-center justify-center font-bold text-lg font-liturgical mb-2">
              ✠
            </span>
            <h3 className="text-xl font-bold font-liturgical text-slate-900">Our Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {aboutData.vision}
            </p>
          </div>

          <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 space-y-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-700/10 text-amber-700 flex items-center justify-center font-bold text-lg font-liturgical mb-2">
              ✠
            </span>
            <h3 className="text-xl font-bold font-liturgical text-slate-900">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {aboutData.mission}
            </p>
          </div>

        </div>

        {/* Core Pillars */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Guiding Principles</span>
          <h2 className="text-2xl font-bold font-liturgical text-slate-900 mt-1">Our Core Pastoral Pillars</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aboutData.coreValues.map((val, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:border-amber-300 transition-all space-y-2">
              <span className="text-amber-600 font-mono font-bold text-xs">0{idx + 1}.</span>
              <h4 className="font-bold text-slate-900 text-base">{val.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLERGY & PASTORAL TEAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Pastoral Care</span>
          <h2 className="text-3xl font-bold font-liturgical text-slate-900 mt-1">Our Priests & Deacons</h2>
          <p className="text-xs text-slate-600 mt-1">Dedicated shepherds ministering across Holy Spirit, St. Anthony, and St. Matthew.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutData.clergy.map((c, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl transition-all">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={c.image} 
                  alt={c.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as any).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">{c.title}</span>
                  <h4 className="text-lg font-bold font-liturgical mt-0.5">{c.name}</h4>
                </div>
              </div>
              <div className="p-5 text-xs text-slate-600 leading-relaxed">
                {c.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARISH PASTORAL COUNCIL & RECTORATE STRUCTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 rounded-3xl p-8 sm:p-12 border border-stone-200 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Governance & Stewardship</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-liturgical text-slate-900">
              Parish Pastoral Council & Structure
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              The consultative body working hand-in-hand with the clergy to plan, direct, and execute the pastoral and physical development of the Rectorate.
            </p>
          </div>

          {/* Council Executives Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aboutData.ppcExecutives.map((exec, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{exec.name}</span>
                  <span className="text-[11px] text-amber-700 font-medium block">{exec.title}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 text-xs font-bold">
                  ✓
                </div>
              </div>
            ))}
          </div>

          {/* Organizational Flow */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 text-center">
              Rectorate Ecclesial Relationship Flow
            </h4>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-center">
              <div className="p-3 bg-slate-900 text-amber-300 rounded-xl w-full sm:w-auto">
                {aboutData.diocese}
              </div>
              <span className="text-slate-400 font-bold">→</span>
              <div className="p-3 bg-amber-700 text-white rounded-xl w-full sm:w-auto">
                Holy Spirit Rectorate (Administrative Seat)
              </div>
              <span className="text-slate-400 font-bold">→</span>
              <div className="p-3 bg-stone-100 text-slate-800 rounded-xl border border-stone-300 w-full sm:w-auto">
                St. Anthony of Padua & St. Matthew Outstations
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

