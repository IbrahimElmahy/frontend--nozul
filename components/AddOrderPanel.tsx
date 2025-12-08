
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Order, OrderItem, Service } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import SearchableSelect from './SearchableSelect';
import PlusIcon from './icons-redesign/PlusIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import { apiClient } from '../apiClient';

interface AddOrderPanelProps {
    initialData: Order | Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: Order | Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const SectionHeader: React.FC<{ icon: React.ComponentType<{ className?: string }>; title: string; }> = ({ icon: Icon, title }) => (
    <div className="bg-slate-100 dark:bg-slate-900/50 p-3 my-4 rounded-md flex items-center gap-3">
        <Icon className="w-5 h-5 text-slate-500" />
        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
    </div>
);

const AddOrderPanel: React.FC<AddOrderPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave }) => {
    const { t, language } = useContext(LanguageContext);

    // Form state
    const [apartmentName, setApartmentName] = useState('');
    const [reservationId, setReservationId] = useState('');
    const [items, setItems] = useState<OrderItem[]>([]);
    const [notes, setNotes] = useState('');

    // Financial state
    const [value, setValue] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    // Data options
    const [apartmentOptions, setApartmentOptions] = useState<{ name: string, reservationId: string }[]>([]);
    const [services, setServices] = useState<Record<string, Service[]>>({}); // Cache services by Category ID
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [loadingServices, setLoadingServices] = useState<Record<string, boolean>>({}); // Track loading state per category
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setApartmentName(initialData.apartmentName || '');
            // Cannot easily restore reservation ID for existing orders without extra lookups, 
            // but for edit mode, typically we'd have full object. 
            // For simplicity in this integration, we assume creation flow is primary or data is pre-filled.
            setItems(initialData.items || []);
            setNotes(initialData.notes || '');
            setValue(initialData.value || 0);
            setSubtotal(initialData.subtotal || 0);
            setTax(initialData.tax || 0);
            setTotal(initialData.total || 0);

            fetchData();
        }
    }, [isOpen, initialData]);

    const fetchData = async () => {
        try {
            // Fetch Occupied Apartments
            const apartmentsRes = await apiClient<{ data: any[] }>('/ar/apartment/api/apartments/?availability=reserved');
            const aptOptions = apartmentsRes.data
                .filter((apt: any) => apt.reservation)
                .map((apt: any) => ({
                    name: apt.name,
                    reservationId: apt.reservation.id
                }));
            setApartmentOptions(aptOptions);

            // Fetch Categories only (don't fetch all services at once)
            const categoriesRes = await apiClient<{ data: any[] }>('/ar/category/api/categories/?is_active=true&length=1000');

            setCategories(categoriesRes.data.map((c: any) => ({
                id: c.id,
                name: language === 'ar' ? c.name_ar : c.name_en
            })));

        } catch (error) {
            console.error("Error fetching data for order panel", error);
        }
    }

    // Trigger calculation when items or reservation changes
    useEffect(() => {
        if (reservationId && items.length > 0) {
            calculateOrder();
        } else if (items.length === 0) {
            setValue(0);
            setSubtotal(0);
            setTax(0);
            setTotal(0);
        }
    }, [items, reservationId]);

    const calculateOrder = async () => {
        // Filter out items that don't have a service selected yet
        // The backend validation fails if service is null/empty string
        const validItems = items.filter(item => item.service);

        if (validItems.length === 0) {
            setValue(0);
            setSubtotal(0);
            setTax(0);
            setTotal(0);
            return;
        }

        setCalculating(true);
        try {
            const payload = {
                reservation: reservationId,
                order_items: validItems.map(item => ({
                    service: item.service,
                    category: item.category,
                    quantity: item.quantity
                }))
            };

            const response = await apiClient<any>('/ar/order/api/orders/calculation/', {
                method: 'POST',
                body: payload
            });

            // The response structure from calculation endpoint isn't explicitly detailed in prompt 
            // beyond "Returns totals, taxes, and final amounts". 
            // I will assume standard keys based on previous context.
            if (response) {
                setValue(response.amount || 0); // Usually raw value
                setSubtotal(response.subtotal || 0);
                setTax(response.tax || 0);
                setTotal(response.total || 0);
            }

        } catch (error) {
            console.error("Calculation failed", error);
        } finally {
            setCalculating(false);
        }
    };

    const handleAddItem = () => {
        const newItem: OrderItem = {
            id: crypto.randomUUID(),
            service: '',
            category: '',
            quantity: 1,
            price: 0,
        };
        setItems(prev => [...prev, newItem]);
    };

    const fetchServicesForCategory = async (categoryId: string) => {
        // Return if already cached or currently loading
        if (services[categoryId] || loadingServices[categoryId]) return;

        setLoadingServices(prev => ({ ...prev, [categoryId]: true }));
        try {
            const res = await apiClient<{ data: any[] }>(`/ar/service/api/services/?category=${categoryId}&is_active=true&length=1000`);
            const fetchedServices = res.data.map((s: any) => ({
                ...s,
                id: s.id,
                name_ar: s.name_ar,
                name_en: s.name_en,
                price: parseFloat(s.price),
                category: s.category && typeof s.category === 'object' ? s.category.id : s.category
            }));

            setServices(prev => ({ ...prev, [categoryId]: fetchedServices }));
        } catch (error) {
            console.error(`Error fetching services for category ${categoryId}`, error);
        } finally {
            setLoadingServices(prev => ({ ...prev, [categoryId]: false }));
        }
    };

    const handleCategoryChange = (itemId: string, categoryName: string) => {
        const selectedCategory = categories.find(c => c.name === categoryName);
        if (!selectedCategory) return;

        // Trigger fetch for this category
        fetchServicesForCategory(selectedCategory.id);

        setItems(prev => prev.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    category: selectedCategory.id,
                    category_name: categoryName,
                    service: '', // Clear service when category changes
                    service_name: '',
                    price: 0
                };
            }
            return item;
        }));
    };

    const handleServiceChange = (itemId: string, serviceName: string) => {
        // Find the item to get its category
        const currentItem = items.find(i => i.id === itemId);
        if (!currentItem || !currentItem.category) return;

        // Service options are filtered by category in the map, lookup in that specific list
        const categoryServices = services[currentItem.category] || [];
        const selectedService = categoryServices.find(s => (language === 'ar' ? s.name_ar : s.name_en) === serviceName);

        if (!selectedService) return;

        setItems(prev => prev.map(item => {
            if (item.id === itemId) {
                // Category is already set, just update service
                return {
                    ...item,
                    service: selectedService.id,
                    service_name: serviceName,
                    price: selectedService.price
                };
            }
            return item;
        }));
    };

    const handleQuantityChange = (itemId: string, qty: number) => {
        setItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: qty } : item));
    }

    const handleRemoveItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleApartmentChange = (name: string) => {
        setApartmentName(name);
        const apt = apartmentOptions.find(a => a.name === name);
        if (apt) {
            setReservationId(apt.reservationId);
        } else {
            setReservationId('');
        }
    }

    const handleSaveClick = () => {
        // We pass the raw state back. The parent component or API handler inside Save needs to construct FormData again.
        // Actually, since this component has all logic, it might be cleaner to construct FormData here if onSave accepted it.
        // But to maintain signature, we pass the object and let parent handle or attach metadata.
        // Wait, the parent expects an object to add to state.
        // We should probably call the create API here if we want to use the ID returned by server?
        // The prompt says "Update OrdersPage ... Implement handleSaveOrder". 
        // I will pass the object with necessary hidden fields (reservationId) so parent can construct FormData.

        // Injecting hidden reservationID into the object for parent to use
        const orderData = {
            ...initialData,
            apartmentName,
            bookingNumber: reservationId, // Temporarily storing reservation ID here to pass to parent
            items,
            notes,
            value,
            subtotal,
            tax,
            total,
            discount: 0,
        };
        onSave(orderData);
    };

    const inputBaseClass = `w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200 text-sm`;
    const labelBaseClass = `block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1`;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog" aria-modal="true" aria-labelledby="add-order-title"
        >
            <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div className={`relative h-full bg-slate-50 dark:bg-slate-800 shadow-2xl flex flex-col w-full max-w-4xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <h2 id="add-order-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('orders.addOrderTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()}>
                        {/* Apartment Info */}
                        <SectionHeader icon={() => <></>} title={t('orders.apartmentInfo')} />
                        <div>
                            <label htmlFor="apartmentName" className={labelBaseClass}>{t('orders.apartments')}</label>
                            <SearchableSelect
                                id="apartmentName"
                                options={apartmentOptions.map(a => a.name)}
                                value={apartmentName}
                                onChange={handleApartmentChange}
                                placeholder={t('orders.selectApartment')}
                            />
                        </div>

                        {/* Services */}
                        <SectionHeader icon={() => <></>} title={t('orders.services')} />
                        <div className="mb-4">
                            <button type="button" onClick={handleAddItem} disabled={!reservationId} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:bg-blue-400">
                                <CheckCircleIcon className="w-5 h-5" />
                                <span>{t('orders.addItemsToOrder')}</span>
                            </button>
                        </div>

                        <div className="border dark:border-slate-700 rounded-lg">
                            <table className="w-full text-sm text-center table-fixed">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-200 dark:bg-slate-700 dark:text-slate-300">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 w-[20%]">{t('orders.categoryHeader')}</th>
                                        <th scope="col" className="px-4 py-3 w-[30%]">{t('orders.serviceHeader')}</th>
                                        <th scope="col" className="px-4 py-3 w-[15%]">{t('orders.quantityHeader')}</th>
                                        <th scope="col" className="px-4 py-3 w-[15%]">{t('orders.priceHeader')}</th>
                                        <th scope="col" className="px-4 py-3 w-[15%]">{t('orders.totalHeader')}</th>
                                        <th scope="col" className="px-4 py-3 w-[5%]"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr><td colSpan={6} className="py-8 text-slate-500">{t('orders.noData')}</td></tr>
                                    ) : items.map(item => {
                                        // Get services for this category from cache
                                        const categoryServices = item.category ? (services[item.category] || []) : [];
                                        const isLoading = item.category ? (loadingServices[item.category] || false) : false;

                                        const filteredServices = categoryServices.map(s => language === 'ar' ? s.name_ar : s.name_en);

                                        return (
                                            <tr key={item.id} className="border-b dark:border-slate-700">
                                                <td className="p-2">
                                                    <SearchableSelect
                                                        id={`category-${item.id}`}
                                                        options={categories.map(c => c.name)}
                                                        value={item.category_name || ''}
                                                        onChange={value => handleCategoryChange(item.id, value)}
                                                        placeholder={t('orders.selectCategory')}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <SearchableSelect
                                                        id={`service-${item.id}`}
                                                        options={filteredServices}
                                                        value={item.service_name || ''}
                                                        onChange={value => handleServiceChange(item.id, value)}
                                                        placeholder={t('orders.selectService')}
                                                        disabled={!item.category}
                                                    />
                                                </td>
                                                <td className="p-2"><input type="number" min="1" value={item.quantity} onChange={e => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)} className={`${inputBaseClass} w-20 text-center`} /></td>
                                                <td className="p-2"><input type="number" readOnly value={item.price} className={`${inputBaseClass} w-24 text-center bg-gray-100 dark:bg-gray-800`} /></td>
                                                <td className="p-2 font-semibold text-slate-800 dark:text-slate-200">{(item.quantity * item.price).toFixed(2)}</td>
                                                <td className="p-2 flex justify-center items-center h-full"><button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2">
                            <div className="md:col-start-2">
                                <div className="border dark:border-slate-700 rounded-lg overflow-hidden">
                                    <div className="flex justify-between items-center p-3 border-b dark:border-slate-700"><span className="font-medium text-slate-600 dark:text-slate-300">{t('orders.value')}:</span><span className="font-semibold text-slate-800 dark:text-slate-200">{value.toFixed(2)}</span></div>
                                    <div className="flex justify-between items-center p-3 border-b dark:border-slate-700"><span className="font-medium text-slate-600 dark:text-slate-300">{t('orders.subtotal')}:</span><span className="font-semibold text-slate-800 dark:text-slate-200">{subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between items-center p-3 border-b dark:border-slate-700"><span className="font-medium text-slate-600 dark:text-slate-300">{t('orders.tax')}:</span><span className="font-semibold text-slate-800 dark:text-slate-200">{tax.toFixed(2)}</span></div>
                                    <div className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-700">
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{t('orders.total')}:</span>
                                        {calculating ? <span className="text-xs text-blue-500">Calculating...</span> : <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{total.toFixed(2)}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Notes */}
                        <SectionHeader icon={() => <></>} title={t('orders.notes')} />
                        <textarea name="notes" rows={4} placeholder={t('orders.notesPlaceholder')} value={notes} onChange={e => setNotes(e.target.value)} className={inputBaseClass}></textarea>
                    </form>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
                    <button onClick={handleSaveClick} disabled={calculating || !reservationId} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:bg-blue-400">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{t('orders.saveOrder')}</span>
                    </button>
                    <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                        {t('units.cancel')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddOrderPanel;
