import { Unit, UnitStatus, CoolingType, CleaningStatus } from '../../types';
import { allFeatures } from './featureMappings';

// Maps the raw API response for an apartment to the frontend's Unit type.
export const mapApiUnitToUnit = (apiUnit: any): Unit => {
    let status: UnitStatus = 'free';
    if (apiUnit.availability === 'reserved' || apiUnit.reservation) {
        status = apiUnit.reservation?.status === 'checkin' ? 'occupied' : 'not-checked-in';
    } else if (apiUnit.cleanliness === 'maintenance') {
        status = 'out-of-service';
    }

    const unitFeatures = {
        common: { roomCleaning: false, elevator: false, parking: false, internet: false },
        special: { 
            kitchen: false, lounge: false, diningTable: false, refrigerator: false, 
            iron: false, restaurantMenu: false, 
            // FIX: Add missing 'washingMachine' property to satisfy the Unit type.
            washingMachine: false, 
            microwave: false, newspaper: false, oven: false 
        }
    };

    if (apiUnit.features && Array.isArray(apiUnit.features)) {
        for (const featureId of apiUnit.features) {
            const feature = allFeatures.find(f => f.id === featureId);
            if (feature) {
                if (feature.category === 'common') {
                    (unitFeatures.common as any)[feature.name] = true;
                } else {
                    (unitFeatures.special as any)[feature.name] = true;
                }
            }
        }
    }
    
    let cleaningStatus: CleaningStatus = 'clean';
    if (apiUnit.cleanliness === 'dirty') {
        cleaningStatus = 'not-clean';
    }

    return {
        id: apiUnit.id,
        unitNumber: apiUnit.name,
        unitName: apiUnit.name,
        status: status,
        customerName: apiUnit.reservation?.guest,
        checkIn: apiUnit.reservation?.check_in_date,
        checkOut: apiUnit.reservation?.check_out_date,
        price: parseFloat(apiUnit.apartment_price?.price_per_day) || 0,
        remaining: apiUnit.reservation?.balance ? -apiUnit.reservation.balance : 0,
        unitType: typeof apiUnit.apartment_type === 'object' ? apiUnit.apartment_type?.name : apiUnit.apartment_type,
        cleaningStatus: cleaningStatus,
        isAvailable: apiUnit.availability === 'available',
        floor: parseInt(apiUnit.floor, 10) || 0,
        rooms: apiUnit.rooms || 0,
        bathrooms: apiUnit.bathrooms || 0,
        beds: apiUnit.beds || 0,
        doubleBeds: apiUnit.double_beds || 0,
        wardrobes: apiUnit.wardrobes || 0,
        tvs: apiUnit.tvs || 0,
        coolingType: (apiUnit.cooling_type as CoolingType) || '',
        notes: apiUnit.description || apiUnit.note || '',
        features: unitFeatures
    };
};

// Maps the frontend Unit object to a FormData object for API submission.
export const mapUnitToFormData = (unit: Unit): FormData => {
    const formData = new FormData();

    formData.append('name', unit.unitNumber);
    formData.append('apartment_type', unit.unitType); // Assuming unitType stores the ID
    formData.append('floor', unit.floor.toString());
    formData.append('rooms', unit.rooms.toString());
    formData.append('bathrooms', unit.bathrooms.toString());
    formData.append('beds', unit.beds.toString());
    formData.append('double_beds', unit.doubleBeds.toString());
    formData.append('wardrobes', unit.wardrobes.toString());
    formData.append('tvs', unit.tvs.toString());
    formData.append('cooling_type', unit.coolingType);
    formData.append('description', unit.notes);
    
    // API uses 'dirty', 'clean', 'maintenance'
    let cleanlinessApiValue = 'clean';
    if (unit.cleaningStatus === 'not-clean') {
        cleanlinessApiValue = 'dirty';
    }
    if (unit.status === 'out-of-service') {
        cleanlinessApiValue = 'maintenance';
    }
    formData.append('cleanliness', cleanlinessApiValue);

    // Map boolean features back to an array of UUIDs
    for (const category in unit.features) {
        for (const featureName in (unit.features as any)[category]) {
            if ((unit.features as any)[category][featureName]) {
                const feature = allFeatures.find(f => f.name === featureName && f.category === category);
                if (feature) {
                    formData.append('features', feature.id);
                }
            }
        }
    }

    return formData;
};