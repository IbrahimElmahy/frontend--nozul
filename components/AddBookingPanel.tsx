import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Booking, RentType } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import InformationCircleIcon from './icons-redesign/InformationCircleIcon';
import CalendarIcon from './icons-redesign/CalendarIcon';
import BuildingOfficeIcon from './icons-redesign/BuildingOfficeIcon';
import UserIcon from './icons-redesign/UserIcon';
import CreditCardIcon from './icons-redesign/CreditCardIcon';
import ChevronDownIcon from './icons-redesign/ChevronDownIcon';
import SearchableSelect from './SearchableSelect';


interface AddBookingPanelProps {
    // FIX: Update template prop type to include all necessary fields.
    template: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newBooking: Omit<Booking, 'id'>) => void;
}

const Section: React.FC<{ title: string; icon: React.ComponentType<{className?: string}>; children: React.ReactNode }> = ({ title, icon: Icon, children }) => {
    const { language } = useContext(LanguageContext);
    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border dark:border-slate-700">
            <h3 className={`flex items-center gap-2 text-md font-bold text-slate-700 dark:text-slate-200 mb-4 pb-3 border-b dark:border-slate-700 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Icon className="w-5 h-5"/>
                <span>{title}</span>
            </h3>
            {children}
        </div>
    );
};

interface FormFieldProps {
    label: string;
    id: string;
    children: React.ReactNode;
}
const FormField: React.FC<FormFieldProps> = ({ label, id, children }) => {
    const { language } = useContext(LanguageContext);
    const labelAlignClass = `block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`;
    return (
        <div>
            <label htmlFor={id} className={labelAlignClass}>{label}</label>
            {children}
        </div>
    );
};

const FinancialDisplay: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="text-center">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{typeof value === 'number' ? value.toFixed(2) : value}</p>
    </div>
);


const AddBookingPanel: React.FC<AddBookingPanelProps> = ({ template, isOpen, onClose, onSave }) => {
    const { t, language } = useContext(LanguageContext);
    const [formData, setFormData] = useState(template);

    const bookingSources = [
        t('bookings.booking_source_airbnb'),
        t('bookings.booking_source_booking'),
        t('bookings.booking_source_almosafer'),
        t('bookings.booking_source_agoda'),
        t('bookings.booking_source_websites'),
        t('bookings.booking_source_reception'),
    ];

    const rentTypeOptions = [
        { value: 'hourly', label: t('bookings.rent_hourly') },
        { value: 'daily', label: t('bookings.rent_daily') },
        { value: 'monthly', label: t('bookings.rent_monthly') },
    ];
    
    const bookingReasonOptions = [
        t('bookings.guest_type_health_employee'),
        t('bookings.guest_type_quarantine'),
        t('bookings.guest_type_court_employee'),
        t('bookings.guest_type_recreational'),
        t('bookings.guest_type_sports'),
        t('bookings.guest_type_family_visit'),
        t('bookings.guest_type_tourism'),
    ];

    const guestTypeOptions = [
        t('bookings.guest_type_clients'),
        t('bookings.guest_type_booking_agencies'),
    ];


    useEffect(() => {
        if (isOpen) {
            setFormData(JSON.parse(JSON.stringify(template)));
        }
    }, [isOpen, template]);
    
    useEffect(() => {
        // Recalculate financial details when relevant fields change
        const value = formData.value || 0;
        const discount = formData.discount || 0;
        const payments = formData.payments || 0;
        const totalOrders = formData.totalOrders || 0;

        const subtotal = value - discount;
        const total = subtotal + totalOrders;
        const balance = payments - total;

        setFormData(prev => ({ ...prev, subtotal, total, balance }));

    }, [formData.value, formData.discount, formData.payments, formData.totalOrders]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleBookingSourceChange = (value: string) => {
        setFormData(prev => ({ ...prev, bookingSource: value }));
    };

    const handleGuestTypeChange = (value: string) => {
        setFormData(prev => ({ ...prev, guestType: value }));
    };


    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleDateChange = (name: 'checkInDate' | 'checkOutDate', date: string) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    const handleSaveClick = () => {
        const now = new Date();
        const currentDate = now.toISOString();
        
        // FIX: Simplify final data creation as formData now has the correct shape.
        const finalBookingData: Omit<Booking, 'id'> = {
            ...formData,
            bookingNumber: `N-${Date.now().toString().slice(-6)}`,
            createdAt: currentDate,
            updatedAt: currentDate,
        };
        onSave(finalBookingData);
    };

    const inputBaseClass = `w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200`;
    const selectInputClass = `${inputBaseClass} appearance-none`;


    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-booking-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>

            <div className={`relative w-full max-w-5xl my-8 bg-white dark:bg-slate-900 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[90vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-900 rounded-t-lg z-10">
                    <h2 id="add-booking-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('bookings.addBookingTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto bg-slate-100/50 dark:bg-slate-800/50">
                    <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <FormField id="bookingSource" label={t('bookings.bookingSource')}>
                                <SearchableSelect
                                    id="bookingSource"
                                    options={bookingSources}
                                    value={formData.bookingSource || ''}
                                    onChange={handleBookingSourceChange}
                                    placeholder={t('bookings.selectBookingSource')}
                                />
                            </FormField>
                            
                            <Section title={t('bookings.calendarInfo')} icon={CalendarIcon}>
                                <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-md mb-4 text-center font-semibold">{t('bookings.rentCalendar')}</div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <FormField id="checkInDate" label={t('bookings.from')}>
                                        <DatePicker value={formData.checkInDate} onChange={(date) => handleDateChange('checkInDate', date)} />
                                    </FormField>
                                    <FormField id="checkOutDate" label={t('bookings.to')}>
                                        <DatePicker value={formData.checkOutDate} onChange={(date) => handleDateChange('checkOutDate', date)} />
                                    </FormField>
                                    <FormField id="rentType" label={t('bookings.rent')}>
                                        <SearchableSelect
                                            id="rentType"
                                            options={rentTypeOptions.map(o => o.label)}
                                            value={rentTypeOptions.find(o => o.value === formData.rentType)?.label || ''}
                                            onChange={(label) => {
                                                const selectedOption = rentTypeOptions.find(o => o.label === label);
                                                if (selectedOption) {
                                                    setFormData(prev => ({ ...prev, rentType: selectedOption.value as RentType }));
                                                }
                                            }}
                                            placeholder={t('bookings.selectRentType')}
                                        />
                                    </FormField>
                                    <FormField id="time" label={t('bookings.time')}>
                                        <input type="time" id="time" name="time" value={formData.time || ''} onChange={handleInputChange} className={inputBaseClass} />
                                    </FormField>
                                    <FormField id="duration" label={t('bookings.duration')}>
                                        <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleNumberChange} className={`${inputBaseClass} bg-slate-200 dark:bg-slate-700 cursor-not-allowed`} readOnly />
                                    </FormField>
                                </div>
                            </Section>

                            <Section title={t('bookings.apartmentInfo')} icon={BuildingOfficeIcon}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField id="unitName" label={t('bookings.apartments')}>
                                        <div className="relative">
                                            <select id="unitName" name="unitName" value={formData.unitName} onChange={handleInputChange} className={selectInputClass}></select>
                                            <ChevronDownIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'left-3' : 'right-3'} pointer-events-none`} />
                                        </div>
                                    </FormField>
                                    <FormField id="price" label={t('bookings.price')}>
                                        <input type="text" id="price" value="- - - - -" readOnly className={`${inputBaseClass} text-center bg-slate-200 dark:bg-slate-700 cursor-not-allowed`} />
                                    </FormField>
                                </div>
                            </Section>

                             <Section title={t('bookings.guestInfo')} icon={UserIcon}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField id="bookingReason" label={t('bookings.bookingReasons')}>
                                        <SearchableSelect
                                            id="bookingReason"
                                            options={bookingReasonOptions}
                                            value={formData.bookingReason || ''}
                                            onChange={(value) => setFormData(prev => ({ ...prev, bookingReason: value }))}
                                            placeholder={t('bookings.selectBookingReason')}
                                        />
                                    </FormField>
                                    <FormField id="guestType" label={t('bookings.guestType')}>
                                        <SearchableSelect
                                            id="guestType"
                                            options={guestTypeOptions}
                                            value={formData.guestType || ''}
                                            onChange={handleGuestTypeChange}
                                            placeholder={t('bookings.selectGuestType')}
                                        />
                                    </FormField>
                                    <FormField id="guestName" label={t('bookings.guest')}>
                                        <div className="relative">
                                            <select id="guestName" name="guestName" value={formData.guestName} onChange={handleInputChange} className={selectInputClass}></select>
                                            <ChevronDownIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'left-3' : 'right-3'} pointer-events-none`} />
                                        </div>
                                    </FormField>
                                    <FormField id="companions" label={t('bookings.companions')}><input type="number" name="companions" id="companions" value={formData.companions || 0} onChange={handleNumberChange} className={inputBaseClass} /></FormField>
                                </div>
                            </Section>

                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                             <Section title={t('bookings.financialInfo')} icon={CreditCardIcon}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <FormField id="receiptVoucher" label={t('bookings.receiptVoucher')}><input type="text" id="receiptVoucher" name="receiptVoucher" className={inputBaseClass}/></FormField>
                                    <FormField id="returnVouchers" label={t('bookings.returnVouchers')}><input type="text" id="returnVouchers" name="returnVouchers" className={inputBaseClass}/></FormField>
                                    <FormField id="invoices" label={t('bookings.invoices')}><input type="text" id="invoices" name="invoices" className={inputBaseClass}/></FormField>
                                    <FormField id="order" label={t('bookings.order')}><input type="text" id="order" name="order" className={inputBaseClass}/></FormField>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField id="rent" label={t('bookings.rent')}><input type="number" id="rent" name="rent" value={formData.rent} onChange={handleNumberChange} className={inputBaseClass} /></FormField>
                                    <FormField id="discountType" label={t('bookings.discountType')}>
                                         <div className="relative">
                                            <select id="discountType" name="discountType" value={formData.discountType || ''} onChange={handleInputChange} className={selectInputClass}></select>
                                            <ChevronDownIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'left-3' : 'right-3'} pointer-events-none`} />
                                        </div>
                                    </FormField>
                                    <FormField id="discount" label={t('bookings.discount')}><input type="number" id="discount" name="discount" value={formData.discount} onChange={handleNumberChange} className={inputBaseClass} /></FormField>
                                    <FormField id="value" label={t('bookings.value')}><input type="number" id="value" name="value" value={formData.value} onChange={handleNumberChange} className={inputBaseClass} /></FormField>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 mt-6 bg-slate-200 dark:bg-slate-700/50 rounded-lg">
                                    <FinancialDisplay label={t('bookings.subtotal')} value={formData.subtotal || 0} />
                                    <FinancialDisplay label={t('bookings.total')} value={formData.total || 0} />
                                    <FinancialDisplay label={t('bookings.totalOrders')} value={formData.totalOrders || 0} />
                                    <FormField id="payments" label={t('bookings.payments')}><input type="number" id="payments" name="payments" value={formData.payments} onChange={handleNumberChange} className={`${inputBaseClass} text-center`} /></FormField>
                                    <div className="col-span-full mt-2 pt-2 border-t dark:border-slate-600">
                                         <FinancialDisplay label={t('bookings.balance')} value={formData.balance || 0} />
                                    </div>
                                </div>
                            </Section>

                             <FormField id="notes" label={t('bookings.notes')}>
                                <textarea id="notes" name="notes" rows={5} placeholder={t('bookings.notesPlaceholder')} value={formData.notes || ''} onChange={handleInputChange} className={inputBaseClass}></textarea>
                            </FormField>
                        </div>
                    </form>
                </div>

                <footer className="flex items-center justify-end p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-900 rounded-b-lg">
                     <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                        {t('bookings.cancel')}
                    </button>
                    <button onClick={handleSaveClick} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{t('bookings.saveBooking')}</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddBookingPanel;
