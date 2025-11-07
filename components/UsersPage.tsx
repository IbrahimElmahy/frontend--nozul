import React, { useState, useMemo, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { HotelUser } from '../types';
import MagnifyingGlassIcon from './icons-redesign/MagnifyingGlassIcon';
import ChevronLeftIcon from './icons-redesign/ChevronLeftIcon';
import ChevronRightIcon from './icons-redesign/ChevronRightIcon';
import EyeIcon from './icons-redesign/EyeIcon';
import PencilSquareIcon from './icons-redesign/PencilSquareIcon';
import TrashIcon from './icons-redesign/TrashIcon';
import PlusCircleIcon from './icons-redesign/PlusCircleIcon';
import AddUserPanel from './AddUserPanel';
import ConfirmationModal from './ConfirmationModal';
import UserDetailsModal from './UserDetailsModal';
import { Page } from '../App';


const mockUsers: HotelUser[] = [
    { id: 1, username: 'demo_hotel', name: 'table-userdemo', mobile: '+966567289647', email: 'demo@gmail.com', role: 'مدير', status: 'active', gender: '-', lastLogin: '2025-11-02 14:55:28', createdAt: '2025-06-16 14:41:54', updatedAt: '2025-06-16 14:41:54', dob: '1995-03-14', isManager: true, permissions: {} },
    { id: 2, username: 'receptionist_1', name: 'Sara Ahmed', mobile: '+966551234567', email: 'sara.a@example.com', role: 'موظف استقبال', status: 'active', gender: 'female', lastLogin: '2025-11-03 09:12:45', createdAt: '2025-01-10 10:00:00', updatedAt: '2025-05-20 11:30:00' },
    { id: 3, username: 'housekeeper_5', name: 'Fatima Khan', mobile: '+966509876543', email: 'fatima.k@example.com', role: 'عامل نظافة', status: 'inactive', gender: 'female', lastLogin: '2025-10-15 18:00:10', createdAt: '2025-02-15 12:00:00', updatedAt: '2025-10-01 08:00:00' },
];

const newUserTemplate: Omit<HotelUser, 'id' | 'lastLogin' | 'createdAt' | 'updatedAt'> = {
    username: '',
    name: '',
    mobile: '',
    email: '',
    role: 'موظف استقبال',
    status: 'active',
    gender: 'male',
    dob: '',
    isManager: false,
    notes: '',
    permissions: {},
};

interface UsersPageProps {
    setCurrentPage: (page: Page) => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ setCurrentPage }) => {
    const { t, language } = useContext(LanguageContext);
    const [users, setUsers] = useState<HotelUser[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    // FIX: Rename `currentPage` to `paginationCurrentPage` and `setCurrentPage` to `setPaginationCurrentPage` to avoid conflict with the `setCurrentPage` prop.
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<HotelUser | null>(null);
    const [userToDelete, setUserToDelete] = useState<HotelUser | null>(null);
    const [viewingUser, setViewingUser] = useState<HotelUser | null>(null);

    const handleAddNewClick = () => {
        setEditingUser(null);
        setIsAddPanelOpen(true);
    };

    const handleEditClick = (user: HotelUser) => {
        setEditingUser(user);
        setIsAddPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsAddPanelOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = (userData: Omit<HotelUser, 'id' | 'lastLogin' | 'createdAt' | 'updatedAt'>) => {
        if (editingUser) {
            // Update existing user
            const updatedUser = { ...editingUser, ...userData, updatedAt: new Date().toISOString() };
            setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
        } else {
            // Add new user
            const newUser: HotelUser = {
                ...userData,
                id: Math.max(...users.map(u => u.id)) + 1,
                lastLogin: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setUsers([newUser, ...users]);
        }
        handleClosePanel();
    };
    
    const handleDeleteClick = (user: HotelUser) => {
        setUserToDelete(user);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            setUsers(users.filter(u => u.id !== userToDelete.id));
            setUserToDelete(null);
        }
    };


    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            Object.values(user).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [users, searchTerm]);
    
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = useMemo(() => {
        const startIndex = (paginationCurrentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, paginationCurrentPage, itemsPerPage]);

    const tableHeaders = [
        'th_id', 'th_username', 'th_name', 'th_mobile', 'th_email', 'th_role', 'th_status', 'th_gender', 
        'th_lastLogin', 'th_createdAt', 'th_updatedAt', 'th_actions'
    ];
    
    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('usersPage.pageTitle')}</h2>
                </div>
                 <div className="flex flex-wrap items-center gap-2">
                    <button onClick={handleAddNewClick} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>{t('usersPage.addUser')}</span>
                    </button>
                    <button 
                        onClick={() => setCurrentPage('hotel-settings')}
                        className={`flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                    >
                        <ChevronLeftIcon className={`w-5 h-5 transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                        <span>{t('buttons.back')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 pb-4 border-b dark:border-slate-700">
                     <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span>{t('usersPage.showing')}</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPaginationCurrentPage(1); }}
                            className="py-1 px-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span>{t('usersPage.entries')}</span>
                    </div>
                     <div className="relative w-full sm:w-auto sm:flex-grow max-w-lg">
                        <MagnifyingGlassIcon className="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 left-3" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPaginationCurrentPage(1); }}
                            placeholder={t('guests.searchPlaceholder')}
                            className="w-full py-2 pl-10 pr-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400 whitespace-nowrap">
                         <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                            <tr>
                                {tableHeaders.map(header => <th key={header} scope="col" className="px-6 py-3">{t(`usersPage.${header}` as any)}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map(user => (
                                <tr key={user.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4">{user.id}</td>
                                    <td className="px-6 py-4">{user.username}</td>
                                    <td className="px-6 py-4">{user.name}</td>
                                    <td className="px-6 py-4">{user.mobile}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {t(`usersPage.status_${user.status}`)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{user.gender}</td>
                                    <td className="px-6 py-4">{user.lastLogin}</td>
                                    <td className="px-6 py-4">{user.createdAt}</td>
                                    <td className="px-6 py-4">{user.updatedAt}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setViewingUser(user)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleEditClick(user)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleDeleteClick(user)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('usersPage.showing')} ${filteredUsers.length > 0 ? (paginationCurrentPage - 1) * itemsPerPage + 1 : 0} ${t('usersPage.to')} ${Math.min(paginationCurrentPage * itemsPerPage, filteredUsers.length)} ${t('usersPage.of')} ${filteredUsers.length} ${t('usersPage.entries')}`}
                    </div>
                    {totalPages > 1 && (
                         <nav className="flex items-center gap-1" aria-label="Pagination">
                            <button onClick={() => setPaginationCurrentPage(p => Math.max(1, p - 1))} disabled={paginationCurrentPage === 1} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeftIcon className="w-5 h-5" /></button>
                             <span className="text-sm font-semibold px-2">{paginationCurrentPage} / {totalPages}</span>
                            <button onClick={() => setPaginationCurrentPage(p => Math.min(totalPages, p + 1))} disabled={paginationCurrentPage === totalPages} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRightIcon className="w-5 h-5" /></button>
                        </nav>
                    )}
                </div>

            </div>

            <AddUserPanel 
                isOpen={isAddPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveUser}
                isEditing={!!editingUser}
                initialData={editingUser || newUserTemplate}
            />

            <ConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={t('usersPage.deleteUserTitle')}
                message={t('usersPage.confirmDeleteMessage')}
            />

            <UserDetailsModal 
                user={viewingUser}
                onClose={() => setViewingUser(null)}
            />
        </div>
    );
};

export default UsersPage;