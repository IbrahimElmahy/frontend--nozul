
import {
    listServices,
    createService,
    updateService,
    deleteService,
    activateService,
    disableService,
} from './services/services';
import {
    calculateOrder,
    createOrder,
    listOrders,
    updateOrder,
    deleteOrder,
    activateOrder,
    disableOrder,
} from './services/orders';

const verifyServicesOrders = async () => {
    console.log('Starting Services and Orders API Verification...');

    try {
        console.log('1. Testing Services API...');
        const services = await listServices();
        console.log('Services:', services);

        // Note: Skipping state-changing operations (create, update, delete) to avoid polluting the database.
        // If needed, we can implement a full flow with cleanup.

        console.log('2. Testing Orders API...');
        const ordersResponse = await listOrders();
        console.log('Orders Response:', ordersResponse);
        if (ordersResponse.results && ordersResponse.results.length > 0) {
            console.log('First Order Structure:', JSON.stringify(ordersResponse.results[0], null, 2));
        }

        console.log('Services and Orders API Verification Completed Successfully (Read-Only).');

    } catch (error) {
        console.error('Services and Orders API Verification Failed:', error);
    }
};

// Expose to window for manual execution in console
(window as any).verifyServicesOrders = verifyServicesOrders;
