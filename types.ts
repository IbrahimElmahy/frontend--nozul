import React from 'react';

// FIX: Remove circular import and define ChartData.
export interface ChartData {
  name: string;
  value: number;
}

export interface DonutChartData extends ChartData {
  color: string;
}

export type UnitStatus = 'free' | 'occupied' | 'not-checked-in' | 'out-of-service';
export type CleaningStatus = 'clean' | 'not-clean';
export type CoolingType = 'central' | 'split' | 'window' | '';

export interface Unit {
    // Core Info
    id: string; // unique identifier
    unitNumber: string;
    unitName?: string;
    
    // Status & Reservation
    status: UnitStatus;
    customerName?: string;
    checkIn?: string;
    checkOut?: string;
    price?: number;
    remaining?: number;

    // Details
    unitType: string;
    cleaningStatus: CleaningStatus;
    isAvailable: boolean;
    floor: number;
    rooms: number;
    bathrooms: number;
    beds: number;
    doubleBeds: number;
    wardrobes: number;
    tvs: number;
    coolingType: CoolingType;
    notes: string;

    // Features
    features: string[]; // Array of feature IDs
}

export interface User {
    access_token: string;
    refresh: string;
    name: string;
    username: string;
    email: string;
    phone_number: string;
    role_name: string;
    role: string;
}

export type BookingStatus = 'check-in' | 'check-out';
export type RentType = 'daily' | 'hourly' | 'monthly';

export interface Booking {
  id: number;
  bookingNumber: string;
  guestName: string;
  unitName: string;
  checkInDate: string;
  checkOutDate: string;
  time: string;
  status: BookingStatus;
  rentType: RentType;
  duration: number;
  rent: number;
  value: number;
  discount: number; // Changed from string for calculations
  subtotal: number;
  // FIX: Add optional tax property to support mock data.
  tax?: number;
  total: number;
  payments: number;
  balance: number;
  createdAt: string;
  updatedAt: string;

  // New detailed fields from the form redesign
  bookingSource?: string;
  bookingReason?: string;
  guestType?: string;
  companions?: number;
  discountType?: 'percentage' | 'fixed' | '';
  totalOrders?: number;
  notes?: string;
  price?: number;
  receiptVoucher?: string;
  returnVouchers?: string;
  invoices?: string;
  order?: string;
}

export type GuestStatus = 'active' | 'inactive';

// Updated Guest interface to match API
export interface Guest {
  id: string; // It's a UUID
  name: string;
  gender: 'male' | 'female';
  country: string; // e.g., "SA"
  country_display: string;
  phone_number: string;
  email?: string;
  city?: string;
  guest_type: string; // Display name like "مواطن"
  id_number: string;
  ids: string; // Display name like "جواز سفر"
  is_active: boolean;
  created_at: string;
  updated_at: string;
  birthdate: string | null;
  work_number: string | null;
  work_place: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  note: string;
  postal_code: string;
  street: string;
  neighborhood: string;
}

export interface GuestTypeAPI {
    id: string;
    name: string;
    name_ar: string;
    name_en: string;
    ids: string[]; // Array of compatible ID type UUIDs
}

export interface IdTypeAPI {
    id: string;
    name: string;
    name_ar: string;
    name_en: string;
    guests_types: string[]; // Array of compatible Guest type UUIDs
}

export interface CountryAPI {
    [code: string]: string;
}

// New Agency Types
export type AgencyType = 'company' | 'individual';
export type AgencyIdType = 'tax_id' | 'unified_establishment_number' | 'other';
export type AgencyStatus = 'active' | 'inactive';

export interface BookingAgency {
  id: number;
  name: string;
  mobileNumber: string;
  country: string;
  agencyType: AgencyType;
  idType: AgencyIdType;
  idNumber: string;
  issueDate: string | null;
  expiryDate: string | null;
  status: AgencyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  service: string;
  category: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  bookingNumber: string;
  apartmentName: string;
  value: number;
  discount: number; // Represents percentage
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  notes?: string;
}

export interface Receipt {
  id: number;
  receiptNumber: string;
  currency: string;
  value: number;
  date: string;
  time: string;
  paymentMethod: string;
  paymentType: string | null;
  transactionNumber: string | null;
  bookingNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  bookingNumber: string;
  value: number;
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface HotelUser {
    id: number;
    username: string;
    name: string;
    mobile: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    gender: 'male' | 'female' | '-';
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
    dob?: string;
    isManager?: boolean;
    notes?: string;
    permissions?: Record<string, boolean>;
}
