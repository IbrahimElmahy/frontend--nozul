export interface ChartData {
  name: string;
  value: number;
}

export interface DonutChartData extends ChartData {
  color: string;
}

export type UnitStatus = 'free' | 'occupied' | 'not-checked-in' | 'out-of-service';
export type CleaningStatus = 'clean' | 'not-clean';
export type CoolingType = 'central' | 'split' | 'window' | '';

export interface Unit {
    // Core Info
    id: string; // unique identifier
    unitNumber: string;
    unitName?: string;
    
    // Status & Reservation
    status: UnitStatus;
    customerName?: string;
    checkIn?: string;
    checkOut?: string;
    price?: number;
    remaining?: number;

    // Details
    unitType: string;
    cleaningStatus: CleaningStatus;
    isAvailable: boolean;
    floor: number;
    rooms: number;
    bathrooms: number;
    beds: number;
    doubleBeds: number;
    wardrobes: number;
    tvs: number;
    coolingType: CoolingType;
    notes: string;

    // Features (Booleans)
    features: {
        common: {
            roomCleaning: boolean;
            elevator: boolean;
            parking: boolean;
            internet: boolean;
        };
        special: {
            kitchen: boolean;
            lounge: boolean;
            diningTable: boolean;
            refrigerator: boolean;
            iron: boolean;
            restaurantMenu: boolean;
            washingMachine: boolean;
            qibla: boolean;
            microwave: boolean;
            newspaper: boolean;
            oven: boolean;
            phoneDirectory: boolean;
        };
    };
}
