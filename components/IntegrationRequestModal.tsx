import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PaperAirplaneIcon from './icons-redesign/PaperAirplaneIcon';
import PhoneNumberInput from './PhoneNumberInput';


interface IntegrationRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotelData?: {
        name: string;
        email: string;
        phone: string;
    };
    initialSystemType?: string;
}

const IntegrationRequestModal: React.FC<IntegrationRequestModalProps> = ({
    isOpen,
    onClose,
    hotelData,
    initialSystemType = ''
}) => {
    const { t, language } = useContext(LanguageContext);
    const isRTL = language === 'ar' || language === 'ur';

    const translations = {
        ar: {
            modalTitle: 'طلب الربط مع الأنظمة الموجودة',
            description: 'يرجى ملء النموذج أدناه لطلب الربط مع الأنظمة الموجودة. سيتم إرسال طلبك عبر البريد الإلكتروني.',
            hotelName: 'اسم الفندق',
            contactPerson: 'الشخص المسؤول',
            phoneNumber: 'رقم الهاتف',
            email: 'البريد الإلكتروني',
            systemType: 'نوع النظام المطلوب',
            selectSystemType: 'اختر نوع النظام',
            notes: 'ملاحظات إضافية',
            notesPlaceholder: 'اكتب ملاحظاتك أو متطلباتك الخاصة هنا...',
            submit: 'إرسال الطلب',
            cancel: 'إلغاء',
            requiredField: 'هذا الحقل مطلوب',
            invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
            systems: {
                wafiq: 'وافق',
                shomoos: 'شموس',
                ntm: 'الرصد السياحي'
            },
            dynamicFields: {
                apiKey: 'مفتاح الربط (API Key)',
                branchCode: 'كود الفرع',
                branchPassword: 'الرقم السري للفرع',
                username: 'اسم المستخدم',
                password: 'كلمة المرور',
                connectionKey: 'مفتاح الربط',

            }
        },
        ur: {
            modalTitle: 'سسٹم انضمام کی درخواست',
            description: 'موجودہ سسٹمز کے ساتھ انضمام کی درخواست کرنے کے لیے براہ کرم نیچے دیا گیا فارم پُر کریں۔ آپ کی درخواست ای میل کے ذریعے بھیجی جائے گی۔',
            hotelName: 'ہوٹل کا نام',
            contactPerson: 'رابطہ شخص',
            phoneNumber: 'فون نمبر',
            email: 'ای میل پتہ',
            systemType: 'سسٹم کی قسم',
            selectSystemType: 'سسٹم کی قسم منتخب کریں',
            notes: 'اضافی نوٹس',
            notesPlaceholder: 'اپنے نوٹس یا خصوصی ضروریات یہاں لکھیں...',
            submit: 'درخواست جمع کرائیں',
            cancel: 'منسوخ کریں',
            requiredField: 'یہ خانہ پُر کرنا ضروری ہے',
            invalidEmail: 'براہ کرم درست ای میل درج کریں',
            systems: {
                wafiq: 'وافق',
                shomoos: 'شموس',
                ntm: 'ٹورازم مانیٹرنگ'
            },
            dynamicFields: {
                apiKey: 'API کلید',
                branchCode: 'برانچ کوڈ',
                branchPassword: 'برانچ پاس ورڈ',
                username: 'صارف نام',
                password: 'پاس ورڈ',
                connectionKey: 'کنکشن کلید',

            }
        },
        en: {
            modalTitle: 'System Integration Request',
            description: 'Please fill out the form below to request integration with existing systems. Your request will be sent via email.',
            hotelName: 'Hotel Name',
            contactPerson: 'Contact Person',
            phoneNumber: 'Phone Number',
            email: 'Email Address',
            systemType: 'System Type',
            selectSystemType: 'Select System Type',
            notes: 'Additional Notes',
            notesPlaceholder: 'Write your notes or special requirements here...',
            submit: 'Submit Request',
            cancel: 'Cancel',
            requiredField: 'This field is required',
            invalidEmail: 'Please enter a valid email',
            systems: {
                wafiq: 'Wafiq',
                shomoos: 'Shomoos',
                ntm: 'Tourism Monitoring'
            },
            dynamicFields: {
                apiKey: 'API Key',
                branchCode: 'Branch Code',
                branchPassword: 'Branch Password',
                username: 'Username',
                password: 'Password',
                connectionKey: 'Connection Key',

            }
        }
    };

    const tr = translations[language as keyof typeof translations];

    const [formData, setFormData] = useState({
        hotelName: hotelData?.name || '',
        contactPerson: '',
        phoneNumber: hotelData?.phone || '',
        email: hotelData?.email || '',
        systemType: initialSystemType,
        notes: '',
        // Dynamic Fields
        apiKey: '', // Wafiq
        branchCode: '', // Shomoos
        branchPassword: '', // Shomoos
        username: '', // Shomoos & NTM
        password: '', // NTM
        connectionKey: '', // NTM

    });

    // Update system type if prop changes when modal opens
    React.useEffect(() => {
        if (isOpen && initialSystemType) {
            // Map the key (wafiq, shomoos, ntm) to the translated value
            const systemValue = tr.systems[initialSystemType as keyof typeof tr.systems];
            if (systemValue) {
                setFormData(prev => ({ ...prev, systemType: systemValue }));
            }
        }
    }, [isOpen, initialSystemType, tr.systems]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };



    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.hotelName.trim()) newErrors.hotelName = tr.requiredField;
        if (!formData.contactPerson.trim()) newErrors.contactPerson = tr.requiredField;
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = tr.requiredField;
        if (!formData.email.trim()) {
            newErrors.email = tr.requiredField;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = tr.invalidEmail;
        }
        if (!formData.systemType) newErrors.systemType = tr.requiredField;

        // Dynamic Validation
        if (formData.systemType === tr.systems.wafiq) {
            if (!formData.apiKey.trim()) newErrors.apiKey = tr.requiredField;
        } else if (formData.systemType === tr.systems.shomoos) {
            if (!formData.username.trim()) newErrors.username = tr.requiredField;
            if (!formData.branchCode.trim()) newErrors.branchCode = tr.requiredField;
            if (!formData.branchPassword.trim()) newErrors.branchPassword = tr.requiredField;
        } else if (formData.systemType === tr.systems.ntm) {
            if (!formData.connectionKey.trim()) newErrors.connectionKey = tr.requiredField;
            if (!formData.username.trim()) newErrors.username = tr.requiredField;
            if (!formData.password.trim()) newErrors.password = tr.requiredField;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        let dynamicFieldsBody = '';
        if (formData.systemType === tr.systems.wafiq) {
            dynamicFieldsBody = (language === 'ar' || language === 'ur') ? `
مفتاح الربط      : ${formData.apiKey}` : `
API Key         : ${formData.apiKey}`;
        } else if (formData.systemType === tr.systems.shomoos) {
            dynamicFieldsBody = (language === 'ar' || language === 'ur') ? `
اسم المستخدم     : ${formData.username}
كود الفرع        : ${formData.branchCode}
الرقم السري للفرع : ${formData.branchPassword}` : `
Username        : ${formData.username}
Branch Code     : ${formData.branchCode}
Branch Password : ${formData.branchPassword}`;
        } else if (formData.systemType === tr.systems.ntm) {
            dynamicFieldsBody = (language === 'ar' || language === 'ur') ? `
مفتاح الربط      : ${formData.connectionKey}
اسم المستخدم     : ${formData.username}
كلمة المرور      : ${formData.password}` : `
Connection Key  : ${formData.connectionKey}
Username        : ${formData.username}
Password        : ${formData.password}`;
        }

        const emailSubject = encodeURIComponent(
            (language === 'ar' || language === 'ur')
                ? `طلب ربط نظام - ${formData.hotelName}`
                : `System Integration Request - ${formData.hotelName}`
        );

        const emailBody = encodeURIComponent(
            (language === 'ar' || language === 'ur')
                ? `========================================
       طلب ربط مع الأنظمة
========================================

[ معلومات الفندق ]
----------------------------------------
اسم الفندق       : ${formData.hotelName}
الشخص المسؤول    : ${formData.contactPerson}
رقم الهاتف       : ${formData.phoneNumber}
البريد الإلكتروني : ${formData.email}

[ تفاصيل الربط ]
----------------------------------------
نوع النظام       : ${formData.systemType}

[ بيانات النظام ]
----------------------------------------
${dynamicFieldsBody.trim()}

[ ملاحظات إضافية ]
----------------------------------------
${formData.notes || 'لا يوجد'}

========================================
تم إنشاء هذا الطلب بواسطة نظام نزلكم
========================================`
                : `========================================
       SYSTEM INTEGRATION REQUEST
========================================

[ HOTEL INFORMATION ]
----------------------------------------
Hotel Name      : ${formData.hotelName}
Contact Person  : ${formData.contactPerson}
Phone Number    : ${formData.phoneNumber}
Email Address   : ${formData.email}

[ INTEGRATION DETAILS ]
----------------------------------------
System Type     : ${formData.systemType}

[ SYSTEM SPECIFIC DATA ]
----------------------------------------
${dynamicFieldsBody.trim()}

[ ADDITIONAL NOTES ]
----------------------------------------
${formData.notes || 'None'}

========================================
Generated by Nozulkom System
========================================`
        );

        const mailtoLink = `mailto:nozulkum@gmail.com?subject=${emailSubject}&body=${emailBody}`;
        window.location.href = mailtoLink;

        setTimeout(() => {
            onClose();
            setFormData({
                hotelName: hotelData?.name || '',
                contactPerson: '',
                phoneNumber: hotelData?.phone || '',
                email: hotelData?.email || '',
                systemType: initialSystemType,
                notes: '',
                apiKey: '',
                branchCode: '',
                branchPassword: '',
                username: '',
                password: '',
                connectionKey: '',

            });
            setErrors({});
        }, 500);
    };

    if (!isOpen) return null;

    const inputClass = "w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200 text-sm";
    const errorClass = "text-red-500 dark:text-red-400 text-xs mt-1";
    const labelClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ${isRTL ? 'text-right' : 'text-left'}`;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" >
            <div
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b dark:border-slate-700 bg-white  dark:bg-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        {tr.modalTitle}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        {tr.description}
                    </p>

                    <div>
                        <label className={labelClass}>{tr.hotelName} *</label>
                        <input
                            type="text"
                            name="hotelName"
                            value={formData.hotelName}
                            onChange={handleInputChange}
                            className={`${inputClass} ${errors.hotelName ? 'border-red-500' : ''}`}
                        />
                        {errors.hotelName && <p className={errorClass}>{errors.hotelName}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>{tr.contactPerson} *</label>
                        <input
                            type="text"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            className={`${inputClass} ${errors.contactPerson ? 'border-red-500' : ''}`}
                        />
                        {errors.contactPerson && <p className={errorClass}>{errors.contactPerson}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>{tr.phoneNumber} *</label>
                            <PhoneNumberInput
                                value={formData.phoneNumber}
                                onChange={(val) => {
                                    setFormData(prev => ({ ...prev, phoneNumber: val }));
                                    if (errors.phoneNumber) {
                                        setErrors(prev => ({ ...prev, phoneNumber: '' }));
                                    }
                                }}
                            />
                            {errors.phoneNumber && <p className={errorClass}>{errors.phoneNumber}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>{tr.email} *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <p className={errorClass}>{errors.email}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>{tr.systemType} *</label>
                        <select
                            name="systemType"
                            value={formData.systemType}
                            onChange={handleInputChange}
                            className={`${inputClass} ${errors.systemType ? 'border-red-500' : ''}`}
                        >
                            <option value="">{tr.selectSystemType}</option>
                            {Object.entries(tr.systems).map(([key, value]) => (
                                <option key={key} value={value}>{value}</option>
                            ))}
                        </select>
                        {errors.systemType && <p className={errorClass}>{errors.systemType}</p>}
                    </div>

                    {/* Dynamic Fields */}
                    {formData.systemType === tr.systems.wafiq && (
                        <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                            <div>
                                <label className={labelClass}>{tr.dynamicFields.apiKey} *</label>
                                <input
                                    type="text"
                                    name="apiKey"
                                    value={formData.apiKey}
                                    onChange={handleInputChange}
                                    className={`${inputClass} ${errors.apiKey ? 'border-red-500' : ''}`}
                                />
                                {errors.apiKey && <p className={errorClass}>{errors.apiKey}</p>}
                            </div>
                        </div>
                    )}

                    {formData.systemType === tr.systems.shomoos && (
                        <div className="space-y-4 bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                            <div>
                                <label className={labelClass}>{tr.dynamicFields.username} *</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`${inputClass} ${errors.username ? 'border-red-500' : ''}`}
                                />
                                {errors.username && <p className={errorClass}>{errors.username}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>{tr.dynamicFields.branchCode} *</label>
                                    <input
                                        type="text"
                                        name="branchCode"
                                        value={formData.branchCode}
                                        onChange={handleInputChange}
                                        className={`${inputClass} ${errors.branchCode ? 'border-red-500' : ''}`}
                                    />
                                    {errors.branchCode && <p className={errorClass}>{errors.branchCode}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>{tr.dynamicFields.branchPassword} *</label>
                                    <input
                                        type="password"
                                        name="branchPassword"
                                        value={formData.branchPassword}
                                        onChange={handleInputChange}
                                        className={`${inputClass} ${errors.branchPassword ? 'border-red-500' : ''}`}
                                    />
                                    {errors.branchPassword && <p className={errorClass}>{errors.branchPassword}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.systemType === tr.systems.ntm && (
                        <div className="space-y-4 bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                            <div>
                                <label className={labelClass}>{tr.dynamicFields.connectionKey} *</label>
                                <input
                                    type="text"
                                    name="connectionKey"
                                    value={formData.connectionKey}
                                    onChange={handleInputChange}
                                    className={`${inputClass} ${errors.connectionKey ? 'border-red-500' : ''}`}
                                />
                                {errors.connectionKey && <p className={errorClass}>{errors.connectionKey}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>{tr.dynamicFields.username} *</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className={`${inputClass} ${errors.username ? 'border-red-500' : ''}`}
                                    />
                                    {errors.username && <p className={errorClass}>{errors.username}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>{tr.dynamicFields.password} *</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`${inputClass} ${errors.password ? 'border-red-500' : ''}`}
                                    />
                                    {errors.password && <p className={errorClass}>{errors.password}</p>}
                                </div>
                            </div>
                        </div>

                    )}

                    <div>
                        <label className={labelClass}>{tr.notes}</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder={tr.notesPlaceholder}
                            className={inputClass}
                        />
                    </div>

                    <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                            <span>{tr.submit}</span>
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2 px-6 rounded-lg transition-colors"
                        >
                            {tr.cancel}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default IntegrationRequestModal;
