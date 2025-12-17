import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Booking, RentType } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import SearchableSelect from './SearchableSelect';
import Checkbox from './Checkbox';

interface AddGroupBookingPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newBookings: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>[]) => void;
}

const mockAvailableUnits = ['101', '102', '103', '104', '105', '201', '202', '203', '301', '302'];
const mockGuests = ['حملة محمد', 'محمد سالم', 'فيصل الجهني', 'محمد احمد', 'راشد عمر'];


const SectionHeader: React.FC<{ title: string; }> = ({ title }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-2 my-4 rounded-md flex items-center">
        <div className="w-1 h-4 bg-blue-500 rounded-full mx-2"></div>
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</h3>
    </div>
);

const AddGroupBookingPanel: React.FC<AddGroupBookingPanelProps> = ({ isOpen, onClose, onSave }) => {
    const { t } = useContext(LanguageContext);

    const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
    const [commonData, setCommonData] = useState({
        guestName: '',
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        rentType: 'daily' as RentType,
        bookingSource: '',
        rent: 150, // Default rent per unit
    });

    useEffect(() => {
        if (isOpen) {
            // Reset state when panel opens
            setSelectedUnits([]);
            setCommonData({
                guestName: '',
                checkInDate: new Date().toISOString().split('T')[0],
                checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                rentType: 'daily' as RentType,
                bookingSource: '',
                rent: 150,
            });
        }
    }, [isOpen]);

    const handleUnitToggle = (unitNumber: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedUnits(prev => [...prev, unitNumber]);
        } else {
            setSelectedUnits(prev => prev.filter(u => u !== unitNumber));
        }
    };

    const handleGenerateBookings = () => {
        if (selectedUnits.length === 0 || !commonData.guestName) {
            // Basic validation
            alert('Please select at least one unit and a guest.');
            return;
        }

        const newBookings: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>[] = selectedUnits.map(unitName => {
            const rent = commonData.rent;
            // Simplified financial calculation for group booking
            const subtotal = rent;
            const total = subtotal; // Assuming no tax/orders for simplicity
            const balance = 0 - total;

            return {
                guestName: commonData.guestName,
                unitName: unitName,
                checkInDate: commonData.checkInDate,
                checkOutDate: commonData.checkOutDate,
                time: new Date().toTimeString().slice(0, 5),
                status: 'check-in',
                rentType: commonData.rentType,
                duration: 1, // Simplified duration
                rent: rent,
                value: rent,
                discount: 0,
                subtotal,
                total,
                payments: 0,
                balance,
                bookingSource: commonData.bookingSource,
                bookingReason: '',
                guestType: '',
                companions: 0,
            };
        });

        onSave(newBookings);
    };

    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;
    const labelBaseClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1`;
    const bookingSources = [t('bookings.booking_source_airbnb'), t('bookings.booking_source_booking'), t('bookings.booking_source_almosafer'), t('bookings.booking_source_agoda'), t('bookings.booking_source_websites'), t('bookings.booking_source_reception')];
    const rentTypeOptions = [{ value: 'hourly', label: t('bookings.rent_hourly') }, { value: 'daily', label: t('bookings.rent_daily') }, { value: 'monthly', label: t('bookings.rent_monthly') }];

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-group-booking-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>

            <div className={`relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[calc(100vh-2rem)] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-white/10 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                    <h2 id="add-group-booking-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('bookings.addGroupBookingPanel.title')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        {/* Column 1: Apartment Selection */}
                        <div>
                            <SectionHeader title={t('bookings.addGroupBookingPanel.apartmentsInfo')} />
                            <div className="p-3 border dark:border-slate-600 rounded-md max-h-96 overflow-y-auto">
                                <label className={labelBaseClass}>{t('bookings.addGroupBookingPanel.selectApartments')}</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                                    {mockAvailableUnits.map(unit => (
                                        <Checkbox
                                            key={unit}
                                            id={`unit-${unit}`}
                                            label={unit}
                                            checked={selectedUnits.includes(unit)}
                                            onChange={(checked) => handleUnitToggle(unit, checked)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                {t('units.showing')}: {selectedUnits.length}
                            </p>
                        </div>

                        {/* Column 2: Common Info */}
                        <div className="space-y-4">
                            <SectionHeader title={t('bookings.addGroupBookingPanel.guestInfo')} />
                            <div>
                                <label htmlFor="commonGuestName" className={labelBaseClass}>{t('bookings.addGroupBookingPanel.commonGuest')}</label>
                                <SearchableSelect id="commonGuestName" options={mockGuests} value={commonData.guestName} onChange={(val) => setCommonData(p => ({ ...p, guestName: val }))} placeholder={t('bookings.addGroupBookingPanel.selectGuest')} />
                            </div>

                            <SectionHeader title={t('bookings.addGroupBookingPanel.bookingInfo')} />
                            <div>
                                <label className={labelBaseClass}>{t('bookings.rentCalendar')}</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-xs text-slate-500">{t('bookings.from')}</span>
                                        <DatePicker value={commonData.checkInDate} onChange={(date) => setCommonData(p => ({ ...p, checkInDate: date }))} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500">{t('bookings.to')}</span>
                                        <DatePicker value={commonData.checkOutDate} onChange={(date) => setCommonData(p => ({ ...p, checkOutDate: date }))} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="bookingSource" className={labelBaseClass}>{t('bookings.bookingSource')}</label>
                                <SearchableSelect id="bookingSource" options={bookingSources} value={commonData.bookingSource} onChange={(val) => setCommonData(p => ({ ...p, bookingSource: val }))} placeholder={t('bookings.selectBookingSource')} />
                            </div>
                            <div>
                                <label htmlFor="rent" className={labelBaseClass}>{t('bookings.rent')} (per unit)</label>
                                <input type="number" name="rent" value={commonData.rent} onChange={(e) => setCommonData(p => ({ ...p, rent: parseFloat(e.target.value) || 0 }))} className={inputBaseClass} />
                            </div>
                        </div>
                    </form>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-white/10 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-800 rounded-b-lg">
                    <button onClick={handleGenerateBookings} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{t('bookings.addGroupBookingPanel.generateBookings')} ({selectedUnits.length})</span>
                    </button>
                    <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                        {t('bookings.cancel')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddGroupBookingPanel;