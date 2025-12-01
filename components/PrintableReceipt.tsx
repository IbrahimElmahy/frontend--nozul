import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Receipt } from '../types';

interface PrintableReceiptProps {
    receipt: Receipt;
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

const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ receipt }) => {
    const { t, language } = useContext(LanguageContext);
    const isPayment = receipt.paymentType === 'payment';

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
                        <h1 className="text-2xl font-bold uppercase mb-2">{isPayment ? 'سند صرف' : 'سند قبض'}</h1>
                        <div className="grid grid-cols-2">
                            <span className="font-bold">التاريخ :</span><span>{formatFullDate(receipt.date)}</span>
                            <span className="font-bold">الوقت :</span><span>{receipt.time}</span>
                            <span className="font-bold">رقم السند :</span><span>{receipt.receiptNumber}</span>
                        </div>
                    </div>
                </header>

                <main className="my-6 space-y-6">
                    <div className="border p-4 rounded">
                        <DetailRow label="المبلغ">{receipt.value.toFixed(2)} {receipt.currency}</DetailRow>
                        <DetailRow label="طريقة الدفع">{receipt.paymentMethod}</DetailRow>
                        {receipt.bookingNumber && <DetailRow label="رقم الحجز">{receipt.bookingNumber}</DetailRow>}
                        <DetailRow label="الوصف">{receipt.description || '-'}</DetailRow>
                    </div>

                    <div className="mt-8">
                        <p className="text-center font-bold">التوقيع</p>
                        <div className="h-16 border-b border-gray-300 w-1/3 mx-auto mt-4"></div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PrintableReceipt;
