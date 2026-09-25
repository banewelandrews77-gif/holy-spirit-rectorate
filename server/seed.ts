import bcrypt from 'bcryptjs';
import { db, initDatabase } from './db';

export function seedDatabase() {
  console.log('[SEED] Initializing database...');
  initDatabase();

  // Clear existing records to ensure fresh state
  db.exec(`
    DELETE FROM users;
    DELETE FROM announcements;
    DELETE FROM events;
    DELETE FROM bulletins;
    DELETE FROM gallery;
    DELETE FROM donations;
    DELETE FROM messages;
    DELETE FROM settings;
  `);

  // 1. Seed Users
  console.log('[SEED] Seeding users...');
const salt = bcrypt.genSaltSync(10);
const parishPass = bcrypt.hashSync('Anthony@1801', salt);

const insertUser = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
const adminResult = insertUser.run('Parish Administrator', 'stanthonyofoaduakansaworado@gmail.com', parishPass, 'admin');
insertUser.run('Parish Communications Team', 'editor@holyspiritrectorate.org', parishPass, 'editor');
insertUser.run('Parish Finance Committee', 'finance@holyspiritrectorate.org', parishPass, 'viewer');

const adminId = adminResult.lastInsertRowid;

// 2. Seed Announcements
console.log('[SEED] Seeding announcements...');
const insertAnnouncement = db.prepare(`
  INSERT INTO announcements (title, slug, content, church_id, category, is_pinned, author_id)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertAnnouncement.run(
  'Welcome to Holy Spirit Rectorate & Outstations Online Platform',
  'welcome-to-holy-spirit-rectorate',
  'Dear Parishioners and Friends, in the peace of Christ we warmly welcome you to our official parish portal. This digital sanctuary connects our main Rectorate with St. Anthony of Padua and St. Matthew Catholic Church. Check Mass schedules, book intentions, join societies, and support God’s kingdom online.',
  'all',
  'general',
  1,
  adminId
);

insertAnnouncement.run(
  'Novena to the Holy Spirit Ahead of Pentecost Feast',
  'novena-holy-spirit-pentecost',
  'The Parish Pastoral Council invites all societies, guilds, and families to participate in the 9-day Novena to the Holy Spirit. Daily rosary, reflections, and benediction will take place simultaneously at Holy Spirit Rectorate, St. Anthony, and St. Matthew.',
  'holy-spirit',
  'liturgical',
  1,
  adminId
);

insertAnnouncement.run(
  'St. Anthony of Padua: 13 Tuesdays Devotion & Bread Blessing',
  'st-anthony-tuesdays-devotion',
  'The St. Anthony Guild announces the commencement of the traditional 13 Tuesdays Devotion. Mass begins at 6:30 PM followed by veneration of the relic and distribution of St. Anthony’s Bread to the poor.',
  'st-anthony',
  'societies',
  0,
  adminId
);

insertAnnouncement.run(
  'St. Matthew Catholic Church: Annual Harvest & Thanksgiving Launch',
  'st-matthew-harvest-launch',
  'Theme: "Honor the Lord with your substance" (Proverbs 3:9). Join the parishioners of St. Matthew Catholic Church for the official launching of this year’s Annual Harvest. Mini-harvest appeals will run through the upcoming month.',
  'st-matthew',
  'urgent',
  0,
  adminId
);

insertAnnouncement.run(
  'Registration for 2026/2027 Catechism Classes Open',
  'catechism-registration-open',
  'Parents and guardians are requested to register their children for Holy Communion and Confirmation preparation. Classes take place every Saturday at 8:30 AM across all three centers. Forms are available at the parish office.',
  'all',
  'youth',
  0,
  adminId
);

// 3. Seed Events
console.log('[SEED] Seeding events...');
const insertEvent = db.prepare(`
  INSERT INTO events (title, church_id, category, description, location, start_date, end_date, time_info, is_featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertEvent.run(
  'Solemn Sunday Mass (First Mass)',
  'holy-spirit',
  'mass',
  'Celebration of the Holy Eucharist with English choir liturgy.',
  'Holy Spirit Main Sanctuary',
  '2026-09-20',
  '2026-09-20',
  '7:00 AM - 9:00 AM',
  1
);

insertEvent.run(
  'Solemn Sunday Mass (Youth & Family Mass)',
  'holy-spirit',
  'mass',
  'Dynamic youth-led liturgy featuring the Cherubim Choir and contemporary liturgical hymns.',
  'Holy Spirit Main Sanctuary',
  '2026-09-20',
  '2026-09-20',
  '9:30 AM - 11:30 AM',
  1
);

insertEvent.run(
  'St. Anthony of Padua Sunday Eucharistic Celebration',
  'st-anthony',
  'mass',
  'Sunday Eucharistic liturgy with community offertory and special intercessory prayers.',
  'St. Anthony Sanctuary, Outstation',
  '2026-09-20',
  '2026-09-20',
  '7:30 AM - 9:30 AM',
  1
);

insertEvent.run(
  'St. Matthew Catholic Church Sunday Mass & Society Meetings',
  'st-matthew',
  'mass',
  'Eucharist celebration followed by meetings of the Catholic Men Association, Christian Mothers, and CYO.',
  'St. Matthew Parish Hall & Chapel',
  '2026-09-20',
  '2026-09-20',
  '8:00 AM - 10:15 AM',
  1
);

insertEvent.run(
  'Parish Holy Hour of Adoration & Healing Service',
  'all',
  'retreat',
  'Exposition of the Blessed Sacrament, quiet adoration, confessions, and blessing of sick parishioners.',
  'Holy Spirit Rectorate & Simultaneous Outstations',
  '2026-09-24',
  '2026-09-24',
  '6:30 PM - 8:00 PM',
  1
);

insertEvent.run(
  'Feast of St. Matthew the Apostle (Patronal Feast)',
  'st-matthew',
  'feast',
  'High Mass of thanksgiving celebrating the patron saint of St. Matthew Catholic Church with parish agape feast.',
  'St. Matthew Sanctuary',
  '2026-09-21',
  '2026-09-21',
  '9:00 AM - 12:30 PM',
  1
);

// 4. Seed Bulletins
console.log('[SEED] Seeding bulletins...');
const insertBulletin = db.prepare(`
  INSERT INTO bulletins (title, week_label, summary, download_url)
  VALUES (?, ?, ?, ?)
`);

insertBulletin.run(
  'Parish Weekly Bulletin - 25th Sunday in Ordinary Time',
  'Week 25, Year B',
  'Readings, reflection on servant leadership, financial transparency report, and announcements for Holy Spirit, St. Anthony, and St. Matthew.',
  '#'
);

insertBulletin.run(
  'Parish Weekly Bulletin - 24th Sunday in Ordinary Time',
  'Week 24, Year B',
  'Who do people say that I am? Gospel reflection, harvest launching update, and youth executive induction.',
  '#'
);

// 5. Seed Gallery Items
console.log('[SEED] Seeding gallery items...');
const insertGallery = db.prepare(`
  INSERT INTO gallery (title, album, media_type, media_url, thumbnail_url, caption, church_id)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertGallery.run(
  'Feast of Pentecost Mass of the Holy Spirit',
  'Pentecost Feast',
  'image',
  'https://images.unsplash.com/photo-1548625361-197e415d4872?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1548625361-197e415d4872?q=80&w=600&auto=format&fit=crop',
  'Solemn High Mass concelebrated by the Rectorate clergy in red vestments for the patronal feast.',
  'holy-spirit'
);

insertGallery.run(
  'Sacrament of Confirmation by the Bishop',
  'Confirmations',
  'image',
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=600&auto=format&fit=crop',
  'Candidates from Holy Spirit, St. Anthony, and St. Matthew receiving the seven gifts of the Holy Spirit.',
  'all'
);

insertGallery.run(
  'St. Anthony of Padua Annual Feast Day Procession',
  'St. Anthony Feast',
  'image',
  'https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=600&auto=format&fit=crop',
  'Parishioners carrying the statue of St. Anthony with lilies and singing hymns of thanksgiving.',
  'st-anthony'
);

insertGallery.run(
  'St. Matthew Catholic Church Harvest Thanksgiving Offering',
  'Harvest & Thanksgiving',
  'image',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop',
  'Presentation of harvest gifts, agricultural produce, and thanksgiving gifts to the altar.',
  'st-matthew'
);

insertGallery.run(
  'Parish Youth Conference & Eucharistic Adoration',
  'Youth Activities',
  'image',
  'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=600&auto=format&fit=crop',
  'Youth from the three centers gathered for praise, worship, and spiritual renewal.',
  'all'
);

insertGallery.run(
  'St. Vincent de Paul Society Food Basket Outreach to the Needy',
  'Charity & Outreach',
  'image',
  'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600&auto=format&fit=crop',
  'Distribution of food packages, medical care, and clothing to vulnerable families in the community.',
  'all'
);

// 6. Seed Sample Donations
console.log('[SEED] Seeding sample donations...');
const insertDonation = db.prepare(`
  INSERT INTO donations (
    receipt_number, donor_name, donor_email, donor_phone, church_id, fund_category, amount, currency, frequency, payment_method, momo_network, status, transaction_ref, notes, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertDonation.run(
  'HSR-20260901-A1B2',
  'Kofi Mensah',
  'kofi.mensah@gmail.com',
  '+233 24 412 3456',
  'holy-spirit',
  'tithe',
  500.00,
  'GHS',
  'monthly',
  'momo',
  'mtn',
  'completed',
  'TXN-MOMO948123',
  'Monthly tithe for September',
  '2026-09-01 10:14:00'
);

insertDonation.run(
  'HSR-20260904-C3D4',
  'Akosua Boateng',
  'akosua.b@yahoo.com',
  '+233 20 876 5432',
  'st-anthony',
  'building',
  1200.00,
  'GHS',
  'one-time',
  'momo',
  'telecel',
  'completed',
  'TXN-TCEL552109',
  'Building pledge fulfillment for St. Anthony Sanctuary',
  '2026-09-04 14:22:30'
);

insertDonation.run(
  'HSR-20260907-E5F6',
  'Emmanuel Kwame Owusu',
  'e.owusu@outlook.com',
  '+233 27 345 6789',
  'st-matthew',
  'harvest',
  750.00,
  'GHS',
  'one-time',
  'card',
  null,
  'completed',
  'TXN-STRIPE88231',
  'St. Matthew Harvest thanksgiving contribution',
  '2026-09-07 09:45:10'
);

insertDonation.run(
  'HSR-20260910-G7H8',
  'Dr. Patricia Osei',
  'posei@accrahealth.org',
  '+233 24 998 8776',
  'holy-spirit',
  'welfare',
  1000.00,
  'GHS',
  'monthly',
  'card',
  null,
  'completed',
  'TXN-STRIPE90123',
  'Welfare support for the sick and elderly parishioners',
  '2026-09-10 16:30:00'
);

insertDonation.run(
  'HSR-20260912-J9K0',
  'Joseph Tetteh Quaye',
  'jtquaye@gmail.com',
  '+233 26 112 2334',
  'st-anthony',
  'intentions',
  150.00,
  'GHS',
  'one-time',
  'momo',
  'at',
  'completed',
  'TXN-ATMOMO4419',
  'Thanksgiving Mass intention for family blessing',
  '2026-09-12 11:05:45'
);

// 7. Seed Messages
console.log('[SEED] Seeding inquiries...');
const insertMessage = db.prepare(`
  INSERT INTO messages (sender_name, sender_email, sender_phone, church_id, category, subject, message, intention_date, status, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertMessage.run(
  'Theresa Anane',
  'theresa.anane@gmail.com',
  '+233 24 123 9876',
  'holy-spirit',
  'mass_intention',
  'Thanksgiving Mass Intention for 60th Birthday',
  'I would like to book a special Mass of thanksgiving for my 60th birthday during the 9:30 AM Sunday Mass.',
  '2026-09-27',
  'unread',
  '2026-09-14 08:30:00'
);

insertMessage.run(
  'Francis K. Darko',
  'fkdarko@gmail.com',
  '+233 20 445 6677',
  'st-anthony',
  'pastoral_counseling',
  'Appointment with Priest for Marriage Blessing',
  'My spouse and I would like to schedule an appointment with Rev. Father to discuss blessing of our civil marriage.',
  null,
  'responded',
  '2026-09-11 15:10:00'
);

// 8. Seed Settings
console.log('[SEED] Seeding settings...');
const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');

insertSetting.run('parish_name', JSON.stringify('Holy Spirit Rectorate'));
insertSetting.run('tagline', JSON.stringify('One Faith, One Family in Christ Jesus'));
insertSetting.run('mission_statement', JSON.stringify('To proclaim the Gospel of Jesus Christ with vibrant liturgical worship, pastoral care, and joyful Christian charity across Holy Spirit Rectorate, St. Anthony of Padua, and St. Matthew Catholic Church.'));
insertSetting.run('contact_info', JSON.stringify({
  mainAddress: 'Holy Spirit Rectorate, Main Parish Avenue, P.O. Box HS 102, Sekondi-Takoradi / Ghana',
  stAnthonyAddress: 'St. Anthony of Padua Catholic Church, Outstation Road, Near District Clinic',
  stMatthewAddress: 'St. Matthew Catholic Church, Community Center Junction',
  phone: '+233 30 212 3456 / +233 24 456 7890',
  emergencyPhone: '0205388058 (Sick Calls & Pastoral Emergencies)',
  email: 'info@holyspiritrectorate.org',
  officeHours: 'Monday – Friday: 8:30 AM – 5:00 PM | Saturday: 9:00 AM – 1:00 PM',
  priestConsultation: 'Tuesdays & Thursdays: 9:00 AM – 1:00 PM'
}));
insertSetting.run('giving_accounts', JSON.stringify({
  mtnMoMo: { number: '0244123456', name: 'HOLY SPIRIT RECTORATE', merchantId: '984512' },
  telecelCash: { number: '0208765432', name: 'HOLY SPIRIT RECTORATE' },
  bankDetails: {
    bank: 'Ecobank Ghana / Standard Chartered',
    accountName: 'Holy Spirit Rectorate Parish',
    accountNumber: '1441001234567',
    branch: 'Parish Main Branch',
    swiftCode: 'ECOBGHAC'
  }
}));

insertSetting.run('about_page', JSON.stringify({
  diocese: 'Catholic Diocese of Sekondi-Takoradi',
  headerSubtitle: 'The Holy Spirit Rectorate stands as an active beacon of Catholic faith, uniting the main sanctuary with St. Anthony of Padua and St. Matthew Catholic Church under the Catholic Diocese of Sekondi-Takoradi.',
  historyText: 'Established to address the rapid spiritual growth of the Catholic faithful in the municipality, Holy Spirit Rectorate has grown into a spiritual sanctuary renowned for vibrant liturgical celebrations, deep community involvement, and warm Christian brotherhood.',
  rectorMessage: {
    name: 'Rev. Fr. Albin Kissi Ernim',
    title: 'Parish Rector',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop',
    greetingHeadline: '"A House of Prayer for All Faithful"',
    paragraphs: [
      "Dear brothers and sisters in Christ, it gives me great pastoral joy to welcome you to the online sanctuary of Holy Spirit Rectorate and our cherished outstations, St. Anthony of Padua and St. Matthew Catholic Church.",
      "As a Rectorate, our foremost mission is the sanctification of souls through the reverent celebration of the Holy Eucharist, the sacraments, and generous Christian charity. Whether you are a lifelong parishioner, a newcomer in our community, or a visitor exploring the Catholic faith, you have a home here.",
      "May the gifts and fruits of the Holy Spirit abide with you and your households always."
    ]
  },
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
}));

  console.log('[SEED] Database seeding completed successfully!');
} // end seedDatabase()

