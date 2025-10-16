import React, { useState, useContext } from 'react';
import { Unit } from '../types';
import { LanguageContext } from '../contexts/LanguageContext';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import InformationCircleIcon from './icons-redesign/InformationCircleIcon';

interface UnitsTableProps {
    units: Unit[];
    onEdit: (unit: Unit) => void;
    onDelete: (unitId: string) => void;
}

const statusStyles: { [key: string]: string } = {
    free: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    occupied: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    'not-checked-in': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    'out-of-service': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

const UnitsTable: React.FC<UnitsTableProps> = ({ units, onEdit, onDelete }) => {
    const { t, language } = useContext(LanguageContext);
    const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);
    
    const isRtl = language === 'ar';

    const getStatusText = (status: string) => {
        switch (status) {
            case 'free': return t('units.free');
            case 'occupied': return t('units.occupied');
            case 'not-checked-in': return t('units.notCheckedIn');
            case 'out-of-service': return t('units.outOfService');
            default: return status;
        }
    };
    
    const headers = [
        '#',
        'units.unitName',
        'units.customerName',
        'units.status',
        'units.checkIn',
        'units.checkOut',
        'units.price',
        'units.remainingForHim',
        'units.cleaningStatus',
        'Actions'
    ];
    
    const handleDeleteConfirm = () => {
        if (unitToDelete) {
            onDelete(unitToDelete.id);
            setUnitToDelete(null);
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} className={`p-3 font-semibold tracking-wide ${isRtl ? 'text-right' : 'text-left'} text-slate-600 dark:text-slate-300`}>
                                    {header.includes('.') ? t(header as any) : header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {units.map((unit, index) => (
                            <tr key={unit.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="p-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{index + 1}</td>
                                <td className="p-3 text-slate-800 dark:text-slate-200 font-semibold whitespace-nowrap">{unit.unitNumber}</td>
                                <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{unit.customerName || '-'}</td>
                                <td className="p-3 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[unit.status]}`}>
                                        {getStatusText(unit.status)}
                                    </span>
                                </td>
                                <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{unit.checkIn || '-'}</td>
                                <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{unit.checkOut || '-'}</td>
                                <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{unit.price ? `${unit.price} SAR` : '-'}</td>
                                <td className={`p-3 font-semibold whitespace-nowrap ${unit.remaining && unit.remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    {unit.remaining != null ? `${unit.remaining} SAR` : '-'}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    <span className={`font-medium ${unit.cleaningStatus === 'clean' ? 'text-teal-600' : 'text-amber-600'}`}>
                                        {t(`units.${unit.cleaningStatus}`)}
                                    </span>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onEdit(unit)} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors" aria-label="Edit unit">
                                            <PencilSquareIcon className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => setUnitToDelete(unit)} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-rose-600 transition-colors" aria-label="Delete unit">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Confirmation Modal */}
            {unitToDelete && (
                 <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 transition-opacity duration-300"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-confirmation-title"
                >
                     <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-2xl">
                         <div className="p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 p-2 flex items-center justify-center mx-auto mb-3.5">
                                <InformationCircleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 id="delete-confirmation-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                {`Are you sure you want to delete Unit ${unitToDelete.unitNumber}?`}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                This action cannot be undone. All data associated with this unit will be permanently removed.
                            </p>
                         </div>
                         <div className="flex items-center justify-center p-4 gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-b-lg">
                            <button onClick={() => setUnitToDelete(null)} className="font-semibold py-2 px-5 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} className="font-semibold py-2 px-5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                                Confirm Delete
                            </button>
                         </div>
                     </div>
                </div>
            )}
        </>
    );
};

export default UnitsTable;