
import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
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
import Switch from './Switch';
import { Page } from '../App';
import { listUsers, createUser, updateUser, deleteUser, toggleUserStatus } from '../services/users';


const newUserTemplate: Omit<HotelUser, 'id' | 'last_login' | 'created_at' | 'updated_at' | 'profile' | 'role_display' | 'image_url'> = {
    username: '',
    name: '',
    phone_number: '',
    email: '',
    role: 'hotel', // Default to hotel role for now
    is_active: true,
    // For form usage
    isManager: false,
    notes: '',
    permissions: {},
};

interface UsersPageProps {
    setCurrentPage: (page: Page) => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ setCurrentPage }) => {
    const { t, language } = useContext(LanguageContext);
    const [users, setUsers] = useState<HotelUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<HotelUser | null>(null);
    const [userToDelete, setUserToDelete] = useState<HotelUser | null>(null);
    const [viewingUser, setViewingUser] = useState<HotelUser | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('role', 'hotel'); // Filter by hotel role as per doc
            params.append('start', ((paginationCurrentPage - 1) * itemsPerPage).toString());
            params.append('length', itemsPerPage.toString());
            if (searchTerm) params.append('search', searchTerm);

            const response = await listUsers(params);
            setUsers(response.data);
            setTotalRecords(response.recordsFiltered);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }, [paginationCurrentPage, itemsPerPage, searchTerm]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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

    const handleSaveUser = async (formData: FormData) => {
        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
            } else {
                await createUser(formData);
            }
            fetchUsers();
            handleClosePanel();
        } catch (err) {
            alert(`Error saving user: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    const handleDeleteClick = (user: HotelUser) => {
        setUserToDelete(user);
    };

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            try {
                await deleteUser(userToDelete.id);
                setUsers(users.filter(u => u.id !== userToDelete.id));
                setUserToDelete(null);
            } catch (e) {
                alert(`Failed to delete user: ${e instanceof Error ? e.message : 'Unknown error'}`);
            }
        }
    };

    const handleToggleStatus = async (user: HotelUser, newStatus: boolean) => {
        try {
            await toggleUserStatus(user.id, newStatus);
            // Optimistically update
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u));
        } catch (err) {
            alert(`Error changing status: ${err instanceof Error ? err.message : 'Unknown error'}`);
            fetchUsers(); // Revert
        }
    };


    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    const tableHeaders = [
        'th_id', 'th_username', 'th_name', 'th_mobile', 'th_email', 'th_role', 'th_status', 'th_gender',
        'th_lastLogin', 'th_createdAt', 'th_updatedAt', 'th_actions'
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('usersPage.pageTitle' as any)}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={handleAddNewClick} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>{t('usersPage.addUser' as any)}</span>
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
                        <span>{t('usersPage.showing' as any)}</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPaginationCurrentPage(1); }}
                            className="py-1 px-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span>{t('usersPage.entries' as any)}</span>
                    </div>
                    <div className="relative w-full sm:w-auto sm:flex-grow max-w-lg">
                        <MagnifyingGlassIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPaginationCurrentPage(1); }}
                            placeholder={t('guests.searchPlaceholder')}
                            className={`w-full py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 ${language === 'ar' ? 'pr-10' : 'pl-10'}`}
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
                            {loading ? (
                                <tr><td colSpan={12} className="text-center py-8">Loading...</td></tr>
                            ) : users.map(user => (
                                <tr key={user.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4"><span className="font-mono text-xs">{user.id.substring(0, 8)}</span></td>
                                    <td className="px-6 py-4">{user.username}</td>
                                    <td className="px-6 py-4">{user.name}</td>
                                    <td className="px-6 py-4" dir="ltr">{user.phone_number}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.role_display || user.role}</td>
                                    <td className="px-6 py-4">
                                        <Switch
                                            id={`status-${user.id}`}
                                            checked={!!user.is_active}
                                            onChange={(c) => handleToggleStatus(user, c)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">{user.profile?.gender_display || user.profile?.gender || '-'}</td>
                                    <td className="px-6 py-4">{user.last_login ? new Date(user.last_login).toLocaleString() : '-'}</td>
                                    <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{new Date(user.updated_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setViewingUser(user)} className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10"><EyeIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleEditClick(user)} className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10"><PencilSquareIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleDeleteClick(user)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && users.length === 0 && (
                                <tr><td colSpan={12} className="text-center py-8">{t('orders.noData')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        {`${t('usersPage.showing' as any)} ${users.length > 0 ? (paginationCurrentPage - 1) * itemsPerPage + 1 : 0} ${t('usersPage.to' as any)} ${Math.min(paginationCurrentPage * itemsPerPage, totalRecords)} ${t('usersPage.of' as any)} ${totalRecords} ${t('usersPage.entries' as any)}`}
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
                // @ts-ignore - Template mismatch for now
                initialData={editingUser || newUserTemplate}
            />

            <ConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={t('usersPage.deleteUserTitle' as any)}
                message={t('usersPage.confirmDeleteMessage' as any)}
            />

            <UserDetailsModal
                user={viewingUser}
                onClose={() => setViewingUser(null)}
            />
        </div>
    );
};

export default UsersPage;
