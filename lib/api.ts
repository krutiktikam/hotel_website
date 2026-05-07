const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchOptions() {
  const response = await fetch(`${API_BASE_URL}/options`);
  if (!response.ok) throw new Error('Failed to fetch options');
  return response.json();
}

export async function checkAvailability(params: {
  room_type: string;
  check_in: string;
  check_out: string;
}) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/availability?${query}`);
  if (!response.ok) throw new Error('Failed to check availability');
  return response.json();
}

export async function createBooking(data: any) {
  // Map frontend camelCase to backend snake_case
  const backendData = {
    customer_name: data.customerName,
    customer_phone: data.customerPhone,
    check_in: data.checkIn,
    check_out: data.checkOut,
    room_type: data.roomType,
    meal_plan: data.mealPlan,
    package_type: data.packageType,
    selected_addons: data.selectedAddons || [],
    special_requests: data.specialRequests
  };

  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backendData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Backend Error Details:', errorData);
    // Extract a human-readable message from FastAPI validation errors
    const detail = errorData.detail;
    let message = 'Failed to create booking';
    if (Array.isArray(detail)) {
      message = detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join(', ');
    } else if (typeof detail === 'string') {
      message = detail;
    }
    throw new Error(message);
  }
  return response.json();
}

export async function createCheckoutSession(bookingId: number) {
  const response = await fetch(`${API_BASE_URL}/checkout/session?booking_id=${bookingId}`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to create checkout session');
  return response.json();
}
