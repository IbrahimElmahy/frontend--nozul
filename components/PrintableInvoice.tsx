import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Invoice } from '../types';

interface PrintableInvoiceProps {
    invoice: Invoice;
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


const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ invoice }) => {
    const { t, language } = useContext(LanguageContext);

    const formatFullDate = (dateString: string) => new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
    
    const formatFullDateTime = (dateString: string) => new Date(dateString).toLocaleString(language === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    return (
        <div className="printable-invoice-container">
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
                        <h1 className="text-2xl font-bold uppercase mb-2">فاتورة ضريبية</h1>
                        <div className="grid grid-cols-2">
                             {/* FIX: Use correct property 'created_at' */}
                             <span className="font-bold">تاريخ الفاتورة :</span><span>{formatFullDate(invoice.created_at)}</span>
                             {/* FIX: Use correct property 'created_at' */}
                             <span className="font-bold">انشأت في :</span><span>{formatFullDateTime(invoice.created_at)}</span>
                             {/* FIX: Use correct property 'number' */}
                             <span className="font-bold">رقم الفاتورة :</span><span>{invoice.number}</span>
                        </div>
                    </div>
                </header>

                <main className="my-6 space-y-6">
                    {/* Booking and Tenant Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <InfoBlock title="معلومات الحجز">
                            {/* FIX: Use correct property 'reservation' */}
                            <DetailRow label="رقم الحجز">{invoice.reservation}</DetailRow>
                            <DetailRow label="حالة الحجز">تسجيل الدخول</DetailRow>
                            <DetailRow label="فترة الحجز">2025-10-08 - 2025-10-09</DetailRow>
                            <DetailRow label="رقم الوحدة">roomtest</DetailRow>
                        </InfoBlock>
                        <InfoBlock title="بيانات المستأجر">
                            <DetailRow label="الاسم">ahmed</DetailRow>
                            <DetailRow label="الجنسية">السعودية (المملكة العربية)</DetailRow>
                            <DetailRow label="نوع الهوية">جواز سفر</DetailRow>
                            <DetailRow label="رقم بطاقة الهوية">0999999</DetailRow>
                            <DetailRow label="رقم الجوال">+966567289000</DetailRow>
                            <DetailRow label="البريد الإلكتروني">1ms19cs333@gmail.com</DetailRow>
                        </InfoBlock>
                    </div>

                    {/* Address Info */}
                     <InfoBlock title="معلومات العنوان">
                        <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                           <DetailRow label="الدولة">السعودية (المملكة العربية)</DetailRow>
                           <DetailRow label="المدينة">الرياض</DetailRow>
                           <DetailRow label="الحيّ">حي السلام</DetailRow>
                           <DetailRow label="الرمز بريدي">13786</DetailRow>
                           <div className="col-span-3">
                              <DetailRow label="الشارع">عنيزة 7029 ,حي ضهرة لبن الرياض</DetailRow>
                           </div>
                        </div>
                    </InfoBlock>

                    {/* Line Items Table */}
                    <div>
                        <table className="w-full text-center border">
                            <thead className="bg-gray-100 font-bold">
                                <tr>
                                    <th className="p-2 border">#</th>
                                    <th className="p-2 border text-right">الخدمة</th>
                                    <th className="p-2 border">الكمية</th>
                                    <th className="p-2 border">السعر</th>
                                    <th className="p-2 border">المجموع</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="p-2 border">1</td>
                                    {/* FIX: Use correct property 'reservation' */}
                                    <td className="p-2 border text-right">الحجز ({invoice.reservation})</td>
                                    <td className="p-2 border">1</td>
                                    {/* FIX: Use correct property 'amount' */}
                                    <td className="p-2 border">{invoice.amount.toFixed(2)}</td>
                                    {/* FIX: Use correct property 'amount' */}
                                    <td className="p-2 border">{invoice.amount.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Financial Summary */}
                    <div className="flex justify-end">
                        <div className="w-full max-w-sm space-y-1">
                             {/* FIX: Use correct property 'amount' */}
                             <DetailRow label="القيمة">{invoice.amount.toFixed(2)}</DetailRow>
                             <DetailRow label="الخصم">{invoice.discount?.toFixed(2) ?? '0.00'}</DetailRow>
                             <DetailRow label="المجموع قبل الضريبة">1702.12</DetailRow>
                             <DetailRow label="ضريبة القمية المضافة">255.31</DetailRow>
                             <DetailRow label="مرافق الإيواء">42.55</DetailRow>
                             <DetailRow label="الضريبة">297.86</DetailRow>
                             <div className="border-t-2 my-1"></div>
                             <DetailRow label="المجموع شامل الضريبة">
                                <span className="text-lg font-bold">{invoice.total.toFixed(2)}</span>
                             </DetailRow>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default PrintableInvoice;