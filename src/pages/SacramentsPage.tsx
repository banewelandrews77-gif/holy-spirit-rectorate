import React from 'react';
import { Link } from 'react-router-dom';
import { SACRAMENTS_DATA, PARISH_INFO } from '../data/parishData';
import { 
  Droplets, 
  Wine, 
  Flame, 
  HeartHandshake, 
  Sparkles, 
  ShieldAlert, 
  Church, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  FileCheck
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  'Droplets': <Droplets className="w-6 h-6 text-sky-600" />,
  'Wine': <Wine className="w-6 h-6 text-rose-700" />,
  'Flame': <Flame className="w-6 h-6 text-amber-600" />,
  'HeartHandshake': <HeartHandshake className="w-6 h-6 text-emerald-600" />,
  'Sparkles': <Sparkles className="w-6 h-6 text-amber-500" />,
  'ShieldAlert': <ShieldAlert className="w-6 h-6 text-orange-600" />
};

export const SacramentsPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 lg:py-20 border-b border-amber-500/20 text-center relative">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-400/30">
            Sacramental Grace & Christian Formation
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-liturgical tracking-wide">
            The Seven Sacraments & Ministries
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            "The sacraments are efficacious signs of grace, instituted by Christ and entrusted to the Church, by which divine life is dispensed to us." (CCC 1131)
          </p>
        </div>
      </section>

      {/* SACRAMENTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Holy Mysteries</span>
          <h2 className="text-3xl font-bold font-liturgical text-slate-900">
            Sacraments Celebrated in Our Parish
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Learn about sacramental preparation, requirements, and class registrations for children, youth, and adults.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SACRAMENTS_DATA.map((sac, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-7 border border-stone-200 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  {ICON_MAP[sac.icon] || <Sparkles className="w-6 h-6 text-amber-600" />}
                </div>

                <div>
                  <h3 className="text-xl font-bold font-liturgical text-slate-900">{sac.name}</h3>
                  <span className="text-xs font-serif italic text-amber-700 block mt-0.5">{sac.subtitle}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-serif">
                  {sac.desc}
                </p>

                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block">Celebration Schedule:</span>
                    <span className="text-slate-500">{sac.schedule}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">Requirements:</span>
                    <span className="text-slate-500">{sac.requirements}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/contact?category=sacraments&subject=${encodeURIComponent(sac.name + ' Inquiry')}`}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-amber-600 hover:text-white text-slate-800 text-xs font-semibold transition-colors text-center block"
              >
                Inquire or Register for {sac.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* PARISH MINISTRIES & SOCIETIES DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 rounded-3xl p-8 sm:p-12 border border-stone-200 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Apostolate & Service</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-liturgical text-slate-900">
              Parish Societies & Guilds Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Serve in liturgical roles, welfare outreach, or join devotional societies across our Rectorate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {[
              { name: 'Catholic Men Association (CMA)', desc: 'Spiritual brotherhood, family leadership, and parish project sponsorship.' },
              { name: 'Christian Mothers Association (CMA)', desc: 'Nurturing Catholic home life, rosary devotions, and altar guild support.' },
              { name: 'Catholic Youth Organization (CYO)', desc: 'Dynamic youth formation, camps, sports, and spiritual leadership.' },
              { name: 'St. Vincent de Paul Society', desc: 'Direct outreach, food baskets, and medical relief for the poor and vulnerable.' },
              { name: 'Knights & Ladies of the Altar', desc: 'Reverent service at the altar as acolytes and servers for Holy Mass.' },
              { name: 'Parish Choirs (Senior & Youth)', desc: 'Enhancing liturgical worship through sacred hymns and Gregorian chants.' },
              { name: 'Legion of Mary', desc: 'Marian apostolic spirituality, home visitations, and intercessory rosary prayer.' },
              { name: 'Catholic Charismatic Renewal', desc: 'Prayer meetings, praise and worship, healing services, and Life in the Spirit seminars.' }
            ].map((min, idx) => (
              <div key={idx} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-1.5">
                <span className="font-bold text-slate-900 text-sm block">{min.name}</span>
                <p className="text-slate-500 leading-relaxed">{min.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
