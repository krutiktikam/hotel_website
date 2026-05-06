import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { calculateTotalPrice, checkAvailability, BookingData } from '@/lib/bookingLogic';
import { sendWhatsAppConfirmation } from '@/lib/whatsapp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, roomType, checkIn, checkOut, selectedAddons } = body;

    // 1. Validate Input
    if (!customerName || !customerPhone || !roomType || !checkIn || !checkOut) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Check Availability (Simulated)
    const isAvailable = await checkAvailability(roomType, checkIn, checkOut);
    if (!isAvailable) {
      return NextResponse.json({ error: 'Room not available for selected dates' }, { status: 409 });
    }

    // 3. Calculate Total Price (Server-side validation)
    const bookingData: BookingData = { roomType, checkIn, checkOut, selectedAddons };
    const totalPrice = calculateTotalPrice(bookingData);

    // 4. Save to Database
    const stmt = db.prepare(`
      INSERT INTO bookings (customer_name, customer_phone, room_type, check_in, check_out, addons, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      customerName,
      customerPhone,
      roomType,
      checkIn,
      checkOut,
      JSON.stringify(selectedAddons),
      totalPrice
    );

    // 5. Trigger WhatsApp Notification
    await sendWhatsAppConfirmation(
      customerPhone,
      customerName,
      roomType,
      checkIn,
      checkOut,
      totalPrice
    );

    return NextResponse.json({
      success: true,
      bookingId: info.lastInsertRowid,
      totalPrice,
    });
  } catch (error) {
    console.error('Booking API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
