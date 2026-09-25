export interface ChurchProfile {
  id: 'holy-spirit' | 'st-anthony' | 'st-matthew';
  name: string;
  roleTitle: string;
  patronSaint: string;
  feastDay: string;
  description: string;
  tagline: string;
  location: string;
  priestInCharge: string;
  history: string;
  massSchedules: {
    day: string;
    time: string;
    type: string;
  }[];
  devotions: string[];
  societies: string[];
  executiveCouncil: {
    role: string;
    name: string;
  }[];
  contactPhone: string;
  heroImage: string;
}

export const PARISH_INFO = {
  name: 'Holy Spirit Rectorate',
  diocese: 'Catholic Diocese of Sekondi-Takoradi',
  motto: 'Veni Sancte Spiritus — Come Holy Spirit',
  vision: 'To be a vibrant, Christ-centered Catholic community empowered by the Holy Spirit to witness, evangelize, and serve in unity and love.',
  mission: 'To proclaim the Gospel through reverent liturgical worship, comprehensive pastoral care, deep sacramental life, and proactive community charity across Holy Spirit Rectorate, St. Anthony of Padua, and St. Matthew Catholic Church.',
  coreValues: [
    { title: 'Reverent Worship', desc: 'Fostering deep prayer, Eucharistic adoration, and active liturgical participation.' },
    { title: 'Evangelization & Faith Formation', desc: 'Nurturing sound Catholic doctrine through ongoing catechism, youth formation, and Bible study.' },
    { title: 'Communion & Unity', desc: 'Building strong bonds of brotherhood across the Rectorate and its outstations.' },
    { title: 'Compassionate Charity', desc: 'Extending Christ’s healing hands to the poor, elderly, sick, and vulnerable.' }
  ],
  clergy: [
    {
      name: 'Rev. Fr. Albin Kissi Ernim',
      title: 'Parish Rector',
      role: 'Overall spiritual leader, pastoral coordinator, and administrator of the Rectorate and sub-churches.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop'
    },
    {
      name: 'Rev. Fr. Augustine K. Mensah',
      title: 'Associate Priest',
      role: 'Pastoral ministry coordinator, youth chaplain, and outstation spiritual animator.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
    },
    {
      name: 'Rev. Deacon Francis Xavier Boakye',
      title: 'Permanent Deacon',
      role: 'Liturgical assistant, baptism coordinator, and St. Vincent de Paul advisor.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop'
    }
  ],
  ppcExecutives: [
    { name: 'Dr. Kwabena Asante', title: 'PPC Chairman' },
    { name: 'Mrs. Evelyn Arthur', title: 'PPC Vice-Chairperson' },
    { name: 'Mr. Patrick Senyo', title: 'PPC Secretary' },
    { name: 'Mrs. Grace Osei-Bonsu', title: 'Finance Committee Chairperson' },
    { name: 'Mr. Victor Ansah', title: 'Church Youth President' }
  ]
};

export const SUB_CHURCHES: Record<'holy-spirit' | 'st-anthony' | 'st-matthew', ChurchProfile> = {
  'holy-spirit': {
    id: 'holy-spirit',
    name: 'Holy Spirit Rectorate (Main Sanctuary)',
    roleTitle: 'Principal Parish & Administrative Seat',
    patronSaint: 'The Holy Spirit (Solemnity of Pentecost)',
    feastDay: 'Pentecost Sunday (50 days after Easter)',
    tagline: 'The Center of Eucharistic Life and Pastoral Fellowship',
    description: 'The principal worship sanctuary and seat of the Holy Spirit Rectorate, uniting hundreds of faithful every Sunday in communion and praise.',
    location: 'Main Parish Avenue, Cathedral Road, P.O. Box HS 102, Sekondi-Takoradi',
    priestInCharge: 'Rev. Fr. Albin Kissi Ernim (Rector)',
    history: 'Established to address the rapid spiritual growth of the Catholic faithful in the municipality, Holy Spirit Rectorate has grown into a spiritual sanctuary renowned for vibrant liturgical celebrations, deep community involvement, and warm Christian brotherhood.',
    massSchedules: [
      { day: 'Sunday (First Mass)', time: '7:00 AM – 9:00 AM', type: 'Solemn Eucharist (English)' },
      { day: 'Sunday (Second Mass)', time: '9:30 AM – 11:30 AM', type: 'Youth & Family Mass' },
      { day: 'Monday – Friday (Morning)', time: '6:00 AM – 6:45 AM', type: 'Daily Weekday Mass' },
      { day: 'Wednesday (Evening)', time: '6:30 PM – 7:30 PM', type: 'Novena & Mass' },
      { day: 'Thursday (Holy Hour)', time: '6:30 PM – 8:00 PM', type: 'Exposition & Benediction' },
      { day: 'Saturday (Confessions)', time: '4:30 PM – 6:00 PM', type: 'Sacrament of Reconciliation' }
    ],
    devotions: [
      'Holy Rosary: 30 minutes before every Sunday Mass',
      'First Friday Devotion to the Sacred Heart of Jesus: 6:00 PM',
      'Perpetual Eucharistic Adoration Chapel: Open 24/7'
    ],
    societies: [
      'Parish Senior Choir',
      'Cherubim Youth Choir',
      'Catholic Men Association (CMA)',
      'Christian Mothers Association (CMA)',
      'Catholic Youth Organization (CYO)',
      'Knights and Ladies of the Altar',
      'St. Vincent de Paul Society',
      'Catholic Charismatic Renewal',
      'Legion of Mary'
    ],
    executiveCouncil: [
      { role: 'PPC Chairman', name: 'Dr. Kwabena Asante' },
      { role: 'Treasurer', name: 'Mrs. Grace Osei-Bonsu' },
      { role: 'Welfare Officer', name: 'Mr. Anthony Mensah' }
    ],
    contactPhone: '+233 20 538 8058',
    heroImage: 'https://images.unsplash.com/photo-1548625361-197e415d4872?q=80&w=1200&auto=format&fit=crop'
  },
  'st-anthony': {
    id: 'st-anthony',
    name: 'St. Anthony of Padua Catholic Church',
    roleTitle: 'Sub-Church & Outstation Community',
    patronSaint: 'St. Anthony of Padua (Doctor of the Church)',
    feastDay: 'June 13',
    tagline: 'Miracle Worker, Hammer of Heretics & Friend of the Needy',
    description: 'A devoted and closely-knit Eucharistic outstation dedicated to St. Anthony of Padua, known for strong community solidarity, the 13 Tuesdays devotion, and generous care for the poor.',
    location: 'St. Anthony of Padua catholic church, kansaworad0',
    priestInCharge: 'Rev. Fr. Albin Kissi Ernim',
    history: 'St. Anthony of Padua started as a small Christian community prayer cell. As membership multiplied, land was acquired with the blessing of the Archdiocese, and a vibrant sanctuary was constructed by dedicated parishioners. Today it stands as a cornerstone of devotion to St. Anthony in the community.',
    massSchedules: [
      { day: 'Sunday Mass', time: '7:30 AM – 9:30 AM', type: 'Solemn Sunday Eucharist' },
      { day: 'Tuesday (St. Anthony Devotion)', time: '6:30 PM – 8:00 PM', type: 'Devotional Mass, Novena & Bread Blessing' },
      { day: 'Thursday (Morning Mass)', time: '6:00 AM – 6:45 AM', type: 'Weekday Mass' },
      { day: '1st Saturday (Confessions)', time: '5:00 PM – 6:00 PM', type: 'Confessions & Rosary' }
    ],
    devotions: [
      '13 Tuesdays Novena to St. Anthony of Padua',
      'Blessing and Distribution of St. Anthony Bread',
      'Legion of Mary Praesidium Meeting: Sundays after Mass'
    ],
    societies: [
      'St. Anthony Guild & Society',
      'Christian Mothers Society (St. Anthony Branch)',
      'Catholic Men Association (St. Anthony Branch)',
      'St. Anthony Youth Fellowship',
      'St. Anthony Liturgical Choir'
    ],
    executiveCouncil: [
      { role: 'Outstation Committee Chairman', name: 'Mr. Joseph Tetteh' },
      { role: 'Secretary', name: 'Ms. Faustina Mensah' },
      { role: 'Treasurer', name: 'Mrs. Philomena Agyapong' },
      { role: 'St. Anthony Guild President', name: 'Mr. Matthew Mensah' }
    ],
    contactPhone: '+233 205388058',
    heroImage: '/images/st-anthony.jpg'
  },
  'st-matthew': {
    id: 'st-matthew',
    name: 'St. Matthew Catholic Church',
    roleTitle: 'Sub-Church & Outstation Community',
    patronSaint: 'St. Matthew the Apostle & Evangelist',
    feastDay: 'September 21',
    tagline: 'Discipleship, Gospel Witness & Dedicated Stewardship',
    description: 'An enthusiastic outstation inspired by the calling of St. Matthew to follow Christ promptly, actively promoting biblical literacy, stewardship, and community outreach.',
    location: 'St. Mathew Catholic Church, Ntankofu',
    priestInCharge: 'Rev. Fr. Albin Kissi Ernim & Pastoral Assistants',
    history: 'Founded to cater to parishioners dwelling along the southern development corridor, St. Matthew Catholic Church has become a model outstation celebrating Catholic liturgy with joy, building new educational facilities, and inspiring great generosity in annual harvests.',
    massSchedules: [
      { day: 'Sunday Mass', time: '8:00 AM – 10:15 AM', type: 'Solemn Eucharist & Society Gatherings' },
      { day: 'Wednesday (Midweek Mass)', time: '6:30 PM – 7:30 PM', type: 'Scripture Reflection & Mass' },
      { day: 'Friday (Divine Mercy & Adoration)', time: '6:00 PM – 7:15 PM', type: 'Divine Mercy Chaplet & Eucharistic Blessing' },
      { day: 'Saturday (Confessions)', time: '4:00 PM – 5:00 PM', type: 'Sacrament of Reconciliation' }
    ],
    devotions: [
      'Divine Mercy Chaplet: Every Friday at 3:00 PM & 6:00 PM',
      'St. Matthew Bible Study Circle: 2nd & 4th Thursdays at 6:30 PM',
      'Infant of Prague Novena'
    ],
    societies: [
      'St. Matthew Evangelization Circle',
      'Catholic Men Association (St. Matthew Branch)',
      'Christian Mothers (St. Matthew Branch)',
      'St. Matthew Angelic Voices Choir',
      'CYO St. Matthew Brigade'
    ],
    executiveCouncil: [
      { role: 'Outstation Committee Chairman', name: 'Mr. Emmanuel Appiah' },
      { role: 'Vice-Chairman', name: 'Mr. Clement Nuamah' },
      { role: 'Secretary', name: 'Mrs. Benedicta Ofori' },
      { role: 'Financial Secretary', name: 'Mr. Samuel B. Ansah' }
    ],
    contactPhone: '+233 20 876 5433',
    heroImage: '/images/st-matthew.jpg'
  }
};

export const SACRAMENTS_DATA = [
  {
    name: 'Baptism',
    subtitle: 'Gateway to Life in the Spirit',
    icon: 'Droplets',
    desc: 'Through Baptism we are freed from sin and reborn as children of God, incorporated into the Body of Christ.',
    schedule: 'Infant Baptism: 2nd Saturday of each month. Adult catechumens baptized at Easter Vigil.',
    requirements: 'Parents must be registered parishioners. Godparents must be practicing Confirmed Catholics. Pre-baptismal instruction class required.'
  },
  {
    name: 'Eucharist (Holy Communion)',
    subtitle: 'The Source & Summit of the Christian Life',
    icon: 'Wine',
    desc: 'In the most blessed sacrament of the Eucharist, the body and blood, soul and divinity of our Lord Jesus Christ is contained.',
    schedule: 'Celebrated at all Sunday and weekday Masses across Holy Spirit, St. Anthony, and St. Matthew.',
    requirements: 'Candidates must have completed 2 years of Catechism classes and received the Sacrament of Reconciliation.'
  },
  {
    name: 'Confirmation',
    subtitle: 'Enriched with the Gift of the Holy Spirit',
    icon: 'Flame',
    desc: 'By Confirmation the baptized are more perfectly bound to the Church and enriched with a special strength of the Holy Spirit.',
    schedule: 'Conferred annually during the Episcopal Pastoral Visit of the Metropolitan Archbishop.',
    requirements: 'Age 14 and above, completion of Confirmation catechism course, choosing a patron saint and practicing Catholic sponsor.'
  },
  {
    name: 'Reconciliation (Confession)',
    subtitle: 'Healing, Forgiveness & Mercy',
    icon: 'HeartHandshake',
    desc: 'Those who approach the sacrament of Penance obtain pardon from God’s mercy for offenses committed against Him.',
    schedule: 'Saturdays at 4:30 PM (Holy Spirit), 5:00 PM (St. Anthony), 4:00 PM (St. Matthew) and upon request with the priest.',
    requirements: 'Examination of conscience, genuine contrition, firm purpose of amendment, and confession to a Catholic priest.'
  },
  {
    name: 'Holy Matrimony',
    subtitle: 'Sacred Covenant of Marriage',
    icon: 'Sparkles',
    desc: 'A matrimonial covenant by which a baptized man and woman establish between themselves a partnership of the whole of life.',
    schedule: 'Saturdays by prior appointment (minimum 6 months advance notice required).',
    requirements: 'Baptismal certificates with recent notations, marriage preparation counseling course, banns of marriage published for 3 consecutive weeks.'
  },
  {
    name: 'Anointing of the Sick',
    subtitle: 'Strength, Peace & Courage',
    icon: 'ShieldAlert',
    desc: 'By the sacred anointing of the sick and prayer of the priests, the Church commends those who are ill to the suffering Lord.',
    schedule: 'Administered upon request at hospitals or homes. Communal anointing on the World Day of the Sick.',
    requirements: 'Any parishioner facing serious illness, advanced age, or preparing for major surgical operation.'
  }
];
