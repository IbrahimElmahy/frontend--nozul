
import {
    getRentalTypes,
    getReservationSources,
    getReservationReasons,
    getDiscountTypes,
    getCountries,
    getGuestCategories,
    searchAvailableApartments,
    searchGuests,
    calculateRental,
    createReservation,
    listReservations,
    updateReservation,
    checkoutReservation,
    deleteReservation,
} from './services/reservations';
import { createInvoice, listInvoices } from './services/invoices';

const verifyApi = async () => {
    console.log('Starting API Verification...');

    try {
        console.log('1. Testing Form Dependencies...');
        const rentalTypes = await getRentalTypes();
        console.log('Rental Types:', rentalTypes);

        const sources = await getReservationSources();
        console.log('Reservation Sources:', sources);

        const reasons = await getReservationReasons();
        console.log('Reservation Reasons:', reasons);

        const discountTypes = await getDiscountTypes();
        console.log('Discount Types:', discountTypes);

        const countries = await getCountries();
        console.log('Countries:', countries);

        const guestCategories = await getGuestCategories();
        console.log('Guest Categories:', guestCategories);

        console.log('2. Testing Availability Search...');
        const apartments = await searchAvailableApartments({
            status: 'available',
            check_in_date: '2025-12-01',
            check_out_date: '2025-12-02',
        });
        console.log('Available Apartments:', apartments);

        console.log('3. Testing Guest Search...');
        const guests = await searchGuests({ category: 'customer' });
        console.log('Guests:', guests);

        // Note: Skipping state-changing operations (create, update, delete) to avoid polluting the database.
        // If needed, we can implement a full flow with cleanup.

        console.log('API Verification Completed Successfully (Read-Only).');

    } catch (error) {
        console.error('API Verification Failed:', error);
    }
};

// Expose to window for manual execution in console
(window as any).verifyApi = verifyApi;
