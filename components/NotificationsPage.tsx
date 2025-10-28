import React, { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

// Import necessary icons
import UserPlusIcon from './icons-redesign/UserPlusIcon';
import CurrencyDollarIcon from './icons-redesign/CurrencyDollarIcon';
import ServerIcon from './icons-redesign/ServerIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import CalendarIcon from './icons-redesign/CalendarIcon';
import WrenchScrewdriverIcon from './icons-redesign/WrenchScrewdriverIcon';
import { TranslationKey } from '../translations';

interface Notification {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  timestamp: string; // ISO string
  read: boolean;
}

const initialNotifications: Notification[] = [
    { id: 1, icon: UserPlusIcon, title: 'New account created', description: 'A new user has registered on the platform.', timestamp: new Date(Date.now() - 3600 * 1000 * 0.1).toISOString(), read: false },
    { id: 2, icon: CurrencyDollarIcon, title: 'New payment received', description: 'Payment of $250 received from booking #12345.', timestamp: new Date(Date.now() - 3600 * 1000 * 3).toISOString(), read: false },
    { id: 3, icon: ServerIcon, title: 'Server 1 overloaded', description: 'The main server is reaching 95% capacity.', timestamp: new Date(Date.now() - 3600 * 1000 * 25).toISOString(), read: true },
    { id: 4, icon: UserPlusIcon, title: 'New user registered', description: 'Guest "Ahmed Ali" has completed registration.', timestamp: new Date(Date.now() - 3600 * 1000 * 48).toISOString(), read: false },
    { id: 5, icon: CalendarIcon, title: 'Booking Confirmed', description: 'Booking #67890 for Room 101 is confirmed.', timestamp: new Date(Date.now() - 3600 * 1000 * 72).toISOString(), read: true },
    { id: 6, icon: WrenchScrewdriverIcon, title: 'Maintenance Request', description: 'Room 203 reports a broken AC unit.', timestamp: new Date(Date.now() - 3600 * 1000 * 90).toISOString(), read: true },
];

const timeAgo = (isoString: string, t: (key: TranslationKey, ...args: any[]) => string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return t('time.justNow');
    if (minutes < 60) return t('time.minutesAgo', minutes);
    if (hours < 24) return hours === 1 ? t('time.hourAgo') : t('time.hoursAgo', hours);
    return days === 1 ? t('time.dayAgo') : t('time.daysAgo', days);
};


const NotificationsPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

    const handleMarkAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleDelete = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const filteredNotifications = useMemo(() => {
        if (activeFilter === 'unread') {
            return notifications.filter(n => !n.read);
        }
        return notifications;
    }, [notifications, activeFilter]);

    const groupedNotifications = useMemo(() => {
        const groups: { today: Notification[], yesterday: Notification[], earlier: Notification[] } = {
            today: [],
            yesterday: [],
            earlier: []
        };
    
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
    
        filteredNotifications.forEach(notification => {
            const notificationDate = new Date(notification.timestamp);
            if (notificationDate.toDateString() === today.toDateString()) {
                groups.today.push(notification);
            } else if (notificationDate.toDateString() === yesterday.toDateString()) {
                groups.yesterday.push(notification);
            } else {
                groups.earlier.push(notification);
            }
        });
    
        return [
            { title: t('notificationsPage.today'), notifications: groups.today },
            { title: t('notificationsPage.yesterday'), notifications: groups.yesterday },
            { title: t('notificationsPage.earlier'), notifications: groups.earlier },
        ].filter(group => group.notifications.length > 0);
    }, [filteredNotifications, t]);
    

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <header className="p-4 border-b dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <button onClick={() => setActiveFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>{t('notificationsPage.all')}</button>
                    <button onClick={() => setActiveFilter('unread')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeFilter === 'unread' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>{t('notificationsPage.unread')}</button>
                </div>
                <button onClick={handleMarkAllAsRead} className="text-sm font-semibold text-blue-500 hover:underline">{t('notificationsPage.markAllAsRead')}</button>
            </header>
            
            <div className="p-6 space-y-6">
                {groupedNotifications.length > 0 ? (
                    groupedNotifications.map((group, index) => (
                        <div key={index}>
                            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">{group.title}</h3>
                            <div className="space-y-3">
                                {group.notifications.map(notification => (
                                    <div key={notification.id} className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                                        {!notification.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>}
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                                            <notification.icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{notification.title}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{notification.description}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{timeAgo(notification.timestamp, t)}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {!notification.read && (
                                                <button onClick={() => handleMarkAsRead(notification.id)} className="p-2 rounded-full text-green-500 hover:bg-green-100 dark:hover:bg-green-500/10" title="Mark as read">
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(notification.id)} className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10" title="Delete">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-slate-500 dark:text-slate-400">{t('notificationsPage.noNotifications')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;