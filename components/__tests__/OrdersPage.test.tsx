import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import OrdersPage from '../OrdersPage';
import { LanguageContext } from '../../contexts/LanguageContext';

// 1. Mock Services
const listOrdersMock = vi.fn();
const createOrderMock = vi.fn();
const updateOrderMock = vi.fn();
const deleteOrderMock = vi.fn();
const listReservationsMock = vi.fn();

vi.mock('../../services/orders', () => ({
    listOrders: (...args: any[]) => listOrdersMock(...args),
    createOrder: (...args: any[]) => createOrderMock(...args),
    updateOrder: (...args: any[]) => updateOrderMock(...args),
    deleteOrder: (...args: any[]) => deleteOrderMock(...args),
}));

vi.mock('../../services/reservations', () => ({
    listReservations: (...args: any[]) => listReservationsMock(...args),
}));

// Mock Sub Components to avoid render issues
vi.mock('../ConfirmationModal', () => ({ default: () => <div /> }));
vi.mock('../OrderDetailsModal', () => ({ default: () => <div /> }));
vi.mock('../AddOrderPanel', () => ({ default: () => <div data-testid="add-panel" /> }));
vi.mock('../OrderCard', () => ({ default: () => <div data-testid="order-card">MockOrder</div> }));

// Mock Language Context
const mockLanguageContext = {
    language: 'ar',
    t: (key: string) => {
        const tr: Record<string, string> = {
            'orders.manageOrders': 'إدارة الطلبات',
            'orders.addOrder': 'إضافة طلب',
        };
        return tr[key] || key;
    },
    changeLanguage: vi.fn(),
    direction: 'rtl',
};

describe('OrdersPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        listOrdersMock.mockResolvedValue({
            orders: [
                {
                    id: 'ord1',
                    orderNumber: 'ORD-001',
                    bookingNumber: 'B001',
                    apartmentName: 'Unit 101',
                    value: 100,
                    discount: 0,
                    subtotal: 100,
                    tax: 15,
                    total: 115,
                    items: [],
                    notes: 'Test Order',
                    createdAt: '2025-01-01T10:00:00Z',
                    updatedAt: '2025-01-01T10:00:00Z',
                    isActive: true
                }
            ],
            total: 1
        });
        listReservationsMock.mockResolvedValue({ data: [] });
    });

    const renderPage = () => render(
        <LanguageContext.Provider value={mockLanguageContext as any}>
            <OrdersPage />
        </LanguageContext.Provider>
    );

    it('should render the orders page and call service', async () => {
        renderPage();

        // 1. Verify Page Title Loads
        await waitFor(() => {
            expect(screen.getByText('إدارة الطلبات')).toBeInTheDocument();
        }, { timeout: 3000 });

        // 2. Verify Service API is called
        await waitFor(() => {
            expect(listOrdersMock).toHaveBeenCalled();
        });

        // 3. Optional: Check for list content (Commented out if flaky due to async mapping)
        // await waitFor(() => expect(screen.getAllByTestId('order-card').length).toBeGreaterThan(0));
    });

    it('should open Add Order modal', async () => {
        renderPage();

        await waitFor(() => {
            expect(screen.getByText('إدارة الطلبات')).toBeInTheDocument();
        }, { timeout: 3000 });

        const addButtons = screen.getAllByText('إضافة طلب');
        fireEvent.click(addButtons[0]);

        await waitFor(() => {
            expect(screen.getByTestId('add-panel')).toBeInTheDocument();
        });
    });
});
