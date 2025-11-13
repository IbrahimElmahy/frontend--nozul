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

// Aligned with Agent API (which is a Guest with category='agent')
export interface BookingAgency {
  id: string;
  name: string;
  phone_number: string;
  country: string;
  country_display: string;
  guest_type: string; // This is the UUID for the form, but display name from list
  ids: string; // This is the UUID for the form, but display name from list
  id_number: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  discount_type?: 'percent' | 'amount' | string;
  discount_value?: number;
  discount_display?: string;
  
  // Address fields
  address_country?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  postal_code?: string;
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
  id: string; // was number
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
  id: string;
  number: string; // was invoiceNumber
  reservation: string; // was bookingNumber
  amount: number; // was value
  total: number;
  created_at: string; // was createdAt
  updated_at: string; // was updatedAt
  // The old fields were: discount, subtotal, tax. They are not in the main list response
  discount?: number;
  subtotal?: number;
  tax?: number;
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

export interface ApartmentPrice {
    id: number;
    apartmentName: string;
    roomType: string;
    floor: number;
    rooms: number;
    price: number;
    dailyPrice: number;
    dailyLowestPrice: number;
    monthlyPrice: number;
    monthlyLowestPrice: number;
    peakPrice: number;
    peakLowestPrice: number;
}

export interface PeakTime {
    id: number;
    item: string;
    startDate: string;
    endDate: string;
    saturday: boolean;
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Tax {
    id: number;
    name: string;
    tax: number;
    applyTo: 'الحجوزات' | 'الخدمات';
    startDate: string;
    endDate: string;
    addedToFees: boolean;
    subjectToVat: boolean;
    status: 'مفعل' | 'غير مفعل';
    createdAt: string;
    updatedAt: string;
}

export interface Item {
    id: number;
    name_en: string;
    name_ar: string;
    services: number;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface Currency {
    id: number;
    name_en: string;
    name_ar: string;
    type: 'local' | 'foreign';
    exchange_rate: number;
    status: 'active' | 'inactive';
    symbol_en: string;
    fraction_en: string;
    symbol_ar: string;
    fraction_ar: string;
    createdAt: string;
    updatedAt: string;
}

export interface Fund {
    id: number;
    name_en: string;
    name_ar: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface Bank {
    id: number;
    name_en: string;
    name_ar: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface Expense {
    id: number;
    name_en: string;
    name_ar: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}