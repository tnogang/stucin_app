import type { RentVehicle, RentalOrder, Tables } from '@/types/rent';

export function mapVehicle(row: Tables['vehicles']): RentVehicle {
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    type: row.type ?? undefined,
    year: row.year ?? undefined,
    licensePlate: row.license_plate,
    vin: row.vin ?? undefined,
    color: row.color ?? undefined,
    registrationExpiry: row.registration_expiry ?? undefined,
    currentKm: row.current_km,
    fuelLevel: row.fuel_level ?? undefined,
    status: row.status as RentVehicle['status'],
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapRentalOrder(row: Tables['rental_orders']): RentalOrder {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    status: row.status as RentalOrder['status'],
    customer: (row.customer ?? {}) as RentalOrder['customer'],
    rental: (row.rental ?? {}) as RentalOrder['rental'],
    condition: (row.condition ?? {}) as RentalOrder['condition'],
    signatures: (row.signatures ?? {}) as RentalOrder['signatures'],
    documents: (row.documents ?? {}) as RentalOrder['documents'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toVehicleRow(
  vehicle: Partial<RentVehicle>
): Partial<Tables['vehicles']> {
  return {
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    license_plate: vehicle.licensePlate,
    current_km: vehicle.currentKm,
    status: vehicle.status,
    ...(vehicle.type ? { type: vehicle.type } : {}),
    ...(vehicle.vin ? { vin: vehicle.vin } : {}),
    ...(vehicle.color ? { color: vehicle.color } : {}),
    registration_expiry: vehicle.registrationExpiry || null,
    ...(vehicle.fuelLevel !== undefined && vehicle.fuelLevel !== null
      ? { fuel_level: vehicle.fuelLevel }
      : {}),
    ...(vehicle.notes ? { notes: vehicle.notes } : {}),
  };
}

export function toRentalOrderRow(
  order: Partial<RentalOrder>
): Partial<Tables['rental_orders']> {
  return {
    vehicle_id: order.vehicleId,
    status: order.status,
    customer: order.customer,
    rental: order.rental,
    condition: order.condition,
    signatures: order.signatures,
    documents: order.documents,
  };
}
