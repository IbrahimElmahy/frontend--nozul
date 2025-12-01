
import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Order } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PrinterIcon from './icons-redesign/PrinterIcon';
import PrintableOrder from './PrintableOrder';

interface OrderDetailsModalProps {
    order: Order | null;
    onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | number | undefined | null }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-200">{value ?? '---'}</dd>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b dark:border-slate-700 last:border-b-0">
        <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-3">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
            {children}
        </div>
    </div>
);


const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
    const { t } = useContext(LanguageContext);

    if (!order) return null;

    const isOpen = !!order;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-details-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>

            <div className={`relative w-full max-w-4xl my-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 max-h-[90vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                    <h2 id="order-details-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {t('orders.detailsTitle')} - {order.orderNumber}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
                            title={t('receipts.print')}
                        >
                            <PrinterIcon className="w-5 h-5" />
                            <span>{t('receipts.print')}</span>
                        </button>
                        <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <Section title={t('bookings.bookingInfo')}>
                        <DetailItem label={t('orders.th_orderNumber')} value={order.orderNumber} />
                        <DetailItem label={t('orders.th_bookingNumber')} value={order.bookingNumber} />
                        <DetailItem label={t('orders.th_apartmentName')} value={order.apartmentName} />
                    </Section>

                    {order.items && order.items.length > 0 && (
                        <div className="py-4 border-b dark:border-slate-700 last:border-b-0">
                            <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-3">{t('orders.services')}</h3>
                            <div className="overflow-x-auto rounded-lg border dark:border-slate-700">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-700 text-xs uppercase">
                                        <tr>
                                            <th className="px-4 py-2">{t('orders.serviceHeader')}</th>
                                            <th className="px-4 py-2">{t('orders.categoryHeader')}</th>
                                            <th className="px-4 py-2 text-center">{t('orders.quantityHeader')}</th>
                                            <th className="px-4 py-2 text-right">{t('orders.priceHeader')}</th>
                                            <th className="px-4 py-2 text-right">{t('orders.totalHeader')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-slate-700">
                                        {order.items.map(item => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">{item.service}</td>
                                                <td className="px-4 py-2">{item.category}</td>
                                                <td className="px-4 py-2 text-center">{item.quantity}</td>
                                                <td className="px-4 py-2 text-right">{item.price.toFixed(2)}</td>
                                                <td className="px-4 py-2 text-right font-semibold">{(item.quantity * item.price).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <Section title={t('bookings.financialInfo')}>
                        <DetailItem label={t('orders.th_value')} value={order.value.toFixed(2)} />
                        <DetailItem label={t('orders.th_discount')} value={`${order.discount.toFixed(1)}%`} />
                        <DetailItem label={t('orders.th_subtotal')} value={order.subtotal.toFixed(2)} />
                        <DetailItem label={t('orders.th_tax')} value={order.tax.toFixed(2)} />
                        <DetailItem label={t('orders.th_total')} value={order.total.toFixed(2)} />
                    </Section>

                    {order.notes && (
                        <div className="py-4 border-b dark:border-slate-700 last:border-b-0">
                            <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-3">{t('orders.notes')}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{order.notes}</p>
                        </div>
                    )}

                    <Section title={t('bookings.details.timestamps')}>
                        <DetailItem label={t('orders.th_createdAt')} value={new Date(order.createdAt).toLocaleString()} />
                        <DetailItem label={t('orders.th_updatedAt')} value={new Date(order.updatedAt).toLocaleString()} />
                    </Section>
                </div>
            </div>
            {order && <PrintableOrder order={order} />}
        </div>
    );
};

export default OrderDetailsModal;
