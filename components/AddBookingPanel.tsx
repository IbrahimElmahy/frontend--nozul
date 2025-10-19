import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Booking, RentType } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import DatePicker from './DatePicker';
import SearchableSelect from './SearchableSelect';
import PlusIcon from './icons-redesign/PlusIcon';
import PencilIcon from './icons-redesign/PencilIcon';
import MinusIcon from './icons-redesign/MinusIcon';
import EyeIcon from './icons-redesign/EyeIcon';


interface AddBookingPanelProps {
    template: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newBooking: Omit<Booking, 'id'>) => void;
}

const SectionHeader: React.FC<{ title: string; }> = ({ title }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-2 my-4 rounded-md flex items-center">
        <div className="w-1 h-4 bg-blue-500 rounded-full mx-2"></div>
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</h3>
    </div>
);


const ActionButton: React.FC<{ icon: React.ComponentType<{className?: string}>, color: string, onClick?: () => void }> = ({ icon: Icon, color, onClick }) => (
    <button type="button" onClick={onClick} className={`w-7 h-7 flex items-center justify-center rounded ${color} text-white hover:opacity-90 transition-opacity`}>
        <Icon className="w-4 h-4" />
    </button>
);

const EditButton: React.FC<{ label: string, onClick?: () => void }> = ({ label, onClick }) => (
    <button type="button" onClick={onClick} className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded hover:bg-red-600 transition-colors">
        {label}
    </button>
);


const AddBookingPanel: React.FC<AddBookingPanelProps> = ({ template, isOpen, onClose, onSave }) => {
    const { t, language } = useContext(LanguageContext);
    const [formData, setFormData] = useState(template);

    useEffect(() => {
        if (isOpen) {
            setFormData(JSON.parse(JSON.stringify(template)));
        }
    }, [isOpen, template]);
    
    useEffect(() => {
        const value = formData.rent || 0;
        const discount = formData.discount || 0;
        const payments = formData.payments || 0;
        const totalOrders = formData.totalOrders || 0;

        const subtotal = value - discount;
        const total = subtotal + totalOrders;
        const balance = payments - total;

        setFormData(prev => ({ ...prev, value, subtotal, total, balance }));

    }, [formData.rent, formData.discount, formData.payments, formData.totalOrders]);


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

    const handleSaveClick = () => {
        const now = new Date();
        const currentDate = now.toISOString();
        const finalBookingData: Omit<Booking, 'id'> = {
            ...formData,
            bookingNumber: `N-${Date.now().toString().slice(-6)}`,
            createdAt: currentDate,
            updatedAt: currentDate,
        };
        onSave(finalBookingData);
    };

    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;
    const labelBaseClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`;
    
    const bookingSources = [t('bookings.booking_source_airbnb'), t('bookings.booking_source_booking'), t('bookings.booking_source_almosafer'), t('bookings.booking_source_agoda'), t('bookings.booking_source_websites'), t('bookings.booking_source_reception')];
    const rentTypeOptions = [{ value: 'hourly', label: t('bookings.rent_hourly') }, { value: 'daily', label: t('bookings.rent_daily') }, { value: 'monthly', label: t('bookings.rent_monthly') }];
    const bookingReasonOptions = [t('bookings.guest_type_health_employee'), t('bookings.guest_type_quarantine'), t('bookings.guest_type_court_employee'), t('bookings.guest_type_recreational'), t('bookings.guest_type_sports'), t('bookings.guest_type_family_visit'), t('bookings.guest_type_tourism')];
    const guestTypeOptions = [t('bookings.guest_type_clients'), t('bookings.guest_type_booking_agencies')];


    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-booking-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>

            <div className={`relative w-full max-w-7xl my-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[90vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                    <h2 id="add-booking-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('bookings.addBookingTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                            {/* Column 1 */}
                            <div>
                                <SectionHeader title={t('bookings.bookingInfo')} />
                                <div>
                                    <label className={labelBaseClass}>{t('bookings.bookingNumber')}</label>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm h-10 flex items-center">----------</p>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="bookingSource" className={labelBaseClass}>{t('bookings.bookingSource')}</label>
                                    <SearchableSelect id="bookingSource" options={bookingSources} value={formData.bookingSource || ''} onChange={(val) => setFormData(p => ({...p, bookingSource: val}))} placeholder={t('bookings.selectBookingSource')} />
                                </div>

                                <SectionHeader title={t('bookings.calendarInfo')} />
                                <div>
                                    <label htmlFor="rentType" className={labelBaseClass}>{t('bookings.rent')}</label>
                                    <SearchableSelect id="rentType" options={rentTypeOptions.map(o=>o.label)} value={rentTypeOptions.find(o => o.value === formData.rentType)?.label || ''} onChange={(label) => { const opt = rentTypeOptions.find(o=>o.label===label); if(opt) setFormData(p=>({...p, rentType: opt.value as RentType})); }} placeholder={t('bookings.selectRentType')} />
                                </div>
                                <div className="mt-4">
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
                                <div className="mt-4">
                                    <label htmlFor="duration" className={labelBaseClass}>{t('bookings.duration')}</label>
                                    <input type="number" name="duration" value={formData.duration} onChange={handleNumberChange} className={`${inputBaseClass} bg-slate-100 dark:bg-slate-700`} readOnly />
                                </div>
                            </div>
                            
                            {/* Column 2 */}
                            <div>
                                <SectionHeader title={t('bookings.apartmentInfo')} />
                                <div>
                                    <label htmlFor="unitName" className={labelBaseClass}>{t('bookings.apartments')}</label>
                                    <div className="flex items-center gap-2">
                                        <SearchableSelect id="unitName" options={['101', '102', '103']} value={formData.unitName} onChange={(val) => setFormData(p=>({...p, unitName: val}))} placeholder="Select Apartment" />
                                        <ActionButton icon={PlusIcon} color="bg-blue-500" />
                                        <ActionButton icon={PencilIcon} color="bg-yellow-400" />
                                        <ActionButton icon={PlusIcon} color="bg-green-500" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className={labelBaseClass}>{t('bookings.price')}</label>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm h-10 flex items-center">----------</p>
                                </div>

                                <SectionHeader title={t('bookings.guestInfo')} />
                                <div>
                                    <label htmlFor="bookingReason" className={labelBaseClass}>{t('bookings.bookingReasons')}</label>
                                    <SearchableSelect id="bookingReason" options={bookingReasonOptions} value={formData.bookingReason || ''} onChange={(val) => setFormData(p=>({...p, bookingReason: val}))} placeholder={t('bookings.selectBookingReason')} />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="guestType" className={labelBaseClass}>{t('bookings.guestType')}</label>
                                    <SearchableSelect id="guestType" options={guestTypeOptions} value={formData.guestType || ''} onChange={(val) => setFormData(p=>({...p, guestType: val}))} placeholder={t('bookings.selectGuestType')} />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="guestName" className={labelBaseClass}>{t('bookings.guest')}</label>
                                    <div className="flex items-center gap-2">
                                        <SearchableSelect id="guestName" options={['حملة محمد', 'محمد سالم']} value={formData.guestName} onChange={(val) => setFormData(p=>({...p, guestName: val}))} placeholder="Select Guest" />
                                        <ActionButton icon={PlusIcon} color="bg-blue-500" />
                                        <ActionButton icon={PencilIcon} color="bg-yellow-400" />
                                        <ActionButton icon={PlusIcon} color="bg-green-500" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="companions" className={labelBaseClass}>{t('bookings.companions')}</label>
                                    <div className="flex items-center gap-2">
                                        <SearchableSelect id="companions" options={['1', '2', '3']} value={(formData.companions || 0).toString()} onChange={(val) => setFormData(p=>({...p, companions: parseInt(val, 10)}))} placeholder="0" />
                                        <ActionButton icon={MinusIcon} color="bg-red-500" />
                                        <ActionButton icon={PlusIcon} color="bg-blue-500" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Column 3 */}
                            <div>
                                <SectionHeader title={t('bookings.financialInfo')} />
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="receiptVoucher" className={labelBaseClass}>{t('bookings.receiptVoucher')}</label>
                                        <div className="flex items-center gap-2">
                                            <SearchableSelect id="receiptVoucher" options={[]} value={formData.receiptVoucher || ''} onChange={(val) => setFormData(p=>({...p, receiptVoucher: val}))} placeholder="" />
                                            <ActionButton icon={PlusIcon} color="bg-green-500" />
                                            <ActionButton icon={PencilIcon} color="bg-blue-500" />
                                            <ActionButton icon={EyeIcon} color="bg-blue-500" />
                                        </div>
                                    </div>
                                     <div>
                                        <label htmlFor="returnVouchers" className={labelBaseClass}>{t('bookings.returnVouchers')}</label>
                                        <div className="flex items-center gap-2">
                                            <SearchableSelect id="returnVouchers" options={[]} value={formData.returnVouchers || ''} onChange={(val) => setFormData(p=>({...p, returnVouchers: val}))} placeholder="" />
                                            <ActionButton icon={PlusIcon} color="bg-green-500" />
                                            <ActionButton icon={PencilIcon} color="bg-blue-500" />
                                            <ActionButton icon={EyeIcon} color="bg-blue-500" />
                                        </div>
                                    </div>
                                     <div>
                                        <label htmlFor="invoices" className={labelBaseClass}>{t('bookings.invoices')}</label>
                                        <div className="flex items-center gap-2">
                                            <SearchableSelect id="invoices" options={[]} value={formData.invoices || ''} onChange={(val) => setFormData(p=>({...p, invoices: val}))} placeholder="" />
                                            <ActionButton icon={PlusIcon} color="bg-green-500" />
                                            <ActionButton icon={PencilIcon} color="bg-blue-500" />
                                            <ActionButton icon={EyeIcon} color="bg-blue-500" />
                                        </div>
                                    </div>
                                     <div>
                                        <label htmlFor="order" className={labelBaseClass}>{t('bookings.order')}</label>
                                        <div className="flex items-center gap-2">
                                            <SearchableSelect id="order" options={[]} value={formData.order || ''} onChange={(val) => setFormData(p=>({...p, order: val}))} placeholder="" />
                                            <ActionButton icon={PlusIcon} color="bg-green-500" />
                                            <ActionButton icon={PencilIcon} color="bg-blue-500" />
                                            <ActionButton icon={EyeIcon} color="bg-blue-500" />
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
                                        {([
                                            {label: t('bookings.value'), value: formData.value.toFixed(2)},
                                            {label: t('bookings.subtotal'), value: formData.subtotal.toFixed(2)},
                                            {label: t('bookings.total'), value: formData.total.toFixed(2)},
                                            {label: t('bookings.totalOrders'), value: formData.totalOrders?.toFixed(2)},
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

                <footer className="flex items-center justify-start p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-800 rounded-b-lg">
                    <button onClick={handleSaveClick} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{t('bookings.saveBooking')}</span>
                    </button>
                     <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                        {t('bookings.cancel')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddBookingPanel;