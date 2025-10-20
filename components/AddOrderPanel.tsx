import React, { useState, useEffect, useContext, useMemo } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Order, OrderItem } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import SearchableSelect from './SearchableSelect';
import PlusIcon from './icons-redesign/PlusIcon';
import TrashIcon from './icons-redesign/TrashIcon';

interface AddOrderPanelProps {
    initialData: Order | Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
    isEditing: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: Order | Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const SectionHeader: React.FC<{ icon: React.ComponentType<{className?:string}>; title: string; }> = ({ icon: Icon, title }) => (
    <div className="bg-slate-100 dark:bg-slate-900/50 p-3 my-4 rounded-md flex items-center gap-3">
        <Icon className="w-5 h-5 text-slate-500" />
        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
    </div>
);

const AddOrderPanel: React.FC<AddOrderPanelProps> = ({ initialData, isEditing, isOpen, onClose, onSave }) => {
    const { t } = useContext(LanguageContext);
    
    // Form state
    const [apartmentName, setApartmentName] = useState('');
    const [items, setItems] = useState<OrderItem[]>([]);
    const [notes, setNotes] = useState('');
    
    // Financial state, derived from items
    const [value, setValue] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setApartmentName(initialData.apartmentName || '');
            setItems(initialData.items || []);
            setNotes(initialData.notes || '');
            setValue(initialData.value || 0);
            setSubtotal(initialData.subtotal || 0);
            setTax(initialData.tax || 0);
            setTotal(initialData.total || 0);
        }
    }, [isOpen, initialData]);

    // Recalculate totals whenever items change
    useEffect(() => {
        const calculatedValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        // For this UI, we assume subtotal = value, and total = value + tax, as there's no discount field.
        const calculatedSubtotal = calculatedValue;
        const calculatedTotal = calculatedSubtotal + tax;
        setValue(calculatedValue);
        setSubtotal(calculatedSubtotal);
        setTotal(calculatedTotal);
    }, [items, tax]);

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

    const handleItemChange = (id: string, field: keyof Omit<OrderItem, 'id'>, fieldValue: string | number) => {
        setItems(prevItems => prevItems.map(item => {
            if (item.id === id) {
                return { ...item, [field]: fieldValue };
            }
            return item;
        }));
    };

    const handleRemoveItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleSaveClick = () => {
        const orderData = {
            ...initialData,
            apartmentName,
            items,
            notes,
            value,
            subtotal,
            tax,
            total,
            discount: 0, // No discount field in this UI
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
                            <SearchableSelect id="apartmentName" options={['101', '102', '201', 'A213', 'ذوى الهمم']} value={apartmentName} onChange={setApartmentName} placeholder={t('orders.selectApartment')} />
                        </div>
                        
                        {/* Services */}
                        <SectionHeader icon={() => <></>} title={t('orders.services')} />
                        <div className="mb-4">
                            <button type="button" onClick={handleAddItem} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5" />
                                <span>{t('orders.addItemsToOrder')}</span>
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto border dark:border-slate-700 rounded-lg">
                            <table className="w-full text-sm text-center">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-200 dark:bg-slate-700 dark:text-slate-300">
                                    <tr>
                                        {['serviceHeader', 'categoryHeader', 'quantityHeader', 'priceHeader', 'totalHeader', 'actionHeader'].map(key => (
                                            <th key={key} scope="col" className="px-4 py-3">{t(`orders.${key}` as any)}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr><td colSpan={6} className="py-8 text-slate-500">{t('orders.noData')}</td></tr>
                                    ) : items.map(item => (
                                        <tr key={item.id} className="border-b dark:border-slate-700">
                                            <td className="p-2"><input type="text" value={item.service} onChange={e => handleItemChange(item.id, 'service', e.target.value)} className={inputBaseClass} /></td>
                                            <td className="p-2"><input type="text" value={item.category} onChange={e => handleItemChange(item.id, 'category', e.target.value)} className={inputBaseClass} /></td>
                                            <td className="p-2"><input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', parseInt(e.target.value, 10) || 1)} className={`${inputBaseClass} w-20 text-center`} /></td>
                                            <td className="p-2"><input type="number" min="0" step="0.01" value={item.price} onChange={e => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)} className={`${inputBaseClass} w-24 text-center`} /></td>
                                            <td className="p-2 font-semibold text-slate-800 dark:text-slate-200">{(item.quantity * item.price).toFixed(2)}</td>
                                            <td className="p-2"><button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2">
                            <div className="md:col-start-2">
                                 <div className="border dark:border-slate-700 rounded-lg overflow-hidden">
                                     <div className="flex justify-between items-center p-3 border-b dark:border-slate-700"><span className="font-medium text-slate-600 dark:text-slate-300">{t('orders.value')}:</span><span className="font-semibold text-slate-800 dark:text-slate-200">{value.toFixed(2)}</span></div>
                                     <div className="flex justify-between items-center p-3 border-b dark:border-slate-700"><span className="font-medium text-slate-600 dark:text-slate-300">{t('orders.subtotal')}:</span><span className="font-semibold text-slate-800 dark:text-slate-200">{subtotal.toFixed(2)}</span></div>
                                     <div className="flex justify-between items-center p-3 border-b dark:border-slate-700"><span className="font-medium text-slate-600 dark:text-slate-300">{t('orders.tax')}:</span><span className="font-semibold text-slate-800 dark:text-slate-200">{tax.toFixed(2)}</span></div>
                                     <div className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-700"><span className="font-bold text-slate-800 dark:text-slate-200">{t('orders.total')}:</span><span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{total.toFixed(2)}</span></div>
                                 </div>
                            </div>
                        </div>


                        {/* Notes */}
                        <SectionHeader icon={() => <></>} title={t('orders.notes')} />
                        <textarea name="notes" rows={4} placeholder={t('orders.notesPlaceholder')} value={notes} onChange={e => setNotes(e.target.value)} className={inputBaseClass}></textarea>
                    </form>
                </div>

                <footer className="flex items-center justify-start p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
                    <button onClick={handleSaveClick} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
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