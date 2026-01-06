
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ReportsPage from '../ReportsPage';
import { LanguageContext } from '../../contexts/LanguageContext';

// --- MOCKS ---

// Mock Child Components to verify conditional rendering
vi.mock('../ReportDailyBookings', () => ({ default: () => <div data-testid="report-daily-bookings">Daily Bookings Report</div> }));
vi.mock('../ReportBalady', () => ({ default: () => <div data-testid="report-balady">Balady Report</div> }));
vi.mock('../ReportFinancial', () => ({ default: () => <div data-testid="report-financial">Financial Report</div> }));
vi.mock('../ReportFundMovement', () => ({ default: () => <div data-testid="report-fund-movement">Fund Movement Report</div> }));
vi.mock('../ReportAccountStatement', () => ({ default: () => <div data-testid="report-account-statement">Account Statement Report</div> }));

// Context Mock
const mockLanguageContext = {
    language: 'ar',
    t: (key: string) => key,
    changeLanguage: vi.fn(),
    direction: 'rtl',
};

describe('ReportsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithContext = (component: React.ReactNode) => render(
        <LanguageContext.Provider value={mockLanguageContext as any}>
            {component}
        </LanguageContext.Provider>
    );

    it('should render the list of report categories and reports', () => {
        renderWithContext(<ReportsPage />);
        // Check Categories in Main Content
        const main = screen.getByRole('main');
        expect(within(main).getAllByText('reportsPage.categories.financial')[0]).toBeInTheDocument();
        expect(within(main).getAllByText('reportsPage.categories.operational')[0]).toBeInTheDocument();

        // Check Reports Titles
        expect(within(main).getByText('reportsPage.reports.cash_flow.title')).toBeInTheDocument();
        expect(within(main).getByText('reportsPage.reports.daily_bookings.title')).toBeInTheDocument();
    });

    it('should filter reports when searching', async () => {
        renderWithContext(<ReportsPage />);

        const searchInput = screen.getByPlaceholderText('reportsPage.searchPlaceholder');
        const main = screen.getByRole('main');

        // Search
        fireEvent.change(searchInput, { target: { value: 'daily_bookings' } });

        // 'cash_flow' should disappear from Main
        await waitFor(() => {
            expect(within(main).queryByText('reportsPage.reports.cash_flow.title')).not.toBeInTheDocument();
            expect(within(main).getByText('reportsPage.reports.daily_bookings.title')).toBeInTheDocument();
        });
    });

    it('should navigate to a report detail view when clicked', async () => {
        renderWithContext(<ReportsPage />);

        const main = screen.getByRole('main');
        // Click on Daily Bookings in Main grid
        const reportItem = within(main).getByText('reportsPage.reports.daily_bookings.title');
        fireEvent.click(reportItem);

        // Verify Detail View Rendered
        expect(await screen.findByTestId('report-daily-bookings')).toBeInTheDocument();

        // Verify Header Title Updated
        // The header is outside both main? No, Page replaces Main with Detail View.
        // Let's check simply by text in doc.
        expect(screen.getAllByText('reportsPage.reports.daily_bookings.title').length).toBeGreaterThan(0);

        // Verify Back Button Functionality
        const backBtn = screen.getByText('buttons.back');
        fireEvent.click(backBtn);

        // Verify returned to Main List
        expect(screen.queryByTestId('report-daily-bookings')).not.toBeInTheDocument();
        expect(screen.getAllByText('reportsPage.categories.operational').length).toBeGreaterThan(0);
    });

    it('should filter by sidebar categories', async () => {
        renderWithContext(<ReportsPage />);

        // Click "Financial" category in sidebar (it has role button in nav usually, or we use getAll)
        // Sidebar is an aside. Let's find within aside.
        const sidebar = screen.getByRole('complementary'); // aside usually renders as complementary
        const financialBtn = within(sidebar).getByText('reportsPage.categories.financial');
        fireEvent.click(financialBtn);

        // Verify only financial reports are shown
        await waitFor(() => {
            expect(screen.getByText('reportsPage.reports.cash_flow.title')).toBeInTheDocument(); // Financial
            expect(screen.queryByText('reportsPage.reports.daily_bookings.title')).not.toBeInTheDocument(); // Operational
        });
    });
});
