import { Unit, UnitStatus, CoolingType, CleaningStatus } from '../../types';

// Maps the raw API response for an apartment to the frontend's Unit type.
export const mapApiUnitToUnit = (apiUnit: any): Unit => {
    let status: UnitStatus = 'free';
    if (apiUnit.availability === 'reserved' || apiUnit.reservation) {
        status = apiUnit.reservation?.status === 'checkin' ? 'occupied' : 'not-checked-in';
    } else if (apiUnit.cleanliness === 'maintenance') {
        status = 'out-of-service';
    }

    let cleaningStatus: CleaningStatus = 'clean';
    if (apiUnit.cleanliness === 'dirty') {
        cleaningStatus = 'not-clean';
    }

    return {
        id: apiUnit.uuid ? apiUnit.uuid.toString() : apiUnit.id.toString(),
        unitNumber: apiUnit.name,
        unitName: apiUnit.name,
        status: status,
        customerName: apiUnit.reservation?.guest,
        checkIn: apiUnit.reservation?.check_in_date,
        checkOut: apiUnit.reservation?.check_out_date,
        price: parseFloat(apiUnit.apartment_price?.price_per_day) || 0,
        remaining: apiUnit.reservation?.balance ? -apiUnit.reservation.balance : 0,
        unitType: typeof apiUnit.apartment_type === 'object' ? apiUnit.apartment_type?.id : apiUnit.apartment_type,
        unitTypeName: typeof apiUnit.apartment_type === 'object' ? apiUnit.apartment_type?.name : '',
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
        features: Array.isArray(apiUnit.features) ? apiUnit.features.map((f: any) => typeof f === 'object' ? f.id : f) : []
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
    // IMPORTANT: Cannot change cleanliness to 'dirty' or 'maintenance' when unit is reserved
    let cleanlinessApiValue = 'clean';
    const isReserved = unit.status === 'occupied' || unit.status === 'not-checked-in';

    if (unit.cleaningStatus === 'not-clean') {
        cleanlinessApiValue = 'dirty';
    }
    if (unit.status === 'out-of-service') {
        cleanlinessApiValue = 'maintenance';
    }

    // If unit is reserved and we're trying to set dirty/maintenance, force it to clean
    if (isReserved && (cleanlinessApiValue === 'dirty' || cleanlinessApiValue === 'maintenance')) {
        cleanlinessApiValue = 'clean';
    }

    formData.append('cleanliness', cleanlinessApiValue);


    // Append each feature ID
    if (unit.features) {
        unit.features.forEach(featureId => {
            formData.append('features', featureId);
        });
    }

    return formData;
};