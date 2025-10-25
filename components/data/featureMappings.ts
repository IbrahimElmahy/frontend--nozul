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
        microwave: boolean;
        newspaper: boolean;
        oven: boolean;
        phoneDirectory: boolean;
    };
}


export const allFeatures: FeatureMapping[] = [
    // Common
    { id: 'f4bb7c9d-8dd4-4736-8872-20a54deb8722', name: 'roomCleaning', category: 'common' },
    { id: '826777b6-7c93-4565-947b-b794344dcd87', name: 'elevator', category: 'common' },
    { id: '27af1def-782d-4126-b255-880712d99271', name: 'parking', category: 'common' },
    { id: '19b39447-8b84-4d53-af70-fd92e6040f78', name: 'internet', category: 'common' },

    // Special
    { id: '918198ac-a573-4988-af7d-bd07dfd8753b', name: 'kitchen', category: 'special' },
    { id: '6cc702e9-d15d-4e79-b980-5af22025a630', name: 'lounge', category: 'special' },
    { id: '1067a70f-5b73-4c3a-8861-f0e9f2f152e5', name: 'diningTable', category: 'special' },
    { id: 'b082a305-67b9-4f3e-8387-4553a0fb9c4f', name: 'refrigerator', category: 'special' },
    { id: '7ebc0b0c-f0af-4bb2-ac29-677e16c35eb7', name: 'iron', category: 'special' },
    { id: '0d04d0df-e356-4f92-9d89-45b9ec18757a', name: 'restaurantMenu', category: 'special' },
    // FIX: Add mapping for the 'washingMachine' feature.
    { id: '2e9f8d7c-6b5a-4e3d-2c1b-0a9f8e7d6c5b', name: 'washingMachine', category: 'special' },
    { id: '5e2a1b0c-7d8c-4e6a-8b9a-0c1d2e3f4a5b', name: 'microwave', category: 'special' },
    { id: '6f1b0a9d-6c7b-4d5a-9a8b-1b2c3d4e5f6a', name: 'newspaper', category: 'special' },
    { id: '7a0c9b8d-5b6a-4c3d-8b7a-2c3d4e5f6a7b', name: 'oven', category: 'special' },
    { id: '8b9a8c7d-4a5b-4b2c-9a6b-3d4e5f6a7b8c', name: 'phoneDirectory', category: 'special' },
];