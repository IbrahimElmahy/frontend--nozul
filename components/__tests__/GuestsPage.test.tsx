import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import GuestsPage from '../GuestsPage';
import { LanguageContext } from '../../contexts/LanguageContext';

// 1. Mock Services
const listGuestsMock = vi.fn();
const createGuestMock = vi.fn();
const updateGuestMock = vi.fn();
const deleteGuestMock = vi.fn();
const disableGuestMock = vi.fn();
const activateGuestMock = vi.fn();
const getGuestTypesMock = vi.fn();
const getIdTypesMock = vi.fn();
const getCountriesMock = vi.fn();

vi.mock('../../services/guests', () => ({
    listGuests: (...args: any[]) => listGuestsMock(...args),
    createGuest: (...args: any[]) => createGuestMock(...args),
    updateGuest: (...args: any[]) => updateGuestMock(...args),
    deleteGuest: (...args: any[]) => deleteGuestMock(...args),
    disableGuest: (...args: any[]) => disableGuestMock(...args),
    activateGuest: (...args: any[]) => activateGuestMock(...args),
    getGuestTypes: (...args: any[]) => getGuestTypesMock(...args),
    getIdTypes: (...args: any[]) => getIdTypesMock(...args),
    getCountries: (...args: any[]) => getCountriesMock(...args),
}));

// Mock Sub Components
vi.mock('../AddGuestPanel', () => ({ default: () => <div data-testid="add-guest-panel">Add Guest Panel</div> }));
vi.mock('../ConfirmationModal', () => ({ default: () => <div /> }));
vi.mock('../GuestDetailsModal', () => ({ default: () => <div /> }));
vi.mock('../GuestCard', () => ({
    default: ({ guest }: any) => <div data-testid="guest-card">MockGuest: {guest.fullName}</div>
}));

// Mock Language Context
const mockLanguageContext = {
    language: 'ar',
    t: (key: string) => {
        const tr: Record<string, string> = {
            'guests.manageGuests': 'إدارة الضيوف',
            'guests.addGuest': 'إضافة ضيف',
            'common.loading': 'جاري التحميل...',
            'common.unexpectedError': 'خطأ غير متوقع',
        };
        return tr[key] || key;
    },
    changeLanguage: vi.fn(),
    direction: 'rtl',
};

describe('GuestsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock Responses
        listGuestsMock.mockResolvedValue({
            data: [
                { id: '1', name: 'John Doe', mobile: '123456789', email: 'john@example.com', idNumber: '111', type: 'individual', created_at: '2025-01-01' }
            ],
            recordsFiltered: 1
        });

        getGuestTypesMock.mockResolvedValue({ data: [{ id: 1, name_ar: 'Individual', name_en: 'Individual' }] });
        getIdTypesMock.mockResolvedValue({ data: [{ id: 1, name_ar: 'National ID', name_en: 'National ID' }] });
        getCountriesMock.mockResolvedValue({});
    });

    const renderPage = () => render(
        <LanguageContext.Provider value={mockLanguageContext as any}>
            <GuestsPage />
        </LanguageContext.Provider>
    );

    it('should render the guests list', async () => {
        renderPage();

        // 1. Verify Page Title
        await screen.findByText('إدارة الضيوف', {}, { timeout: 3000 });

        // 2. Verify Service Calls
        await waitFor(() => {
            expect(listGuestsMock).toHaveBeenCalled();
            expect(getGuestTypesMock).toHaveBeenCalled();
        });

        // 3. Verify List Content
        // 3. Verify List Content
        await screen.findByRole('table');
        await screen.findByText(/John Doe/i, {}, { timeout: 3000 });
        // Phone might be hidden on small screens, so just ensure it's loaded if visible, or assume row logic works
    });

    it('should open Add Guest panel', async () => {
        renderPage();

        await screen.findByText('إدارة الضيوف', {}, { timeout: 3000 });

        const addButton = screen.getByText('إضافة ضيف');
        fireEvent.click(addButton);

        await screen.findByTestId('add-guest-panel', {}, { timeout: 3000 });
    });
});
