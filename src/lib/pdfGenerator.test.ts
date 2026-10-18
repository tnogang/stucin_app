import { describe, it, expect } from "vitest";
import { generatePreRentalPdf, generatePostRentalPdf } from "./pdfGenerator";
import type { RentalOrder, RentVehicle } from "@/types/rent";

const mockVehicle: RentVehicle = {
  id: "veh-1",
  make: "Volkswagen",
  model: "Golf",
  type: "kombi",
  year: 2020,
  licensePlate: "LJ-123-AB",
  vin: "WVWZZZ...",
  color: "siva",
  registrationExpiry: "2027-01-15",
  currentKm: 50000,
  fuelLevel: 75,
  status: "available",
  notes: "",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

const mockOrder: RentalOrder = {
  id: "order-1",
  vehicleId: "veh-1",
  status: "returned",
  customer: {
    fullName: "Janez Novak",
    address: "Vipavska cesta 10, 5271 Vipava",
    phone: "040 123 456",
    email: "janez@email.com",
    driverLicense: "12345678",
    idNumber: "1234567890",
    emso: "0105961500123",
    taxNumber: "12345678",
    authorizedDriver: "Janez Novak",
  },
  rental: {
    startDate: "2026-07-05T10:00",
    expectedReturnDate: "2026-07-06T10:00",
    actualReturnDate: "2026-07-06T09:30",
    startKm: 50000,
    returnKm: 50150,
    pickupLocation: "Vipava",
    returnLocation: "Vipava",
    dailyRate: 49.9,
    totalPrice: 149.7,
    deposit: 200,
    fuelLevelOut: 75,
    fuelLevelIn: 50,
    personalInsurance: true,
    kaskoInsurance: false,
    delivery: false,
    deliveryWithTow: false,
    deliveryLocation: "",
    pickup: true,
    pickupWithTow: false,
  },
  condition: {
    cleanOut: true,
    cleanIn: true,
    damageNotesOut: "Brez poškodb",
    damageNotesIn: "Brez poškodb",
    equipment: {
      documents: true,
      firstAid: true,
      jack: true,
      bulbs: true,
      triangle: true,
      spareWheel: true,
      fireExtinguisher: true,
      radio: true,
      antenna: true,
    },
  },
  signatures: {},
  documents: {},
  createdAt: "2026-07-05T10:00:00Z",
  updatedAt: "2026-07-06T09:30:00Z",
};

describe("pdfGenerator", () => {
  it("generates a pre-rental PDF data URL", async () => {
    const dataUrl = await generatePreRentalPdf(mockOrder, mockVehicle);
    expect(dataUrl).toMatch(/^data:application\/pdf;/);
    expect(dataUrl.length).toBeGreaterThan(1000);
  });

  it("generates a post-rental PDF data URL", async () => {
    const dataUrl = await generatePostRentalPdf(mockOrder, mockVehicle);
    expect(dataUrl).toMatch(/^data:application\/pdf;/);
    expect(dataUrl.length).toBeGreaterThan(1000);
  });
});
