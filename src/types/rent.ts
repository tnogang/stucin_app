export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'retired' | 'deleted';
export type RentalStatus = 'draft' | 'signed' | 'active' | 'returned';

export interface RentVehicle {
  id: string;
  make: string;
  model: string;
  type?: string;
  year?: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  registrationExpiry?: string;
  currentKm: number;
  fuelLevel?: number;
  status: VehicleStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RentalCustomer {
  fullName: string;
  address: string;
  phone: string;
  email?: string;
  idNumber?: string;
  idDocumentType?: string;
  driverLicense?: string;
  dateOfBirth?: string;
  emso?: string;
  taxNumber?: string;
  authorizedDriver?: string;
}

export interface RentalEquipment {
  documents: boolean;
  firstAid: boolean;
  jack: boolean;
  bulbs: boolean;
  triangle: boolean;
  spareWheel: boolean;
  fireExtinguisher: boolean;
  radio: boolean;
  antenna: boolean;
}

export interface RentalDetails {
  startDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  startKm: number;
  returnKm?: number;
  pickupLocation?: string;
  returnLocation?: string;
  dailyRate?: number;
  totalPrice?: number;
  deposit?: number;
  fuelLevelOut?: number;
  fuelLevelIn?: number;
  insurance?: boolean;
  personalInsurance?: boolean;
  kaskoInsurance?: boolean;
  delivery?: boolean;
  deliveryWithTow?: boolean;
  deliveryLocation?: string;
  pickup?: boolean;
  pickupWithTow?: boolean;
  protocolNumber?: string;
}

export interface RentalCondition {
  cleanOut: boolean;
  cleanIn?: boolean;
  damageNotesOut: string;
  damageNotesIn?: string;
  damagePhotosOut?: string[];
  damagePhotosIn?: string[];
  equipment?: RentalEquipment;
}

export interface RentalSignatures {
  customerOut?: string;
  employeeOut?: string;
  customerIn?: string;
  employeeIn?: string;
}

export interface RentalDocuments {
  preRentalPdf?: string;
  postRentalPdf?: string;
}

export interface RentalOrder {
  id: string;
  vehicleId: string;
  status: RentalStatus;
  customer: RentalCustomer;
  rental: RentalDetails;
  condition: RentalCondition;
  signatures: RentalSignatures;
  documents: RentalDocuments;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleWithRental extends RentVehicle {
  activeRental?: RentalOrder;
}

export const defaultRentalCustomer = (): RentalCustomer => ({
  fullName: '',
  address: '',
  phone: '',
});

export const defaultRentalDetails = (): RentalDetails => ({
  startDate: new Date().toISOString().slice(0, 16),
  expectedReturnDate: '',
  startKm: 0,
  pickupLocation: '',
  returnLocation: '',
});

export const defaultRentalEquipment = (): RentalEquipment => ({
  documents: true,
  firstAid: true,
  jack: true,
  bulbs: true,
  triangle: true,
  spareWheel: true,
  fireExtinguisher: true,
  radio: true,
  antenna: true,
});

export const defaultRentalCondition = (): RentalCondition => ({
  cleanOut: true,
  damageNotesOut: '',
  equipment: defaultRentalEquipment(),
});

// Soft-delete marker stored in vehicle notes because the Supabase check
// constraint on the status column does not allow a 'deleted' value yet.
export const VEHICLE_DELETED_MARKER = '__DELETED__';

export function isDeletedVehicle(vehicle: { notes?: string }): boolean {
  return vehicle.notes?.startsWith(VEHICLE_DELETED_MARKER) ?? false;
}

export function markVehicleDeleted(notes?: string): string {
  if (isDeletedVehicle({ notes })) return notes || VEHICLE_DELETED_MARKER;
  return VEHICLE_DELETED_MARKER + (notes || '');
}

export function unmarkVehicleDeleted(notes?: string): string | undefined {
  if (!notes) return undefined;
  if (notes.startsWith(VEHICLE_DELETED_MARKER)) {
    const rest = notes.slice(VEHICLE_DELETED_MARKER.length);
    return rest || undefined;
  }
  return notes;
}
