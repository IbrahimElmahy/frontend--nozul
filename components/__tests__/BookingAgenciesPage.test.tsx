
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import BookingAgenciesPage from '../BookingAgenciesPage';
import { LanguageContext } from '../../contexts/LanguageContext';

// --- MOCKS ---

// 1. Service Mocks
const listAgenciesMock = vi.fn();
const createAgencyMock = vi.fn();
const updateAgencyMock = vi.fn();
const deleteAgencyMock = vi.fn();
const toggleAgencyStatusMock = vi.fn();

vi.mock('../../services/agencies', () => ({
    listAgencies: (...args: any[]) => listAgenciesMock(...args),
    createAgency: (...args: any[]) => createAgencyMock(...args),
    updateAgency: (...args: any[]) => updateAgencyMock(...args),
    deleteAgency: (...args: any[]) => deleteAgencyMock(...args),
    toggleAgencyStatus: (...args: any[]) => toggleAgencyStatusMock(...args),
}));

// 2. Component Mocks
// Mock AddAgencyPanel to avoid complex form interactions and focus on Page wiring
vi.mock('../AddAgencyPanel', () => ({
    default: ({ onSave, isOpen }: any) => isOpen ? (
        <div data-testid="add-agency-panel">
            <button onClick={() => {
                // Simulate creating an agency with FormData
                const formData = new FormData();
                formData.append('name', 'Test Agency');
                onSave(formData);
            }}>
                Save Agency
            </button>
        </div>
    ) : null
}));

// Mock AgencyCard to simplify list rendering assertions
vi.mock('../AgencyCard', () => ({
    default: ({ agency, onEditClick, onDeleteClick }: any) => (
        <div data-testid="agency-card">
            <span>{agency.name}</span>
            <button onClick={onEditClick}>Edit</button>
            <button onClick={onDeleteClick}>Delete</button>
        </div>
    )
}));

vi.mock('../ConfirmationModal', () => ({
    default: ({ isOpen, onConfirm }: any) => isOpen ? (
        <div data-testid="confirmation-modal">
            <button onClick={onConfirm}>Confirm</button>
        </div>
    ) : null
}));

// Context Mock
const mockLanguageContext = {
    language: 'ar',
    t: (key: string) => key,
    changeLanguage: vi.fn(),
    direction: 'rtl',
};

describe('BookingAgenciesPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithContext = (component: React.ReactNode) => render(
        <LanguageContext.Provider value={mockLanguageContext as any}>
            {component}
        </LanguageContext.Provider>
    );

    it('should render the list of agencies', async () => {
        // Setup mock return
        listAgenciesMock.mockResolvedValue({
            data: [
                { id: '1', name: 'Almosafer', phone_number: '123456', is_active: true, created_at: '2025-01-01' },
                { id: '2', name: 'Booking.com', phone_number: '789012', is_active: true, created_at: '2025-01-02' }
            ],
            recordsFiltered: 2
        });

        renderWithContext(<BookingAgenciesPage />);

        // Verify Data Loaded
        await waitFor(() => {
            expect(screen.getByText('Almosafer')).toBeInTheDocument();
            expect(screen.getByText('Booking.com')).toBeInTheDocument();
        });

        // Verify Service Call
        expect(listAgenciesMock).toHaveBeenCalled();
    });

    it('should open Add Agency modal and submit form', async () => {
        listAgenciesMock.mockResolvedValue({ data: [], recordsFiltered: 0 });
        createAgencyMock.mockResolvedValue({}); // Success

        renderWithContext(<BookingAgenciesPage />);

        // Open Modal
        const addValues = await screen.findAllByText('agencies.addAgency');
        fireEvent.click(addValues[0]); // Usually button is the first or specific one

        // Check Panel Open
        expect(screen.getByTestId('add-agency-panel')).toBeInTheDocument();

        // Submit
        fireEvent.click(screen.getByText('Save Agency'));

        // Verify Create Call
        await waitFor(() => {
            expect(createAgencyMock).toHaveBeenCalled();
            // Check FormData content if needed, but presence is enough for integration
            const formData = createAgencyMock.mock.calls[0][0];
            expect(formData).toBeInstanceOf(FormData);
            expect(formData.get('name')).toBe('Test Agency');
        });

        // Verify Refresh
        expect(listAgenciesMock).toHaveBeenCalledTimes(2); // Mount + After Save
    });

    it('should handle API errors gracefully', async () => {
        listAgenciesMock.mockRejectedValue(new Error('Failed to fetch'));

        renderWithContext(<BookingAgenciesPage />);

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
        });
    });
});
