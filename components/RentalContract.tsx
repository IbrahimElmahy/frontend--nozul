import React from 'react';
import { Reservation, Guest, Apartment } from '../types';

interface RentalContractProps {
    reservation: Reservation;
    guest?: Guest;
    apartment?: Apartment;
}

const RentalContract: React.FC<RentalContractProps> = ({ reservation, guest, apartment }) => {
    // Helper to safely access nested properties if they exist in reservation or passed props
    const guestData = (typeof reservation.guest === 'object' ? reservation.guest : guest) as any;
    const apartmentData = (typeof reservation.apartment === 'object' ? reservation.apartment : apartment) as any;

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="printable-invoice-container hidden print:block p-8 font-sans text-right" dir="rtl">
            <h1 className="text-2xl font-bold text-center mb-8">عقد ألإيجار</h1>

            {/* Contract Data */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">بيانات العقد</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="font-bold ml-2">رقم العقد:</span>
                        <span>{reservation.number}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">حالة العقد:</span>
                        <span>{reservation.status}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">تاريخ بدء العقد:</span>
                        <span>{formatDate(reservation.check_in_date)}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">تاريخ انتهاء العقد:</span>
                        <span>{formatDate(reservation.check_out_date)}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">مكان إبرام العقد:</span>
                        <span>الرياض</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">تاريخ إبرام العقد:</span>
                        <span>{formatDate(reservation.created_at)}</span>
                    </div>
                </div>
            </div>

            {/* Tenant Data */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">بيانات المستأجر</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="font-bold ml-2">الاسم:</span>
                        <span>{guestData?.name || '---'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">الجنسية:</span>
                        <span>{guestData?.country_display || '---'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">نوع الهوية:</span>
                        <span>{guestData?.ids || '---'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">رقم بطاقة الهوية:</span>
                        <span>{guestData?.id_number || '---'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">نسخة الهوية:</span>
                        <span>{guestData?.id_number ? 'مرفق' : '---'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">تاريخ الميلاد:</span>
                        <span>{guestData?.birthdate || '---'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">جهة العمل:</span>
                        <span>{guestData?.work_place || 'None'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">الوظيفية:</span>
                        <span>{guestData?.job || '---'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">رقم الجوال:</span>
                        <span>{guestData?.phone_number || '---'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">البريد الإلكتروني:</span>
                        <span>{guestData?.email || '---'}</span>
                    </div>
                </div>
            </div>

            {/* Landlord Data */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">بيانات المؤجر</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="font-bold ml-2">إسم الفندق:</span>
                        <span>demo</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">عنوان الفندق:</span>
                        <span>الشارع رقم واحد - حي الجامعة - الرياض - السعودية (المملكة العربية)</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">رقم السجل التجاري:</span>
                        <span>8545665</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">الرقم الضريبي:</span>
                        <span>212343</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">رقم الجوال:</span>
                        <span>+967733997110</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">البريد الإلكتروني:</span>
                        <span>demo11@gmail.com</span>
                    </div>
                </div>
            </div>

            {/* Unit Data */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">بيانات الوحدة العقارية</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="font-bold ml-2">نوع الوحدة:</span>
                        <span>{apartmentData?.apartment_type || '---'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">رقم الوحدة:</span>
                        <span>{apartmentData?.name || '---'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">الطابق:</span>
                        <span>{apartmentData?.floor || '---'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">عدد الغرف:</span>
                        <span>{apartmentData?.rooms || '1'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">عدد ألأسرة:</span>
                        <span>{apartmentData?.beds || '1'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">عدد الأسرة المزدوجة:</span>
                        <span>{apartmentData?.double_beds || '0'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">عدد دورات المياه:</span>
                        <span>{apartmentData?.bathrooms || '1'}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">نوع التكييف:</span>
                        <span>{apartmentData?.cooling_type || 'مكيف سبليت'}</span>
                    </div>
                </div>
            </div>

            {/* Financial Info */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">المعلومات المالية</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="font-bold ml-2">قيمة الحجز:</span>
                        <span>{Number(reservation.rent || 0).toFixed(1)}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">قيمة الخصم:</span>
                        <span>{Number(reservation.discount_value || 0).toFixed(1)}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">قيمة الضريبة:</span>
                        <span>{Number(reservation.tax || 0).toFixed(1)}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">إجمالي الطلبات:</span>
                        <span>{Number(reservation.total_orders || 0).toFixed(1)}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">إجمالي الحجز:</span>
                        <span>{Number(reservation.total || 0).toFixed(1)}</span>
                    </div>
                    <div>
                        <span className="font-bold ml-2">إجمالي العقد:</span>
                        <span>{Number(reservation.total || 0).toFixed(1)}</span>
                    </div>
                </div>
            </div>

            {/* Obligations */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">التزامات ألأطراف</h2>
                <h3 className="font-bold mb-2">شروط فندق</h3>
                <ul className="list-disc list-inside">
                    <li>١ شرط الاول</li>
                    <li>2 شرط الثاني</li>
                </ul>
            </div>
        </div>
    );
};

export default RentalContract;
