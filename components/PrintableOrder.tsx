import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Order } from '../types';

interface PrintableOrderProps {
    order: Order;
}

const InfoBlock: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={className}>
        <h3 className="text-sm font-bold text-gray-500 border-b-2 border-gray-300 pb-1 mb-2">{title}</h3>
        {children}
    </div>
);

const DetailRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex justify-between items-start py-1">
        <p className="text-sm text-gray-600">{label}:</p>
        <p className="text-sm font-semibold text-gray-800 text-right">{children}</p>
    </div>
);


const PrintableOrder: React.FC<PrintableOrderProps> = ({ order }) => {
    const { t, language } = useContext(LanguageContext);

    const formatFullDate = (dateString: string) => new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const formatFullDateTime = (dateString: string) => new Date(dateString).toLocaleString(language === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    return (
        <div className="printable-invoice-container hidden print:block">
            <div className="p-6 bg-white text-gray-800 font-sans text-xs" dir={language === 'ar' ? 'rtl' : 'ltr'}>

                {/* Header */}
                <header className="grid grid-cols-2 gap-4 pb-4 border-b-2 border-gray-800">
                    <div>
                        <h2 className="text-lg font-bold">demo : إسم الفندق</h2>
                        <p>رقم السجل التجاري : 3434534</p>
                        <p>الرقم الضريبي : 212343</p>
                        <p>العنوان : الشارع رقم واحد - حي الجامعة - الرياض</p>
                    </div>
                    <div className="text-left">
                        <h1 className="text-2xl font-bold uppercase mb-2">فاتورة طلب</h1>
                        <div className="grid grid-cols-2">
                            <span className="font-bold">تاريخ الطلب :</span><span>{formatFullDate(order.createdAt)}</span>
                            <span className="font-bold">انشأت في :</span><span>{formatFullDateTime(order.createdAt)}</span>
                            <span className="font-bold">رقم الطلب :</span><span>{order.orderNumber}</span>
                        </div>
                    </div>
                </header>

                <main className="my-6 space-y-6">
                    {/* Booking and Tenant Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <InfoBlock title="معلومات الحجز">
                            <DetailRow label="رقم الحجز">{order.bookingNumber}</DetailRow>
                            <DetailRow label="اسم الشقة">{order.apartmentName}</DetailRow>
                        </InfoBlock>
                    </div>

                    {/* Line Items Table */}
                    <div>
                        <table className="w-full text-center border">
                            <thead className="bg-gray-100 font-bold">
                                <tr>
                                    <th className="p-2 border">#</th>
                                    <th className="p-2 border text-right">الخدمة</th>
                                    <th className="p-2 border text-right">الصنف</th>
                                    <th className="p-2 border">الكمية</th>
                                    <th className="p-2 border">السعر</th>
                                    <th className="p-2 border">المجموع</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items && order.items.map((item, index) => (
                                    <tr key={item.id || index} className="border-b">
                                        <td className="p-2 border">{index + 1}</td>
                                        <td className="p-2 border text-right">{item.service}</td>
                                        <td className="p-2 border text-right">{item.category}</td>
                                        <td className="p-2 border">{item.quantity}</td>
                                        <td className="p-2 border">{item.price.toFixed(2)}</td>
                                        <td className="p-2 border">{(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Financial Summary */}
                    <div className="flex justify-end">
                        <div className="w-full max-w-sm space-y-1">
                            <DetailRow label="القيمة">{order.value.toFixed(2)}</DetailRow>
                            <DetailRow label="الخصم">{order.discount.toFixed(2)}</DetailRow>
                            <DetailRow label="المجموع الفرعي">{order.subtotal.toFixed(2)}</DetailRow>
                            <DetailRow label="الضريبة">{order.tax.toFixed(2)}</DetailRow>
                            <div className="border-t-2 my-1"></div>
                            <DetailRow label="المجموع شامل الضريبة">
                                <span className="text-lg font-bold">{order.total.toFixed(2)}</span>
                            </DetailRow>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="mt-4 border-t pt-4">
                            <h3 className="font-bold mb-2">ملاحظات:</h3>
                            <p>{order.notes}</p>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default PrintableOrder;
