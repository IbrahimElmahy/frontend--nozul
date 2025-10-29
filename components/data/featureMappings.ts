export interface FeatureMapping {
    id: string;
    name: keyof UnitFeatures['common'] | keyof UnitFeatures['special'];
    category: 'common' | 'special';
}

interface UnitFeatures {
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
        oven: boolean;
    };
}

// This hardcoded list is now deprecated. Features are fetched dynamically in UnitsPage.tsx.
export const allFeatures: FeatureMapping[] = [];