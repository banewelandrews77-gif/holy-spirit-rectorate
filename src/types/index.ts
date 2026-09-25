export type ChurchId = 'all' | 'holy-spirit' | 'st-anthony' | 'st-matthew';

export type FundCategory = 'tithe' | 'offertory' | 'building' | 'harvest' | 'intentions' | 'welfare';

export type PaymentMethod = 'paystack' | 'momo' | 'card' | 'paypal';

export type MoMoNetwork = 'mtn' | 'telecel' | 'at';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Donation {
  id: number;
  receipt_number: string;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  church_id: ChurchId;
  fund_category: FundCategory;
  amount: number;
  currency: string;
  frequency: 'one-time' | 'weekly' | 'monthly';
  payment_method: PaymentMethod;
  momo_network?: MoMoNetwork;
  status: 'completed' | 'pending' | 'failed';
  transaction_ref: string;
  notes?: string;
  created_at: string;
}

export interface DonationReceipt {
  receiptNumber: string;
  transactionRef: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  churchId: string;
  churchName: string;
  fundCategory: string;
  fundName: string;
  amount: number;
  currency: string;
  frequency: string;
  paymentMethod: string;
  momoNetwork?: string;
  date: string;
  notes?: string;
  status: string;
  blessing: string;
}

export interface Announcement {
  id: number;
  title: string;
  slug: string;
  content: string;
  church_id: ChurchId;
  category: 'general' | 'urgent' | 'liturgical' | 'youth' | 'societies';
  is_pinned: number;
  published_at: string;
  author_name?: string;
}

export interface ParishEvent {
  id: number;
  title: string;
  church_id: ChurchId;
  category: 'mass' | 'feast' | 'retreat' | 'meeting' | 'youth';
  description: string;
  location: string;
  start_date: string;
  end_date?: string;
  time_info: string;
  is_featured: number;
}

export interface Bulletin {
  id: number;
  title: string;
  week_label: string;
  summary: string;
  download_url: string;
  published_at: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  album: string;
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  church_id: ChurchId;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  church_id: ChurchId;
  category: 'general' | 'mass_intention' | 'pastoral_counseling' | 'sacraments';
  subject: string;
  message: string;
  intention_date?: string;
  status: 'unread' | 'responded' | 'archived';
  created_at: string;
}
