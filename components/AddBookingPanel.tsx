import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { ErrorContext } from '../contexts/ErrorContext';
import { Booking, RentType, Unit, Guest, GuestTypeAPI, IdTypeAPI, CountryAPI, Receipt, Order, Companion, ReservationRelationship, ReservationSource, ReservationReason } from '../types';
import {
    getRentalTypes,
    getReservationSources,
    getReservationReasons,
    getReservationRelationships,
    getDiscountTypes,
    getCountries,
    getGuestCategories,
    getGuestIdTypes,
    calculateRental,
} from '../services/reservations';
import {
    listUnits,
    listUnitTypes,
    listCoolingTypes,
    listFeatures,
    createUnit,
    updateUnit
} from '../services/units';
import { createGuest, updateGuest, getGuestTypes, getIdTypes, listGuests } from '../services/guests';
import { createOrder } from '../services/orders';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import SearchableSelect from './SearchableSelect';
import PlusIcon from './icons-redesign/PlusIcon';
import PencilIcon from './icons-redesign/PencilIcon';
import MinusIcon from './icons-redesign/MinusIcon';
import EyeIcon from './icons-redesign/EyeIcon';
import UnitEditPanel from './UnitEditPanel';
import AddGuestPanel from './AddGuestPanel';
import GuestDetailsModal from './GuestDetailsModal';
import AddReceiptPanel from './AddReceiptPanel';
import ReceiptDetailsModal from './ReceiptDetailsModal';
import AddOrderPanel from './AddOrderPanel';
import OrderDetailsModal from './OrderDetailsModal';

import { mapApiUnitToUnit, mapUnitToFormData } from './data/apiMappers';
import AddCompanionModal from './AddCompanionModal';
import TrashIcon from './icons-redesign/TrashIcon';

interface AddBookingPanelProps {
    initialData: Booking | Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (booking: Booking | Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>) => Promise<void> | void;
    isSaving?: boolean;
}

const SectionHeader: React.FC<{ title: string; }> = ({ title }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-2 my-4 rounded-md flex items-center">
        <div className="w-1 h-4 bg-blue-500 rounded-full mx-2"></div>
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</h3>
    </div>
);


const ActionButton: React.FC<{ icon: React.ComponentType<{ className?: string }>, color: string, onClick?: () => void, disabled?: boolean }> = ({ icon: Icon, color, onClick, disabled = false }) => (
    <button type="button" onClick={onClick} className={`w-7 h-7 flex items-center justify-center rounded ${color} text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`} disabled={disabled}>
        <Icon className="w-4 h-4" />
    </button>
);

const EditButton: React.FC<{ label: string, onClick?: () => void }> = ({ label, onClick }) => (
    <button type="button" onClick={onClick} className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded hover:bg-red-600 transition-colors">
        {label}
    </button>
);

// Templates for new items
const newUnitTemplate: Unit = {
    id: '',
    unitNumber: '',
    unitName: '',
    status: 'free',
    unitType: '',
    cleaningStatus: 'clean',
    isAvailable: true,
    floor: 1,
    rooms: 1,
    bathrooms: 1,
    beds: 1,
    doubleBeds: 0,
    wardrobes: 1,
    tvs: 1,
    coolingType: 'split',
    notes: '',
    features: [],
    price: 0
};


const AddBookingPanel: React.FC<AddBookingPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave, isSaving }) => {
    const { t, language } = useContext(LanguageContext);
    const { showError } = useContext(ErrorContext);
    const [formData, setFormData] = useState(initialData);
    const [calcLoading, setCalcLoading] = useState(false);
    const [calcError, setCalcError] = useState<string | null>(null);

    // Data Lists
    const [units, setUnits] = useState<Unit[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);

    // Options for Sub-panels
    const [unitTypeOptions, setUnitTypeOptions] = useState<{ id: string, name: string }[]>([]);
    const [coolingTypeOptions, setCoolingTypeOptions] = useState<[string, string][]>([]);
    const [allApiFeatures, setAllApiFeatures] = useState<any[]>([]);
    const [guestTypes, setGuestTypes] = useState<GuestTypeAPI[]>([]);
    const [idTypes, setIdTypes] = useState<IdTypeAPI[]>([]);
    const [countries, setCountries] = useState<CountryAPI>({});
    const [rentalTypes, setRentalTypes] = useState<{ id: string; name: string; }[]>([]);
    const [sources, setSources] = useState<ReservationSource[]>([]);
    const [reasons, setReasons] = useState<ReservationReason[]>([]);
    const [relationships, setRelationships] = useState<ReservationRelationship[]>([]);
    const [discountTypes, setDiscountTypes] = useState<{ id: string; name: string; }[]>([]);


    // Sub-panel States
    // Unit
    const [isUnitPanelOpen, setIsUnitPanelOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [isAddingUnit, setIsAddingUnit] = useState(false);

    // Guest
    const [isGuestPanelOpen, setIsGuestPanelOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
    const [viewingGuest, setViewingGuest] = useState<Guest | null>(null);

    // Financials (Placeholders for now, as they might need Booking ID)
    const [isReceiptPanelOpen, setIsReceiptPanelOpen] = useState(false);
    const [isOrderPanelOpen, setIsOrderPanelOpen] = useState(false);
    const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null); // For future use
    const [editingOrder, setEditingOrder] = useState<Order | null>(null); // For future use

    // Companion State
    const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);
    const [companionsList, setCompanionsList] = useState<Companion[]>([]);


    const fetchData = useCallback(async () => {
        try {
            // Fetch Units
            const unitsRes = await listUnits(new URLSearchParams({ length: '1000' }));
            setUnits(unitsRes.data.map(mapApiUnitToUnit));

            // Fetch Guests
            const guestsRes = await listGuests(new URLSearchParams({ length: '1000' }));
            setGuests(guestsRes.data);

            // Fetch Options if not already loaded (could be optimized)
            if (unitTypeOptions.length === 0) {
                const [
                    typesRes,
                    coolingRes,
                    featuresRes,
                    gTypesRes,
                    idTypesRes,
                    countriesRes,
                    rentalTypesRes,
                    sourcesRes,
                    reasonsRes,
                    relationshipsRes,
                    discountTypesRes,
                    guestCategoriesRes,
                    guestIdTypesRes
                ] = await Promise.all([
                    listUnitTypes(),
                    listCoolingTypes(),
                    listFeatures(),
                    getGuestTypes(),
                    getIdTypes(),
                    getCountries(),
                    getRentalTypes(),
                    getReservationSources({ length: 100 }), // increased limit for dropdowns
                    getReservationReasons({ length: 100 }),
                    getReservationRelationships({ length: 100 }),
                    getDiscountTypes(),
                    getGuestCategories(),
                    getGuestIdTypes()
                ]);
                setUnitTypeOptions(typesRes);
                setCoolingTypeOptions(coolingRes);
                setAllApiFeatures(featuresRes);
                setGuestTypes(gTypesRes.data);
                setIdTypes(idTypesRes.data);
                setCountries(countriesRes);

                // Handle Arrays vs Paginated Responses safely
                const getResults = (res: any) => res?.results || res?.data || (Array.isArray(res) ? res : []);

                setRentalTypes(getResults(rentalTypesRes));
                setSources(getResults(sourcesRes));
                setReasons(getResults(reasonsRes));
                setRelationships(getResults(relationshipsRes));
                setDiscountTypes(getResults(discountTypesRes));

                // Guest Categories and ID Types are seemingly duplicates or unused in state
                // guestCategoriesRes -> No state
                // guestIdTypesRes -> Covered by idTypesRes (apiClient call)
            }

        } catch (err) {
            console.error("Error fetching data for booking panel", err);
        }
    }, [unitTypeOptions.length]);

    useEffect(() => {
        if (isOpen) {
            setFormData(JSON.parse(JSON.stringify(initialData)));
            // Initialize companions list if present in initialData
            if (initialData.companionsData) {
                setCompanionsList(initialData.companionsData);
            } else {
                setCompanionsList([]);
            }
            fetchData();
        }
    }, [isOpen, initialData, fetchData]);

    // Unit Handlers
    const handleAddUnitClick = () => {
        const newTemplate = { ...newUnitTemplate, unitType: unitTypeOptions[0]?.id || '' };
        setEditingUnit(newTemplate);
        setIsAddingUnit(true);
        setIsUnitPanelOpen(true);
    };

    const handleEditUnitClick = () => {
        const unitId = formData.unitName; // Assuming unitName holds the ID
        const unit = units.find(u => u.id.toString() === unitId?.toString());
        if (unit) {
            setEditingUnit(unit);
            setIsAddingUnit(false);
            setIsUnitPanelOpen(true);
        } else {
            alert(t('bookings.alerts.selectUnitFirst'));
        }
    };

    const handleViewUnitClick = () => {
        const unitId = formData.unitName;
        const unit = units.find(u => u.id.toString() === unitId?.toString());
        if (unit) {
            // Re-using edit panel for view, maybe add read-only mode later
            setEditingUnit(unit);
            setIsAddingUnit(false);
            setIsUnitPanelOpen(true);
        } else {
            alert(t('bookings.alerts.selectUnitFirst'));
        }
    };

    const handleSaveUnit = async (updatedUnit: Unit) => {
        const unitFormData = mapUnitToFormData(updatedUnit);
        try {
            let savedUnit: Unit;
            if (isAddingUnit) {
                const newApiUnit = await createUnit(updatedUnit);
                savedUnit = mapApiUnitToUnit(newApiUnit);
                setUnits(prev => [savedUnit, ...prev]);
            } else {
                const updatedApiUnit = await updateUnit(updatedUnit);
                savedUnit = mapApiUnitToUnit(updatedApiUnit);
                setUnits(prev => prev.map(u => u.id === savedUnit.id ? savedUnit : u));
            }

            // Auto-select the unit
            setFormData(prev => ({ ...prev, unitName: savedUnit.id, price: savedUnit.price || prev.price, rent: savedUnit.price || prev.rent }));
            setIsUnitPanelOpen(false);
        } catch (err) {
            console.error("Error saving unit", err);
            // Global error handler will show the modal
        }
    };


    // Guest Handlers
    const handleAddGuestClick = () => {
        setEditingGuest(null); // Add mode
        setIsGuestPanelOpen(true);
    };

    const handleEditGuestClick = () => {
        // guestName in formData might be the ID or Name depending on implementation.
        // Assuming it stores the ID for now based on typical select behavior, 
        // BUT SearchableSelect usually stores the value. 
        // If formData.guestName stores the name string, we need to find the guest by name.
        // If it stores ID, we find by ID.
        // Let's assume it stores the ID or we try to find by both.

        // Actually, looking at existing code: `value={formData.guestName}`. 
        // And `options={['حملة محمد', 'محمد سالم']}`. It seems it was storing names.
        // We should switch to storing IDs for robust linking.

        // For now, let's try to find the guest object.
        const guestIdOrName = formData.guestName;
        const guest = guests.find(g => g.id.toString() === guestIdOrName || g.name === guestIdOrName);

        if (guest) {
            setEditingGuest(guest);
            setIsGuestPanelOpen(true);
        } else {
            showError(t('bookings.alerts.selectGuestFirst'));
        }
    };

    const handleViewGuestClick = () => {
        const guestIdOrName = formData.guestName;
        const guest = guests.find(g => g.id.toString() === guestIdOrName || g.name === guestIdOrName);
        if (guest) {
            setViewingGuest(guest);
        } else {
            showError(t('bookings.alerts.selectGuestFirst'));
        }
    };

    const handleSaveGuest = async (guestFormData: FormData) => {
        try {
            let newGuest: Guest;
            if (editingGuest) {
                newGuest = await updateGuest(editingGuest.id, guestFormData);
                setGuests(prev => prev.map(g => g.id === newGuest.id ? newGuest : g));
            } else {
                newGuest = await createGuest(guestFormData);
                setGuests(prev => [newGuest, ...prev]);
            }

            // Auto-select
            setFormData(prev => ({ ...prev, guestName: newGuest.id })); // Storing ID
            setIsGuestPanelOpen(false);
            setEditingGuest(null);
        } catch (err) {
            console.error("Error saving guest", err);
            // Global error handler will show the modal
        }
    };

    // Financial Handlers (Placeholder/Basic)
    const handleAddReceiptClick = () => {
        // Ideally we pass the booking ID, but for new bookings we might not have it.
        // Alert user if booking not saved?
        if (!('id' in formData)) {
            alert(t('bookings.alerts.saveBookingFirst'));
            return;
        }
        setIsReceiptPanelOpen(true);
    };

    const handleAddOrderClick = () => {
        if (!('id' in formData)) {
            alert(t('bookings.alerts.saveBookingFirst'));
            return;
        }
        setIsOrderPanelOpen(true);
    };


    useEffect(() => {
        const value = formData.rent || 0;
        const discount = formData.discount || 0;
        const payments = formData.payments || 0;
        const totalOrders = formData.totalOrders || 0;

        const subtotal = value - discount;
        const total = subtotal + (formData.tax || 0) + totalOrders;
        const balance = payments - total;


        // Sync companions count
        const companionsCount = companionsList.length;

        setFormData(prev => ({ ...prev, value, subtotal, total, balance, companions: companionsCount }));

    }, [formData.rent, formData.discount, formData.payments, formData.totalOrders, formData.tax, companionsList.length]);

    const handleSaveCompanion = (companion: Companion) => {
        setCompanionsList(prev => [...prev, companion]);
    };

    const handleRemoveCompanion = (index: number) => {
        setCompanionsList(prev => prev.filter((_, i) => i !== index));
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleDateChange = (name: 'checkInDate' | 'checkOutDate', date: string) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    const handleSaveClick = async () => {
        if (isSaving) return;

        // Ensure we send IDs for foreign keys, resolving from Names if necessary
        // This is crucial because initialData might be populated with Names (from Table display),
        // but the API expects UUIDs.
        let finalFormData = { ...formData };

        // Resolve Guest ID
        const currentGuestVal = formData.guestName;
        // Try finding by Name or ID
        const matchedGuest = guests.find(g => g.id.toString() === currentGuestVal || g.name === currentGuestVal);
        if (matchedGuest) {
            finalFormData.guestName = matchedGuest.id;
        }

        // Resolve Unit ID
        const currentUnitVal = formData.unitName;
        const matchedUnit = units.find(u => u.id.toString() === currentUnitVal || u.unitName === currentUnitVal || u.unitNumber === currentUnitVal);
        if (matchedUnit) {
            finalFormData.unitName = matchedUnit.id;
        }

        await onSave({ ...finalFormData, companionsData: companionsList });
    };

    const handleSaveOrder = async (orderData: any) => {
        try {
            // orderData coming from AddOrderPanel has bookingNumber set to reservationId
            if (!orderData.bookingNumber) {
                alert(t('bookings.alerts.saveBookingFirst'));
                return;
            }

            const payload = {
                reservation: orderData.bookingNumber,
                note: orderData.notes,
                order_items: orderData.items?.map((item: any) => ({
                    service: item.service,
                    category: item.category,
                    quantity: item.quantity
                })) || []
            };

            await createOrder(payload);
            setIsOrderPanelOpen(false);
            // Optional: Show success message or refresh data if needed
            // alert(t('orders.orderSavedSuccess')); 
        } catch (err) {
            console.error("Error saving order", err);
            // ErrorContext should handle this if configured, or alert
            alert(typeof err === 'string' ? err : 'Failed to save order');
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        // Find the selected unit to get its UUID
        // Assuming search matches unitNumber or unitName
        const selectedUnit = units.find(u => u.unitNumber === formData.unitName || u.unitName === formData.unitName || u.id === formData.unitName);
        const apartmentUUID = selectedUnit?.id;

        if (!formData.checkInDate || !formData.rentType || !formData.duration || !formData.rent || !apartmentUUID) {
            return;
        }

        const controller = new AbortController();
        const runCalculation = async () => {
            setCalcLoading(true);
            setCalcError(null);
            try {
                const response = await calculateRental({
                    hotel: 1,
                    rental_type: formData.rentType,
                    check_in_date: formData.checkInDate,
                    check_out_date: formData.checkOutDate,
                    period: formData.duration,
                    apartment: apartmentUUID,
                    rent: formData.rent,
                    discount_type: formData.discountType === 'percentage' ? 'percent' : formData.discountType === 'fixed' ? 'fixed' : undefined,
                    discount_value: formData.discount,
                    reservation: 'id' in formData ? (formData as any).id : null,
                });

                setFormData(prev => ({
                    ...prev,
                    checkOutDate: response?.check_out_date,
                    rent: Number(response?.rent) || prev.rent,
                    discount: response?.discount ?? prev.discount,
                    subtotal: response?.subtotal ?? prev.subtotal,
                    tax: response?.tax ?? prev.tax,
                    total: response?.total ?? prev.total,
                    balance: Number(response?.balance) || prev.balance,
                    value: response?.amount ?? prev.value,
                }));
            } catch (err) {
                if (!controller.signal.aborted) {
                    setCalcError(err instanceof Error ? err.message : 'Calculation failed');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setCalcLoading(false);
                }
            }
        };

        runCalculation();
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.rentType, formData.checkInDate, formData.checkOutDate, formData.duration, formData.unitName, formData.rent, formData.discount, formData.discountType, isOpen]);

    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;
    const labelBaseClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1`;

    const bookingSources = sources.map(s => s.name);
    const rentTypeOptions = rentalTypes.map(o => ({ value: o.id, label: o.name }));
    const bookingReasonOptions = reasons.map(r => r.name);
    const guestTypeOptions = guestTypes.map(gt => gt.name);

    const handleEditCompanionGuest = (guestId: string) => {
        const guest = guests.find(g => g.id.toString() === guestId.toString());
        if (guest) {
            setEditingGuest(guest);
            setIsGuestPanelOpen(true);
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-booking-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>

            <div className={`relative w-full max-w-screen-2xl bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[calc(100vh-2rem)] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-white/10 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                    <h2 id="add-booking-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">{isEditing ? t('bookings.editBookingTitle') : t('bookings.addBookingTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                            {/* Column 1: Booking, Calendar */}
                            <div className="space-y-4">
                                <SectionHeader title={t('bookings.bookingInfo')} />
                                <div>
                                    <label className={labelBaseClass}>{t('bookings.bookingNumber')}</label>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm h-10 flex items-center">{'bookingNumber' in formData ? formData.bookingNumber : '----------'}</p>
                                </div>
                                <div>
                                    <label htmlFor="bookingSource" className={labelBaseClass}>{t('bookings.bookingSource')}</label>
                                    <SearchableSelect id="bookingSource" options={bookingSources} value={formData.bookingSource || ''} onChange={(val) => setFormData(p => ({ ...p, bookingSource: val }))} placeholder={t('bookings.selectBookingSource')} />
                                </div>

                                <SectionHeader title={t('bookings.calendarInfo')} />
                                <div>
                                    <label htmlFor="rentType" className={labelBaseClass}>{t('bookings.rent')}</label>
                                    <SearchableSelect id="rentType" options={rentTypeOptions.map(o => o.label)} value={rentTypeOptions.find(o => o.value === formData.rentType)?.label || ''} onChange={(label) => { const opt = rentTypeOptions.find(o => o.label === label); if (opt) setFormData(p => ({ ...p, rentType: opt.value as RentType })); }} placeholder={t('bookings.selectRentType')} />
                                </div>
                                <div>
                                    <label className={labelBaseClass}>{t('bookings.rentCalendar')}</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <span className="text-xs text-slate-500">{t('bookings.from')}</span>
                                            <DatePicker value={formData.checkInDate} onChange={(date) => handleDateChange('checkInDate', date)} />
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-500">{t('bookings.to')}</span>
                                            <DatePicker value={formData.checkOutDate} onChange={(date) => handleDateChange('checkOutDate', date)} />
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-500">{t('bookings.time')}</span>
                                            <input type="time" name="time" value={formData.time || ''} onChange={handleInputChange} className={inputBaseClass} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="duration" className={labelBaseClass}>{t('bookings.duration')}</label>
                                    <input type="number" name="duration" value={formData.duration} onChange={handleNumberChange} className={`${inputBaseClass} bg-slate-100 dark:bg-slate-700`} readOnly />
                                </div>
                            </div>

                            {/* Column 2: Apartment, Guest Info */}
                            <div className="space-y-4">
                                <SectionHeader title={t('bookings.apartmentInfo')} />
                                <div>
                                    <label htmlFor="unitName" className={labelBaseClass}>{t('bookings.apartments')}</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-grow">
                                            <SearchableSelect id="unitName" options={units.map(u => u.unitNumber)} value={units.find(u => u.id.toString() === formData.unitName?.toString())?.unitNumber || formData.unitName || ''} onChange={(val) => { const u = units.find(unit => unit.unitNumber === val); setFormData(p => ({ ...p, unitName: u ? u.id : val, price: u ? u.price : p.price, rent: u ? u.price : p.rent })) }} placeholder={t('bookings.selectUnit')} />
                                        </div>
                                        <ActionButton icon={PlusIcon} color="bg-blue-500" onClick={handleAddUnitClick} />
                                        <ActionButton icon={PencilIcon} color="bg-yellow-400" onClick={handleEditUnitClick} disabled={!formData.unitName} />
                                        <ActionButton icon={EyeIcon} color="bg-blue-500" onClick={handleViewUnitClick} disabled={!formData.unitName} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelBaseClass}>{t('bookings.price')}</label>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm h-10 flex items-center">----------</p>
                                </div>

                                <SectionHeader title={t('bookings.guestInfo')} />
                                <div>
                                    <label htmlFor="bookingReason" className={labelBaseClass}>{t('bookings.bookingReasons')}</label>
                                    <SearchableSelect id="bookingReason" options={bookingReasonOptions} value={formData.bookingReason || ''} onChange={(val) => setFormData(p => ({ ...p, bookingReason: val }))} placeholder={t('bookings.selectBookingReason')} />
                                </div>
                                <div>
                                    <label htmlFor="guestType" className={labelBaseClass}>{t('bookings.guestType')}</label>
                                    <SearchableSelect id="guestType" options={guestTypeOptions} value={formData.guestType || ''} onChange={(val) => setFormData(p => ({ ...p, guestType: val }))} placeholder={t('bookings.selectGuestType')} />
                                </div>
                                <div>
                                    <label htmlFor="guestName" className={labelBaseClass}>{t('bookings.guest')}</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-grow">
                                            <SearchableSelect id="guestName" options={guests.map(g => g.name)} value={guests.find(g => g.id.toString() === formData.guestName?.toString())?.name || formData.guestName || ''} onChange={(val) => { const g = guests.find(guest => guest.name === val); setFormData(p => ({ ...p, guestName: g ? g.id : val })) }} placeholder={t('bookings.selectGuest')} />
                                        </div>
                                        <ActionButton icon={PlusIcon} color="bg-blue-500" onClick={handleAddGuestClick} />
                                        <ActionButton icon={PencilIcon} color="bg-yellow-400" onClick={handleEditGuestClick} disabled={!formData.guestName} />
                                        <ActionButton icon={EyeIcon} color="bg-blue-500" onClick={handleViewGuestClick} disabled={!formData.guestName} />
                                    </div>
                                </div>
                                <div>
                                </div>
                                <div>
                                    <label htmlFor="companions" className={labelBaseClass}>{t('bookings.companions')}</label>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-2 rounded border dark:border-slate-600">
                                            <span className="text-sm font-semibold">{companionsList.length} {t('bookings.companionsCount') || 'Companions'}</span>
                                            <button
                                                type="button"
                                                onClick={() => setIsCompanionModalOpen(true)}
                                                className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                                            >
                                                + {t('bookings.addCompanion') || 'Add'}
                                            </button>
                                        </div>

                                        {companionsList.length > 0 && (
                                            <div className="max-h-24 overflow-y-auto custom-scrollbar space-y-1">
                                                {companionsList.map((comp, idx) => (
                                                    <div key={idx} className="flex items-center justify-between text-xs bg-white dark:bg-slate-700 p-1.5 rounded border dark:border-slate-600 shadow-sm">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium truncate max-w-[120px]" title={comp.guestName}>{comp.guestName}</span>
                                                            <span className="text-slate-500 text-[10px]">{comp.relationship}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveCompanion(idx)}
                                                            className="text-red-400 hover:text-red-600"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Financial, Notes */}
                            <div className="space-y-4">
                                <SectionHeader title={t('bookings.financialInfo')} />
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="receiptVoucher" className={labelBaseClass}>{t('bookings.receiptVoucher')}</label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-grow">
                                                <SearchableSelect id="receiptVoucher" options={[]} value={formData.receiptVoucher || ''} onChange={(val) => setFormData(p => ({ ...p, receiptVoucher: val }))} placeholder="" />
                                            </div>
                                            <ActionButton icon={PlusIcon} color="bg-green-500" onClick={handleAddReceiptClick} />
                                            <ActionButton icon={PencilIcon} color="bg-blue-500" onClick={() => { }} disabled={!formData.receiptVoucher} />
                                            <ActionButton icon={EyeIcon} color="bg-blue-500" onClick={() => { }} disabled={!formData.receiptVoucher} />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="returnVouchers" className={labelBaseClass}>{t('bookings.returnVouchers')}</label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-grow">
                                                <SearchableSelect id="returnVouchers" options={[]} value={formData.returnVouchers || ''} onChange={(val) => setFormData(p => ({ ...p, returnVouchers: val }))} placeholder="" />
                                            </div>
                                            <ActionButton icon={PlusIcon} color="bg-green-500" onClick={() => alert(t('bookings.alerts.addingNewReturnVoucher'))} />
                                            <ActionButton icon={PencilIcon} color="bg-blue-500" onClick={() => alert(t('bookings.alerts.editingReturnVoucher', formData.returnVouchers))} disabled={!formData.returnVouchers} />
                                            <ActionButton icon={EyeIcon} color="bg-blue-500" onClick={() => alert(t('bookings.alerts.previewingReturnVoucher', formData.returnVouchers))} disabled={!formData.returnVouchers} />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="invoices" className={labelBaseClass}>{t('bookings.invoices')}</label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-grow">
                                                <SearchableSelect id="invoices" options={[]} value={formData.invoices || ''} onChange={(val) => setFormData(p => ({ ...p, invoices: val }))} placeholder="" />
                                            </div>
                                            <ActionButton icon={PlusIcon} color="bg-green-500" onClick={() => alert(t('bookings.alerts.addingNewInvoice'))} />
                                            <ActionButton icon={PencilIcon} color="bg-blue-500" onClick={() => alert(t('bookings.alerts.editingInvoice', formData.invoices))} disabled={!formData.invoices} />
                                            <ActionButton icon={EyeIcon} color="bg-blue-500" onClick={() => alert(t('bookings.alerts.previewingInvoice', formData.invoices))} disabled={!formData.invoices} />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="order" className={labelBaseClass}>{t('bookings.order')}</label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-grow">
                                                <SearchableSelect id="order" options={[]} value={formData.order || ''} onChange={(val) => setFormData(p => ({ ...p, order: val }))} placeholder="" />
                                            </div>
                                            <ActionButton icon={PlusIcon} color="bg-green-500" onClick={handleAddOrderClick} />
                                            <ActionButton icon={PencilIcon} color="bg-blue-500" onClick={() => { }} disabled={!formData.order} />
                                            <ActionButton icon={EyeIcon} color="bg-blue-500" onClick={() => { }} disabled={!formData.order} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="rent" className={labelBaseClass}>{t('bookings.rent')}</label>
                                            <div className="flex items-center gap-2"><input type="number" name="rent" value={formData.rent} onChange={handleNumberChange} className={inputBaseClass} /><EditButton label={t('bookings.edit')} /></div>
                                        </div>
                                        <div>
                                            <label htmlFor="discount" className={labelBaseClass}>{t('bookings.discount')}</label>
                                            <div className="flex items-center gap-2"><input type="number" name="discount" value={formData.discount} onChange={handleNumberChange} className={inputBaseClass} /><EditButton label={t('bookings.edit')} /></div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md space-y-2 text-sm">
                                        {calcLoading && <p className="text-blue-600 font-semibold text-xs">{t('bookings.calculating') ?? 'Calculating...'}</p>}
                                        {calcError && <p className="text-red-500 font-semibold text-xs">{calcError}</p>}
                                        {([
                                            { label: t('bookings.value'), value: formData.value.toFixed(2) },
                                            { label: t('bookings.subtotal'), value: formData.subtotal.toFixed(2) },
                                            { label: t('bookings.total'), value: formData.total.toFixed(2) },
                                            { label: t('bookings.totalOrders'), value: formData.totalOrders?.toFixed(2) },
                                        ]).map(item => (
                                            <div key={item.label} className="flex justify-between items-center">
                                                <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-100">{item.value}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-slate-600 dark:text-slate-300">{t('bookings.payments')}</span>
                                            <input type="number" name="payments" value={formData.payments} onChange={handleNumberChange} className={`${inputBaseClass} w-24 text-center font-bold`} />
                                        </div>
                                        <div className="flex justify-between items-center mt-2 pt-2 border-t dark:border-slate-600">
                                            <span className="font-bold text-slate-800 dark:text-slate-100">{t('bookings.balance')}</span>
                                            <span className="font-bold text-lg text-green-600 dark:text-green-400">{formData.balance.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <SectionHeader title={t('bookings.notes')} />
                                <textarea name="notes" rows={4} placeholder={t('bookings.notesPlaceholder')} value={formData.notes || ''} onChange={handleInputChange} className={inputBaseClass}></textarea>
                            </div>

                        </div>
                    </form>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-white/10 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-800 rounded-b-lg">
                    <button
                        onClick={handleSaveClick}
                        disabled={isSaving}
                        className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{isSaving ? t('bookings.saving') ?? 'Saving...' : t('bookings.saveBooking')}</span>
                    </button>
                    <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                        {t('bookings.cancel')}
                    </button>
                </footer>
            </div>

            {/* Sub-panels */}
            <UnitEditPanel
                unit={editingUnit}
                isOpen={isUnitPanelOpen}
                onClose={() => setIsUnitPanelOpen(false)}
                onSave={handleSaveUnit}
                isAdding={isAddingUnit}
                unitTypeOptions={unitTypeOptions}
                coolingTypeOptions={coolingTypeOptions}
                allApiFeatures={allApiFeatures}
            />

            <AddGuestPanel
                initialData={editingGuest}
                isEditing={!!editingGuest}
                isOpen={isGuestPanelOpen}
                onClose={() => setIsGuestPanelOpen(false)}
                onSave={handleSaveGuest}
                guestTypes={guestTypes}
                idTypes={idTypes}
                countries={countries}
                zIndexClass="z-[75]"
            />

            <GuestDetailsModal
                guest={viewingGuest}
                onClose={() => setViewingGuest(null)}
            />

            <AddReceiptPanel
                isOpen={isReceiptPanelOpen}
                onClose={() => setIsReceiptPanelOpen(false)}
                onSave={() => { setIsReceiptPanelOpen(false); /* Refresh logic if needed */ }}
                initialData={{ ...formData, bookingNumber: 'bookingNumber' in formData ? formData.bookingNumber : '' } as any} // Pass basic data
                isEditing={false}
                voucherType="receipt"
                user={null} // Pass user if available
            />

            {isOrderPanelOpen && (
                <AddOrderPanel
                    isOpen={isOrderPanelOpen}
                    onClose={() => setIsOrderPanelOpen(false)}
                    onSave={handleSaveOrder}
                    initialData={{
                        apartmentName: '',
                        bookingNumber: 'bookingNumber' in formData ? formData.bookingNumber : '',
                        orderNumber: '',
                        items: [],
                        notes: '',
                        value: 0,
                        subtotal: 0,
                        tax: 0,
                        total: 0,
                        discount: 0
                    }}
                    isEditing={false}
                />
            )}

            <AddCompanionModal
                isOpen={isCompanionModalOpen}
                onClose={() => setIsCompanionModalOpen(false)}
                onSave={handleSaveCompanion}
                guests={guests}
                onAddGuest={() => { setIsGuestPanelOpen(true); setEditingGuest(null); }}
                onEditGuest={handleEditCompanionGuest}
                relationships={relationships}
            />
        </div>
    );
};


export default AddBookingPanel;
