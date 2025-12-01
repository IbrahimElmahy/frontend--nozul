
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
    reservationId?: string; // Added for Order creation

    // Details
    unitType: string;
    unitTypeName?: string; // For display purposes
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

export type BookingStatus = 'check-in' | 'check-out' | 'pending' | 'confirmed' | 'cancelled';
export type RentType = 'daily' | 'hourly' | 'monthly' | 'weekly';

export interface Booking {
    id: number | string;
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

    // New fields mapped from API
    vatOnly?: number;
    lodgingTax?: number;
    payment?: number;
    refund?: number;
    checkedInAt?: string | null;
    checkedOutAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
    statusDisplay?: string;
    rentalDisplay?: string;
    discountDisplay?: string;
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
    account?: string; // UUID for financial account
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
    service: string; // Service ID or Name depending on context
    service_name?: string; // Display name
    category: string; // Category ID or Name
    category_name?: string; // Display name
    quantity: number;
    price: number;
}

export interface Order {
    id: string; // Changed to string to match API UUIDs
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
    id: string;
    receiptNumber: string; // Maps to 'number' or 'id' for display
    currency: string;
    value: number; // Maps to 'amount'
    date: string;
    time: string;
    paymentMethod: string;
    paymentType: string | null; // 'payment' or 'receipt'
    transactionNumber: string | null;
    bookingNumber: string | null;
    createdAt: string; // created_at
    updatedAt: string; // updated_at
    description?: string;
    // Financial legs for reconstruction in edit (simplified)
    debitAccount?: string;
    creditAccount?: string;
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

export interface HotelUserProfile {
    birthdate: string | null;
    gender: string | null;
    timezone: string | null;
    image: string | null;
    gender_display: string | null;
}

export interface HotelUser {
    id: string; // UUID
    username: string;
    name: string;
    phone_number: string;
    email: string;
    role: string;
    role_display: string;
    is_active: boolean;
    last_login: string | null;
    created_at: string;
    updated_at: string;
    profile: HotelUserProfile;
    image_url: string | null;
    login_allowed?: boolean;

    // Optional fields for UI/Forms that might not be in main list API
    isManager?: boolean;
    notes?: string;
    permissions?: Record<string, boolean>;

    // Deprecated/Mapped fields for backward compatibility with existing components if needed
    mobile?: string; // mapped to phone_number
    status?: 'active' | 'inactive'; // mapped to is_active
    gender?: string; // mapped to profile.gender
    lastLogin?: string; // mapped to last_login
    createdAt?: string; // mapped to created_at
    updatedAt?: string; // mapped to updated_at
    dob?: string; // mapped to profile.birthdate
}

export interface ApartmentPrice {
    id: string; // price object UUID
    apartment: string; // name
    apartment_id: string; // apartment UUID
    apartment_type: string;
    floor: string;
    rooms: string;
    regular_price: number;
    regular_minimum_price: number;
    peak_price: number;
    monthly_price: number;
    monthly_minimum_price: number;
    hourly_price: number;
    hourly_minimum_price: number;
}

export interface PeakTime {
    id: string;
    category: string;
    start_date: string;
    end_date: string;
    sat: boolean;
    sun: boolean;
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    created_at: string;
    updated_at: string;
}

export interface Tax {
    id: string; // UUID
    name: string;
    tax_value: number;
    tax_type: string; // amount, percent
    applies_to: string; // reservation, service
    start_date: string;
    end_date: string;
    is_added_to_price: boolean;
    is_vat_included: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Item {
    id: string;
    name_en: string;
    name_ar: string;
    services?: number;
    description?: string;
    status?: 'active' | 'inactive';
    is_active?: boolean;
    created_at: string;
    updated_at: string;
    // Service specific fields
    price?: number;
    category?: string; // UUID of category
    category_name?: string;
}

export interface Service extends Item {
    price: number;
    category: string;
}

export interface Category extends Item {
    // Category specific fields if any beyond Item
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
    id: string; // Changed to string for UUID
    name_en: string;
    name_ar: string;
    description?: string;
    status?: 'active' | 'inactive'; // Normalized in component
    is_active?: boolean; // API field
    created_at: string;
    updated_at: string;
    account?: string; // UUID for financial account
}

export interface Bank {
    id: string; // Changed to string for UUID
    name_en: string;
    name_ar: string;
    description?: string;
    status?: 'active' | 'inactive'; // Normalized
    is_active?: boolean; // API field
    created_at: string;
    updated_at: string;
    account?: string; // UUID for financial account
}

export interface Expense {
    id: string; // Changed to string for UUID
    name_en: string;
    name_ar: string;
    description?: string;
    status?: 'active' | 'inactive'; // Normalized
    is_active?: boolean; // API field
    created_at: string;
    updated_at: string;
    account?: string; // UUID for financial account
}

export interface ArchiveLog {
    content_type: string;
    action_type: string;
    action_time: string;
    action_by: string;
    role: string;
    data: Record<string, any>;
}

export interface Notification {
    pk: string;
    unread: boolean;
    verb: string;
    timestamp: string;
    actor: {
        phone_number: string;
        username: string;
        name: string;
        image_url: string | null;
    };
}

export interface HotelCondition {
    id: string;
    hotel: string;
    content_en: string;
    content_ar: string;
    created_at: string;
    updated_at: string;
}

// ---------- Reports & Reservations ----------

export interface ReportFilterOption {
    id: string | number;
    name: string;
}

export interface DailyBookingItem {
    id: string;
    hotel: string;
    guest: string; // Flat string as per API doc
    number: string;
    check_in_date: string;
    check_out_date: string;
    status: string;
    rental_type: string;
    apartment: string; // Flat string as per API doc
    apartment_type: string;
    amount: number;
    total: number;
    balance: string | number;
    status_display: string;
    rental_display: string;
    // Additional fields that might be present or mapped
    price?: number; // Mapped from amount?
    tax?: number;
    booking_number?: string; // Mapped from number?
    created_at?: string;
    updated_at?: string;
}

export interface BaladyItem {
    id: string | number;
    contract_number: string;
    guest_name: string;
    national_id: string;
    mobile: string;
    check_in: string;
    check_out: string;
    unit_number: string;
    contract_date?: string;
}

export interface FundReportItem {
    id: string | number;
    date: string;
    type: string;
    number: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
    payment_method?: string;
}

export interface DataTableResponse<T> {
    data: T[];
    recordsFiltered: number;
    recordsTotal?: number;
}

export interface PaymentMethodAPI {
    id: string | number;
    name?: string;
    name_en?: string;
    name_ar?: string;
}

export interface ReceiptType {
    id: string | number;
    name?: string;
    name_en?: string;
    name_ar?: string;
}

export interface Reservation {
    id: number | string;
    number: string;
    guest: string | Record<string, unknown>;
    apartment: string | Record<string, unknown>;
    check_in_date: string;
    check_out_date: string;
    time?: string;
    status: string;
    rental_type: string;
    period: number;
    rent: number | string;
    amount: number | string;
    discount?: number | string;
    discount_value?: number | string;
    subtotal: number | string;
    tax: number | string;
    total: number | string;
    payments?: number | string;
    paid?: number | string;
    balance?: number | string;
    created_at: string;
    updated_at: string;
    // New fields from API
    vat_only?: number;
    lodging_tax?: number;
    payment?: number;
    refund?: number;
    total_orders?: string | number;
    note?: string;
    checked_in_at?: string | null;
    checked_out_at?: string | null;
    created_by?: string;
    updated_by?: string;
    status_display?: string;
    rental_display?: string;
    discount_display?: string;
    companions?: any[];
    source?: string | number; // Can be string name or ID
    reason?: string | number; // Can be string name or ID
    apartment_price?: number;
    tax_with_price?: number;
    [key: string]: any;
}

export interface ReservationListResponse {
    count: number;
    results: Reservation[];
}

export interface ReservationStatistics {
    [key: string]: number;
}

export type StatusCountResponse = Record<string, number>;

export interface TimelineResponse {
    results?: Reservation[];
    timeline?: any[];
    [key: string]: any;
}

export interface RentalCalculationRequest {
    reservation?: number | string;
    check_in_date?: string;
    check_out_date?: string;
    rent?: number | string;
    discount_value?: number | string;
    rental_type?: string;
    [key: string]: any;
}

export interface RentalCalculationResponse {
    amount: number;
    subtotal?: number;
    tax?: number;
    total?: number;
    discount?: number;
    [key: string]: any;
}

export interface CheckoutRequest {
    reservation: number | string;
    [key: string]: any;
}

export interface Apartment {
    id: string | number;
    name?: string;
    apartment_type?: string;
    floor?: string | number;
    status?: string;
    [key: string]: any;
}

export interface RentalType {
    id: string;
    name: string;
    name_ar: string;
    name_en: string;
}

export interface ReservationSource {
    id: string;
    name: string;
    name_ar: string;
    name_en: string;
}

export interface ReservationReason {
    id: string;
    name: string;
    name_ar: string;
    name_en: string;
}

export interface DiscountType {
    id: string;
    name: string;
    name_ar: string;
    name_en: string;
}

export interface Country {
    code: string;
    name: string;
}

export interface GuestCategory {
    id: string;
    name: string;
    name_ar: string;
    name_en: string;
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
}

export interface InvoiceListResponse {
    count: number;
    results: Invoice[];
}

export interface OrderCalculationRequest {
    reservation: string;
    note?: string;
    order_items: {
        service: string;
        category: string;
        quantity: number;
    }[];
}

export interface OrderCalculationResponse {
    total: number;
    tax: number;
    subtotal: number;
    discount: number;
    [key: string]: any;
}

export interface ServiceListResponse {
    count: number;
    results: Service[];
}

export interface OrderListResponse {
    count: number;
    results: Order[];
}
