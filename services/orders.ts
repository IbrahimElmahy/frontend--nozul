import { apiClient } from '../apiClient';
import { Order, OrderItem } from '../types';

interface OrderListResponse {
    data: any[]; // The raw API response often has snake_case fields that need mapping
    recordsFiltered: number;
}

export const listOrders = async (params: URLSearchParams = new URLSearchParams()): Promise<{ orders: Order[], total: number }> => {
    // Convert URLSearchParams to query string
    const response = await apiClient<OrderListResponse>(`/ar/order/api/orders/?${params.toString()}`);

    const mappedOrders: Order[] = response.data.map((o: any) => ({
        id: o.id,
        orderNumber: o.number,
        bookingNumber: o.reservation || '',
        apartmentName: o.apartment || '',
        value: parseFloat(o.amount),
        discount: parseFloat(o.discount || 0),
        subtotal: parseFloat(o.subtotal),
        tax: parseFloat(o.tax),
        total: parseFloat(o.total),
        createdAt: o.created_at,
        updatedAt: o.updated_at,
        notes: o.note,
        items: o.order_items ? o.order_items.map((item: any) => ({
            id: item.id,
            service: typeof item.service === 'string' ? item.service : (item.service?.name_ar || item.service?.name_en || ''),
            category: typeof item.category === 'string' ? item.category : (item.category?.name_ar || item.category?.name_en || ''),
            quantity: item.quantity,
            price: parseFloat(item.price)
        })) : []
    }));

    return { orders: mappedOrders, total: response.recordsFiltered };
};

export const createOrder = async (orderData: any): Promise<void> => {
    // orderData needs to be transformed to match API expectations
    const payload = {
        reservation: orderData.bookingNumber, // mapped from frontend model
        note: orderData.notes,
        order_items: orderData.items ? orderData.items.map((item: any) => ({
            service: item.service,
            category: item.category,
            quantity: item.quantity
        })) : []
    };

    await apiClient('/ar/order/api/orders/', {
        method: 'POST',
        body: payload
    });
};

export const updateOrder = async (id: string, orderData: any): Promise<void> => {
    const payload = {
        order: id,
        reservation: orderData.bookingNumber,
        note: orderData.notes,
        order_items: orderData.items ? orderData.items.map((item: any) => ({
            service: item.service,
            category: item.category,
            quantity: item.quantity
        })) : []
    };

    await apiClient(`/ar/order/api/orders/${id}/`, {
        method: 'PUT',
        body: payload
    });
};

export const deleteOrder = async (id: string): Promise<void> => {
    await apiClient(`/ar/order/api/orders/${id}/`, { method: 'DELETE' });
};

export const calculateOrder = async (reservationId: string, items: OrderItem[]): Promise<any> => {
    const validItems = items.filter(item => item.service);
    if (validItems.length === 0) return null;

    const payload = {
        reservation: reservationId,
        order_items: validItems.map(item => ({
            service: item.service,
            category: item.category,
            quantity: item.quantity
        }))
    };

    return await apiClient<any>('/order/api/orders/calculation/', {
        method: 'POST',
        body: payload
    });
};
