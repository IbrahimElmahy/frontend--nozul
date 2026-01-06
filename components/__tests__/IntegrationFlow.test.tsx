
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import BookingsPage from '../BookingsPage';
import OrdersPage from '../OrdersPage';
import ReceiptsPage from '../ReceiptsPage';
import { LanguageContext } from '../../contexts/LanguageContext';

// --- MOCKS ---

// 1. Services
const createReservationMock = vi.fn();
const createOrderMock = vi.fn();
const createTransactionMock = vi.fn(); // For receipts

import { listTransactions } from '../../services/financials';

vi.mock('../../services/reservations', () => ({
    listReservations: vi.fn().mockResolvedValue({
        count: 1,
        results: [{
            id: 'res123',
            bookingNumber: 'RES-101',
            guest: { name: 'John Doe' },
            apartment: { name: 'Unit 101' },
            status: 'confirmed',
            check_in_date: '2025-01-01',
            check_out_date: '2025-01-05',
            created_at: '2025-01-01T10:00:00Z',
            rental_type: 'daily',
            total: 500,
            paid: 0,
            balance: 500
        }]
    }),
    createReservation: (...args: any[]) => createReservationMock(...args),
}));

vi.mock('../../services/orders', () => ({
    listOrders: vi.fn().mockResolvedValue({ orders: [], total: 0 }),
    createOrder: (...args: any[]) => createOrderMock(...args),
}));

vi.mock('../../services/financials', () => ({
    listTransactions: vi.fn().mockResolvedValue({ transactions: [], total: 0 }),
    listInvoices: vi.fn().mockResolvedValue({ invoices: [], total: 0 }),
    createTransaction: (...args: any[]) => createTransactionMock(...args),
    getExpenseCategories: vi.fn(),
    listExpenses: vi.fn().mockResolvedValue({ expenses: [], total: 0 }),
}));

vi.mock('../../services/guests', () => ({
    listGuests: vi.fn().mockResolvedValue({ data: [{ id: 'guest1', name: 'John Doe' }], recordsFiltered: 1 }),
    getGuestTypes: vi.fn().mockResolvedValue({ data: [] }),
    getIdTypes: vi.fn().mockResolvedValue({ data: [] }),
    getCountries: vi.fn().mockResolvedValue({}),
}));

vi.mock('../../services/units', () => ({
    listUnits: vi.fn().mockResolvedValue({ units: [{ id: 'unit1', unitNumber: '101', status: 'free' }], total: 1 }),
    getUnitTypes: vi.fn().mockResolvedValue([]),
    getFeatures: vi.fn().mockResolvedValue([]),
}));

// 2. Sub-Components (Mocking Panels to simulate inputs directly)
// We mock the PANELS to expose strict "Save" triggers, because simulating filling complex forms in JSDOM is brittle.
// We assume the *Panels themselves* are tested individually (or verified manually).
// Here we test the PAGE wiring.

vi.mock('../AddBookingPanel', () => ({
    default: ({ onSave, isOpen }: any) => isOpen ? (
        <div data-testid="add-booking-panel">
            <button onClick={() => onSave({
                guestId: 'guest1',
                unitId: 'unit1',
                guestName: 'John Doe',
                unitName: 'Unit 101',
                checkInDate: '2025-01-01',
                checkOutDate: '2025-01-05',
                rentType: 'daily',
                duration: 4,
                rent: 100,
                status: 'check-in',
                discountType: 'fixed'
            })}>Save Booking</button>
        </div>
    ) : null
}));

vi.mock('../AddOrderPanel', () => ({
    default: ({ onSave, isOpen }: any) => isOpen ? (
        <div data-testid="add-order-panel">
            <button onClick={() => onSave({ bookingNumber: 'res123', items: [] })}>Save Order</button>
        </div>
    ) : null
}));

vi.mock('../AddReceiptPanel', () => ({
    default: ({ onSave, isOpen }: any) => isOpen ? (
        <div data-testid="add-receipt-panel">
            <button onClick={() => onSave({ reservationId: 'res123', amount: 100 })} >Save Receipt</button>
        </div>
    ) : null
}));

// Mock Other Modals
vi.mock('../ConfirmationModal', () => ({ default: () => null }));
vi.mock('../BookingCard', () => ({ default: () => <div>Booking Card</div> }));
vi.mock('../OrderCard', () => ({ default: () => <div>Order Card</div> }));

// Context
const mockLanguageContext = {
    language: 'ar',
    t: (key: string) => key,
    changeLanguage: vi.fn(),
    direction: 'rtl',
};

describe('Integration Flow: Booking Lifecycle', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithContext = (component: React.ReactNode) => render(
        <LanguageContext.Provider value={mockLanguageContext as any}>
            {component}
        </LanguageContext.Provider>
    );

    it('should allow creating a Booking -> Order -> Receipt flow via Page interactions', async () => {
        // STEP 1: Create Booking
        // ----------------------
        const { unmount: unmountBookings } = renderWithContext(<BookingsPage />);

        // Open Panel
        const addBookingBtn = await screen.findByText('bookings.addBooking'); // Using raw key from mock
        fireEvent.click(addBookingBtn);

        // Save Booking (Simulated via Mock Panel)
        const saveBookingBtn = await screen.findByText('Save Booking');
        fireEvent.click(saveBookingBtn);

        // Verify Service Call
        await waitFor(() => {
            expect(createReservationMock).toHaveBeenCalledWith(expect.objectContaining({
                guest: 'John Doe',
                apartment: 'Unit 101'
            }));
        });
        unmountBookings(); // Cleanup

        // STEP 2: Create Order (Linked to Reservation)
        // --------------------------------------------
        const { unmount: unmountOrders } = renderWithContext(<OrdersPage />);

        // Open Panel
        const addOrderBtn = await screen.findByText('orders.addOrder');
        fireEvent.click(addOrderBtn);

        // Save Order
        const saveOrderBtn = await screen.findByText('Save Order');
        fireEvent.click(saveOrderBtn);

        // Verify Service Call
        await waitFor(() => {
            expect(createOrderMock).toHaveBeenCalledWith(expect.objectContaining({
                reservation: 'res123'
            }));
        });
        unmountOrders();

        // STEP 3: Create Receipt (Linked to Reservation)
        // ----------------------------------------------
        // Note: ReceiptsPage requires 'user' prop
        renderWithContext(<ReceiptsPage user={{ id: '1', name: 'Admin', role: 'admin' } as any} />);

        // Open Panel
        const addReceiptBtn = await screen.findByText('receipts.addReceipt');
        fireEvent.click(addReceiptBtn);

        // Wait for Panel to appear
        const saveReceiptBtn = await screen.findByText('Save Receipt');
        fireEvent.click(saveReceiptBtn);

        // Verify that listTransactions is called > 1 time (Mount + Save)
        await waitFor(() => {
            const calls = (listTransactions as any).mock.calls.length;
            // console.log('listTransactions calls:', calls);
            expect(calls).toBeGreaterThan(1);
        }, { timeout: 3000 });
    });
});
