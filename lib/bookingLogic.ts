import { differenceInDays, parseISO } from 'date-fns';

export const ROOM_TYPES = {
  LUXURY: { name: 'Luxury', price: 300 },
  SUITE: { name: 'Suite', price: 200 },
  DELUXE: { name: 'Deluxe', price: 150 },
};

export const ADDONS = {
  BREAKFAST: { name: 'Breakfast', price: 25 },
  SPA: { name: 'Spa Package', price: 50 },
  LATE_CHECKOUT: { name: 'Late Check-out', price: 30 },
};

export interface BookingData {
  roomType: keyof typeof ROOM_TYPES;
  checkIn: string;
  checkOut: string;
  selectedAddons: (keyof typeof ADDONS)[];
}

export function calculateTotalPrice(data: BookingData): number {
  const { roomType, checkIn, checkOut, selectedAddons } = data;
  
  const startDate = parseISO(checkIn);
  const endDate = parseISO(checkOut);
  const nights = Math.max(1, differenceInDays(endDate, startDate));
  
  const roomRate = ROOM_TYPES[roomType].price;
  let total = roomRate * nights;
  
  selectedAddons.forEach((addonKey) => {
    const addon = ADDONS[addonKey];
    if (addonKey === 'BREAKFAST') {
      total += addon.price * nights; // per night
    } else {
      total += addon.price; // one-time
    }
  });
  
  return total;
}

export async function checkAvailability(roomType: string, checkIn: string, checkOut: string): Promise<boolean> {
  // Simulate room availability check
  // Randomly return false 10% of the time to demonstrate handling of unavailable rooms
  return Math.random() > 0.1;
}
