# Holy Spirit Rectorate Catholic Parish Web Platform

Official website and administrative management portal for **Holy Spirit Rectorate** and its outstations: **St. Anthony of Padua Catholic Church** and **St. Matthew Catholic Church** under the **Catholic Diocese of Sekondi-Takoradi**.

---

## 🌟 Key Features

### 🏛️ 1. Public Parish Website
- **Liturgical Aesthetic**: Warm Roman Catholic ecclesiastical palette (Royal Navy Blue, Liturgical Amber Gold, Sacred Crimson, and Ivory) with Google Fonts (*Cinzel* & *Plus Jakarta Sans*).
- **Homepage**:
  - Rector's welcome greeting & parish mission statement (*"Veni Sancte Spiritus — Come Holy Spirit"*).
  - **Sunday & Daily Mass Schedules At A Glance** across all three worship centers (Holy Spirit Rectorate, St. Anthony, St. Matthew).
  - Sub-churches dedicated spotlight cards with one-click navigation.
  - Live Announcements ticker & top pastoral notices.
  - Liturgical events preview with calendar date badges.
  - Daily Scripture & reflection banner.
- **About Us**:
  - History of the Rectorate and Outstations.
  - Pastoral Team: Parish Rector, Associate Priests, and Deacons.
  - Parish Pastoral Council (PPC) Executives and Finance Committee.
  - Vision, Mission, and Core Liturgical Pillars.
  - Rectorate Organizational Hierarchy.
- **Dedicated Sub-Church Hubs**:
  - **St. Anthony of Padua Catholic Church**: Outstation history, patron saint overview, feast day (June 13), 13 Tuesdays Devotion, St. Anthony Bread blessing, Sunday/weekday Mass times, active societies, local executive committee, and direct giving.
  - **St. Matthew Catholic Church**: Outstation history, patron saint overview, feast day (Sept 21), Bible study circles, Divine Mercy devotion, Sunday/weekday Mass times, active societies, local executive committee, and direct giving.
- **Announcements & Bulletins**:
  - Filter by worship center (*All, Holy Spirit, St. Anthony, St. Matthew*) and category (*General, Urgent, Liturgical, Youth, Societies*).
  - Pinned priority announcements.
  - Downloadable weekly parish bulletins archive.
- **Liturgical Calendar**:
  - Interactive calendar of upcoming Holy Masses, feast days, novenas, retreats, and society meetings.
- **Sacraments & Formations**:
  - Complete guides for all 7 Sacraments (*Baptism, Confirmation, Eucharist, Penance, Anointing of the Sick, Matrimony, Holy Orders*).
  - Requirements, celebration schedules, and one-click registration links.
  - Parish Societies & Guilds directory (*CMA, CYO, Choirs, Altar Servers, St. Vincent de Paul, Charismatic Renewal, Legion of Mary*).
- **Photo & Video Gallery**:
  - Categorized albums (*Pentecost Feast, Confirmations, St. Anthony Feast, Harvest & Thanksgiving, Youth Activities, Charity Outreach*).
  - Interactive accessible Lightbox with captions and full-size image navigation.
- **Contact & Mass Intentions**:
  - Office address, priest consultation hours, and emergency pastoral sick call line (`+233 20 000 7777`).
  - Interactive Mass intention booking and counseling appointment form.
  - Interactive location directions for all three church sanctuaries.

---

### 💳 2. Online Donation & Giving System
- **Giving Portal (`/donate`)**:
  - Target center selector: Holy Spirit Rectorate, St. Anthony, or St. Matthew.
  - Fund category selector: Tithe & First Fruits, Sunday Offertory, Church Building Fund, Harvest & Thanksgiving, Mass Intentions Stipend, Welfare / Poor Outreach.
  - Frequency: One-time, Weekly, Monthly.
  - Multi-Currency: GHS (₵), USD ($), EUR (€), GBP (£) with preset amount chips and custom input.
- **Payment Gateways**:
  - **Ghana Mobile Money (MoMo)**: MTN Mobile Money, Telecel Cash, and AT Money with network selector, phone validation, and USSD prompt simulation.
  - **Credit / Debit Cards (Stripe)**: Encrypted card processing simulation.
  - **PayPal**: Express checkout simulation.
- **Automated Official Donor Receipt (`/receipt/:receiptNumber`)**:
  - Generated immediately with confetti celebration.
  - Includes official parish seal watermark, unique receipt reference (`HSR-YYYYMMDD-XXXX`), donor details, church name, fund purpose, amount, verification QR code, and Rector's biblical blessing.
  - **Print / Save as PDF** native support with dedicated clean print styling.
- **Manual Banking & Merchant Transfers**:
  - Direct Ecobank account details and MTN MoMo merchant code (`984512`) for offline/direct bank transfers.

---

### 🔐 3. Administration & Role-Based CMS (`/admin`)
- **Secure Authentication**:
  - Role-Based Access Control (RBAC):
    - **Admin**: Full control over settings, content, and financial audit.
    - **Editor**: Content management (Announcements, Events, Gallery).
    - **Viewer**: Read-only financial analytics and donation ledger access.
- **Admin Dashboard**:
  - Financial metric counters: Total Giving, Total Transactions, Giving by Church, Giving by Fund.
  - Visual distribution bars for funds and centers.
  - Recent transactions table with instant receipt lookup.
- **Donation Ledger & CSV Audit**:
  - Filterable by center, fund, gateway, and search term.
  - One-click **Export to CSV** for church accounting and audits.
  - Receipt lookup and reprint for any transaction.
- **Content Management**:
  - Announcements CRUD with pin toggle and sub-church targeting.
  - Liturgical Events CRUD with date, time, and location.
  - Media Gallery management with album tagging.
  - Inquiries & Mass Intentions Inbox: view details, mark as responded, or archive.

---

## 👥 Pre-Configured Demo Accounts

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Parish Admin** | `admin@holyspiritrectorate.org` | `Admin@123` | Full access: Settings, CMS, Finance |
| **Parish Editor** | `editor@holyspiritrectorate.org` | `Editor@123` | Content: Announcements, Events, Gallery |
| **Finance Officer** | `finance@holyspiritrectorate.org` | `Finance@123` | Read-only: Donation ledger, CSV export |

*(Quick-fill buttons are provided directly on the `/admin/login` page for easy testing)*

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher; tested on Node.js v24)
- npm

### 1. Seed Database
Initialize the SQLite database with rich realistic parish data, clergy profiles, announcements, events, and sample donations:
```bash
npm run seed
```

### 2. Start the Server
Run the full-stack server (serves the backend API and the compiled frontend application on port 5000):
```bash
npm run server
```
Then visit: **http://localhost:5000**

### 3. Development Mode
To run Vite with hot-reloading on port 3000 alongside the backend API on port 5000:
```bash
npm run dev
```
Then visit: **http://localhost:3000**

### 4. Build Production Bundle
```bash
npm run build
```

---

## 📁 Project Architecture

```
HOLY SPIRIT RECTORATE/
├── server/
│   ├── server.ts              # Express 5 Fullstack API Server
│   ├── db.ts                  # SQLite database engine (better-sqlite3)
│   ├── seed.ts                # Database seeder with realistic parish data
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication & RBAC middleware
│   └── routes/
│       ├── auth.routes.ts     # Login & profile verification
│       ├── donation.routes.ts # Donation processing, receipts, stats & CSV export
│       ├── content.routes.ts  # Announcements, Events, Bulletins
│       ├── gallery.routes.ts  # Photo gallery items & albums
│       ├── contact.routes.ts  # Contact inquiries & Mass intention booking
│       └── settings.routes.ts # Parish configuration
├── src/
│   ├── main.tsx               # Client entrypoint
│   ├── App.tsx                # App routing & providers
│   ├── index.css              # Liturgical theme & Tailwind v4
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── context/
│   │   └── AuthContext.tsx    # Session management & user roles
│   ├── data/
│   │   └── parishData.ts      # Parish profiles, clergy, sacraments, mass times
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx     # Responsive navigation with Mass schedule button
│   │   │   ├── Footer.tsx     # Parish info, quick links, bulletin subscribe
│   │   │   └── SubChurchHeader.tsx # Dedicated banner for sub-churches
│   │   ├── MassScheduleModal.tsx # Timetable modal across all 3 centers
│   │   └── DonationReceiptModal.tsx # Printable official donor certificate
│   └── pages/
│       ├── HomePage.tsx       # Homepage with live mass times & notices
│       ├── AboutPage.tsx      # Parish history, leadership, vision, structure
│       ├── SubChurchStAnthonyPage.tsx # St. Anthony of Padua dedicated portal
│       ├── SubChurchStMatthewPage.tsx # St. Matthew Catholic Church portal
│       ├── AnnouncementsPage.tsx # Searchable notices & weekly bulletins
│       ├── EventsCalendarPage.tsx # Liturgical & parish calendar
│       ├── SacramentsPage.tsx # 7 Sacraments guidance & societies directory
│       ├── GalleryPage.tsx    # Categorized photo albums & lightbox
│       ├── DonatePage.tsx     # Online giving (Ghana MoMo, Cards, PayPal)
│       ├── ContactPage.tsx    # Contact form & Mass intention booking
│       ├── ReceiptViewPage.tsx # Dedicated public receipt lookup & print
│       └── admin/
│           ├── AdminLoginPage.tsx      # Staff login with demo autofill
│           ├── AdminLayout.tsx         # Staff portal navigation shell
│           ├── AdminDashboardPage.tsx  # Analytics & giving breakdown
│           ├── AdminDonationsPage.tsx  # Transaction ledger & CSV export
│           ├── AdminAnnouncementsPage.tsx # Announcements CMS
│           ├── AdminEventsPage.tsx     # Liturgical events CMS
│           ├── AdminMessagesPage.tsx   # Inquiries & intentions inbox
│           └── AdminGalleryPage.tsx    # Media gallery CMS
├── package.json
├── tsconfig.json
└── vite.config.ts
```
