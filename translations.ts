const translationsData = {
  ar: {
    walid_ullah: 'وليد الله',
    manager: 'مدير',
    logout: 'تسجيل الخروج',
    profile: 'الملف الشخصي',
    notifications: 'الإشعارات',
    clear_all: 'مسح الكل',
    view_all_notifications: 'عرض جميع الإشعarat',
    new_account_created: 'تم إنشاء حساب جديد',
    '5_minutes_ago': 'منذ 5 دقائق',
    new_payment_received: 'تم استلام دفعة جديدة',
    '25_minutes_ago': 'منذ 25 دقيقة',
    server_1_overloaded: 'الخادم #1 تجاوز الحد',
    '1_hour_ago': 'منذ ساعة واحدة',
    new_user_registered: 'مستخدم جديد مسجل',
    '2_hours_ago': 'منذ ساعتين',
    sidebar: {
      mainPage: 'الصفحة الرئيسية',
      dashboard: 'لوحة التحكم',
      reservationsManagement: 'إدارة الحجوزات',
      residentialRooms: 'الغرف السكنية',
      bookings: 'الحجوزات',
      orders: 'الطلبات',
      financialManagement: 'الإدارة المالية',
      receipts: 'السندات',
      guestManagement: 'إدارة النزلاء',
      guests: 'النزيل',
      bookingAgencies: 'وكالات الحجز',
      other: 'أخرى',
      reports: 'التقارير',
      archives: 'الارشيفات',
      notifications: 'الإشعارات',
      settings: 'الإعدادات',
    },
    header: {
        dashboard: 'لوحة التحكم',
        userInformation: 'معلومات المستخدم',
        hotelName: 'شقق ساس المصيف الفندقيه'
    },
    login: {
      title: 'تسجيل الدخول',
      subtitle: 'أدخل اسم المستخدم وكلمة المرور للوصول إلى لوحة التحكم.',
      usernameLabel: 'اسم المستخدم',
      usernamePlaceholder: 'أدخل اسم المستخدم',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      rememberMe: 'تذكرني',
      loginButton: 'تسجيل الدخول',
      error: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
      footerText: 'جميع الحقوق محفوظة نزلك',
    },
  },
  en: {
    walid_ullah: 'Waleed Allah',
    manager: 'Manager',
    logout: 'Logout',
    profile: 'Profile',
    notifications: 'Notifications',
    clear_all: 'Clear All',
    view_all_notifications: 'View All Notifications',
    new_account_created: 'New account created',
    '5_minutes_ago': '5 minutes ago',
    new_payment_received: 'New payment received',
    '25_minutes_ago': '25 minutes ago',
    server_1_overloaded: 'Server #1 overloaded',
    '1_hour_ago': '1 hour ago',
    new_user_registered: 'New user registered',
    '2_hours_ago': '2 hours ago',
    sidebar: {
      mainPage: 'Main Page',
      dashboard: 'Dashboard',
      reservationsManagement: 'Reservations Management',
      residentialRooms: 'Residential Rooms',
      bookings: 'Bookings',
      orders: 'Orders',
      financialManagement: 'Financial Management',
      receipts: 'Receipts',
      guestManagement: 'Guest Management',
      guests: 'Guests',
      bookingAgencies: 'Booking Agencies',
      other: 'Other',
      reports: 'Reports',
      archives: 'Archives',
      notifications: 'Notifications',
      settings: 'Settings',
    },
     header: {
        dashboard: 'Dashboard',
        userInformation: 'User Information',
        hotelName: 'SAS Al Masyaf Hotel Apartments'
    },
    login: {
      title: 'Login',
      subtitle: 'Enter your username and password to access the dashboard.',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Enter username',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter password',
      forgotPassword: 'Forgot password?',
      rememberMe: 'Remember me',
      loginButton: 'Login',
      error: 'Invalid username or password.',
      footerText: 'All rights reserved Nuzulcom',
    },
  }
};

type NestedObject<T> = { [key: string]: T | NestedObject<T> };
type Translations = NestedObject<string>;

function getKeys(obj: Translations, prefix = ''): string[] {
  return Object.keys(obj).reduce((res, el) => {
    const currentKey = prefix ? `${prefix}.${el}` : el;
    if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...getKeys(obj[el] as Translations, currentKey)];
    }
    return [...res, currentKey];
  }, [] as string[]);
}

export type TranslationKey = typeof allKeys[number];

const allKeys = getKeys(translationsData.ar);
export const translations = translationsData;
