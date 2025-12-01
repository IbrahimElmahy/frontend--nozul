import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Booking, Reservation } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PrinterIcon from './icons-redesign/PrinterIcon'; // Assuming this icon exists or I'll use a generic one
import { getReservation } from '../services/reservations';
import RentalContract from './RentalContract';

interface BookingDetailsModalProps {
    booking: Booking | null;
    onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-200">{value ?? '---'}</dd>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b dark:border-slate-700 last:border-b-0">
        <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-3">{title}</h3>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
            {children}
        </dl>
    </div>
);


const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, onClose }) => {
    const { t } = useContext(LanguageContext);
    const [fullReservation, setFullReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (booking?.id) {
            setLoading(true);
            getReservation(booking.id)
                .then(data => setFullReservation(data))
                .catch(err => console.error("Failed to fetch reservation details", err))
                .finally(() => setLoading(false));
        } else {
            setFullReservation(null);
        }
    }, [booking]);

    if (!booking) return null;

    const isOpen = !!booking;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto print:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-details-title"
            >
                <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>

                <div className={`relative w-full max-w-5xl my-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[90vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                        <h2 id="booking-details-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">
                            {t('bookings.details.title')} - #{booking.bookingNumber}
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrint}
                                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
                                title="Print Contract"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                </svg>
                                <span>{t('Print Contract')}</span>
                            </button>
                            <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </header>

                    <div className="flex-grow p-6 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                            <div>
                                <Section title={t('bookings.details.guestAndUnit')}>
                                    <DetailItem label={t('bookings.th_guestName')} value={booking.guestName} />
                                    <DetailItem label={t('bookings.th_unitName')} value={booking.unitName} />
                                </Section>

                                <Section title={t('bookings.details.datesAndDuration')}>
                                    <DetailItem label={t('bookings.th_checkInDate')} value={formatDate(booking.checkInDate)} />
                                    <DetailItem label={t('bookings.th_checkOutDate')} value={formatDate(booking.checkOutDate)} />
                                    <DetailItem label={t('bookings.th_time')} value={booking.time} />
                                    <DetailItem label={t('bookings.th_rentType')} value={booking.rentType} />
                                    <DetailItem label={t('bookings.th_duration')} value={`${booking.duration} ${booking.rentType === 'daily' ? 'Days' : booking.rentType === 'hourly' ? 'Hours' : 'Months'}`} />
                                </Section>
                            </div>
                            <div>
                                <Section title={t('bookings.details.financialSummary')}>
                                    <DetailItem label={t('bookings.th_total')} value={booking.total.toFixed(2)} />
                                    <DetailItem label={t('bookings.th_payments')} value={booking.payments.toFixed(2)} />
                                    <DetailItem label={t('bookings.th_balance')} value={booking.balance.toFixed(2)} />
                                </Section>

                                <Section title={t('bookings.details.financialBreakdown')}>
                                    <DetailItem label={t('bookings.th_rent')} value={booking.rent.toFixed(2)} />
                                    <DetailItem label={t('bookings.th_value')} value={booking.value.toFixed(2)} />
                                    <DetailItem label={t('bookings.th_discount')} value={booking.discount.toFixed(2)} />
                                    <DetailItem label={t('bookings.th_subtotal')} value={booking.subtotal.toFixed(2)} />
                                    <DetailItem label={t('bookings.th_tax')} value={booking.tax?.toFixed(2) ?? 'N/A'} />
                                </Section>
                            </div>
                        </div>

                        <Section title={t('bookings.details.timestamps')}>
                            <DetailItem label={t('bookings.th_createdAt')} value={new Date(booking.createdAt).toLocaleString()} />
                            <DetailItem label={t('bookings.th_updatedAt')} value={new Date(booking.updatedAt).toLocaleString()} />
                        </Section>
                    </div>
                </div>
            </div>
            {/* Print View */}
            {fullReservation && <RentalContract reservation={fullReservation} />}
        </>
    );
};

export default BookingDetailsModal;