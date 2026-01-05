import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock specific matchMedia for keycloak or responsive components
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock API Client to prevent actual network calls during tests unless specifically tested
vi.mock('./apiClient', () => ({
    apiClient: vi.fn(),
    API_BASE_URL: 'http://localhost:8000',
}));
