import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import UnitsPage from '../UnitsPage';
import { LanguageContext } from '../../contexts/LanguageContext';
import { ErrorContext } from '../../contexts/ErrorContext';

// 1. Mock the services
const listUnitsMock = vi.fn();
const createUnitMock = vi.fn();
const updateUnitMock = vi.fn();
const createReservationMock = vi.fn();

vi.mock('../../services/units', () => ({
    listUnits: (...args: any[]) => listUnitsMock(...args),
    listUnitTypes: vi.fn().mockResolvedValue([{ id: 'type1', name: 'Single Room' }]),
    listCoolingTypes: vi.fn().mockResolvedValue([]),
    listFeatures: vi.fn().mockResolvedValue([]),
    createUnit: (...args: any[]) => createUnitMock(...args),
    updateUnit: (...args: any[]) => updateUnitMock(...args),
    deleteUnit: vi.fn(),
}));

vi.mock('../../services/reservations', () => ({
    createReservation: (...args: any[]) => createReservationMock(...args),
    getRentalTypes: vi.fn().mockResolvedValue([]),
    getReservationSources: vi.fn().mockResolvedValue([]),
    getReservationReasons: vi.fn().mockResolvedValue([]),
    getReservationRelationships: vi.fn().mockResolvedValue([]),
    getDiscountTypes: vi.fn().mockResolvedValue([]),
    getCountries: vi.fn().mockResolvedValue([]),
    getGuestCategories: vi.fn().mockResolvedValue([]),
    getGuestIdTypes: vi.fn().mockResolvedValue([]),
    calculateRental: vi.fn().mockReturnValue(0),
}));

vi.mock('../../services/guests', () => ({
    createGuest: vi.fn(),
    updateGuest: vi.fn(),
    getGuestTypes: vi.fn().mockResolvedValue([]),
    getIdTypes: vi.fn().mockResolvedValue([]),
    listGuests: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock('../../services/orders', () => ({
    createOrder: vi.fn(),
}));

// Mock UnitCard to isolate render issues and provide interactive buttons
vi.mock('../UnitCard', () => ({
    default: ({ unit, onEditClick, onAddReservationClick }: any) => (
        <div data-testid="unit-card">
            MockUnit: {unit.unitName}
            <button onClick={onEditClick}>EditMock</button>
            <button onClick={onAddReservationClick}>ReserveMock</button>
        </div>
    )
}));

// 2. Mock API Mappers
vi.mock('../data/apiMappers', () => ({
    mapApiUnitToUnit: (data: any) => data,
    mapUnitToFormData: (data: any) => data,
}));

// 3. Mock Language Context
const mockLanguageContext = {
    language: 'ar',
    t: (key: string) => {
        const tr: Record<string, string> = {
            'units.manageUnits': 'إدارة الوحدات',
            'units.addUnit': 'إضافة وحدة',
            'units.unitName': 'اسم الوحدة',
            'units.saveChanges': 'حفظ التغييرات',
            'units.addReservation': 'إضافة حجز',
            'bookings.addBooking': 'إضافة حجز', // fallback for modal title
            'bookings.save': 'حفظ',
            'bookings.saveBooking': 'حفظ',
            'bookings.guestName': 'اسم النزيل',
            'units.free': 'شاغر',
            'units.occupied': 'مشغول',
            'units.clean': 'نظيف',
            'units.notClean': 'غیر نظيف',
        };
        return tr[key] || key;
    },
    changeLanguage: vi.fn(),
    direction: 'rtl',
};

const mockErrorContext = {
    showError: vi.fn(),
    error: null,
    title: '',
    clearError: vi.fn(),
};

describe('UnitsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        listUnitsMock.mockResolvedValue({
            data: [
                {
                    id: 'unit1',
                    unitNumber: '101',
                    unitName: 'Unit 101',
                    status: 'free',
                    cleaningStatus: 'clean',
                    unitType: 'type1',
                    features: [],
                    floor: 1, rooms: 1, beds: 1, bathrooms: 1, price: 500
                }
            ],
            recordsFiltered: 1
        });
    });

    const renderPage = () => render(
        <ErrorContext.Provider value={mockErrorContext}>
            <LanguageContext.Provider value={mockLanguageContext as any}>
                <UnitsPage />
            </LanguageContext.Provider>
        </ErrorContext.Provider>
    );

    it('should render the list of units', async () => {
        renderPage();

        // Check Header
        expect(screen.getByText('إدارة الوحدات')).toBeInTheDocument();

        // Check Unit Card Content (Mocked)
        await waitFor(() => {
            expect(screen.getByText('MockUnit: Unit 101')).toBeInTheDocument();
        });
    });

    it('should open Add Unit modal and submit form', async () => {
        renderPage();

        await waitFor(() => screen.getByText('MockUnit: Unit 101'));

        fireEvent.click(screen.getByText('إضافة وحدة'));

        await waitFor(() => screen.getByLabelText('اسم الوحدة'));
        fireEvent.change(screen.getByLabelText('اسم الوحدة'), { target: { value: 'New Unit' } });

        createUnitMock.mockResolvedValue({});

        // Targeted save button click (first one, which is UnitEditPanel)
        const saveButtons = screen.getAllByText('حفظ التغييرات');
        fireEvent.click(saveButtons[0]);

        await waitFor(() => {
            expect(createUnitMock).toHaveBeenCalledWith(expect.objectContaining({
                unitName: 'New Unit'
            }));
        }, { timeout: 3000 });
    });

    it('should open Edit Unit modal and submit changes', async () => {
        renderPage();

        await waitFor(() => screen.getByText('MockUnit: Unit 101'));

        // Click Edit on the mocked card
        fireEvent.click(screen.getByText('EditMock'));

        await waitFor(() => screen.getByLabelText('اسم الوحدة'));

        // Mock update
        updateUnitMock.mockResolvedValue({});

        const saveButtons = screen.getAllByText('حفظ التغييرات');
        fireEvent.click(saveButtons[0]);

        await waitFor(() => {
            expect(updateUnitMock).toHaveBeenCalled();
        });
    });

    it.skip('should open Add Reservation modal', async () => {
        renderPage();

        await waitFor(() => screen.getByText('MockUnit: Unit 101'));

        // Click Reserve on the mocked card
        fireEvent.click(screen.getByText('ReserveMock'));

        // Wait for modal content (Guest Name input)
        // AddBookingPanel usually fetches data, so wait might need to be robust
        await waitFor(() => {
            // Look for 'Booking Details' or specific label 'Guest Name'
            expect(screen.getByText('اسم النزيل')).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});
