
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

// Import necessary icons
import UserPlusIcon from './icons-redesign/UserPlusIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import InformationCircleIcon from './icons-redesign/InformationCircleIcon';
import { TranslationKey } from '../translations';
import { apiClient } from '../apiClient';
import { Notification } from '../types';

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
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const response = await apiClient<{ data: Notification[] }>('/ar/notification/api/notifications/');
                setNotifications(response.data);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setLoading(false);
            }
        }
        fetchNotifications();
    }, []);

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.pk === id ? { ...n, unread: false } : n));
        // In a real app, call API here
    };

    const handleDelete = (id: string) => {
        setNotifications(prev => prev.filter(n => n.pk !== id));
        // In a real app, call API DELETE here
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        // Call API
    };

    const filteredNotifications = useMemo(() => {
        if (activeFilter === 'unread') {
            return notifications.filter(n => n.unread);
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


    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div></div>;
    }

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
                                    <div key={notification.pk} className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${notification.unread ? 'bg-blue-50/50 dark:bg-blue-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                                        {notification.unread && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>}
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                                            {notification.actor.image_url ? (
                                                <img src={notification.actor.image_url} alt="User" className="w-10 h-10 rounded-full" loading="lazy" />
                                            ) : (
                                                <InformationCircleIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{notification.verb}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{notification.actor.name} ({notification.actor.username})</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{timeAgo(notification.timestamp, t)}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {notification.unread && (
                                                <button onClick={() => handleMarkAsRead(notification.pk)} className="p-2 rounded-full text-green-500 hover:bg-green-100 dark:hover:bg-green-500/10" title="Mark as read">
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(notification.pk)} className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10" title="Delete">
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
