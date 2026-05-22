export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  role: 'user' | 'establishment' | 'admin';
  establishment_name: string;
  establishment_type: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface FoodOffer {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: FoodCategory;
  offer_type: OfferType;
  original_price: number;
  offer_price: number;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  city: string;
  address: string;
  status: OfferStatus;
  views: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Donation {
  id: string;
  donor_id: string;
  receiver_id: string | null;
  donation_type: DonationType;
  amount: number;
  description: string;
  status: DonationStatus;
  city: string;
  is_offering: boolean;
  contact_info: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export type FoodCategory = 'frutas_verduras' | 'panaderia' | 'lacteos' | 'preparados' | 'carnes' | 'granos' | 'otros';
export type OfferType = 'low_price' | 'free' | 'donation';
export type OfferStatus = 'active' | 'claimed' | 'expired';
export type DonationType = 'money' | 'food' | 'both';
export type DonationStatus = 'available' | 'pending' | 'completed' | 'cancelled';

export type Page = 'home' | 'offers' | 'donations' | 'impact' | 'admin' | 'create-offer' | 'create-donation';
