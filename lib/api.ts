export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  // Base URL for images is the API base URL without the /api/v1 part
  const baseUrl = API_BASE_URL.replace('/api/v1', '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export async function fetchOptions() {
  const response = await fetch(`${API_BASE_URL}/options`);
  if (!response.ok) throw new Error('Failed to fetch options');
  return response.json();
}

export async function fetchPricing(roomType: string, month: number, year: number) {
  const response = await fetch(`${API_BASE_URL}/pricing?room_type=${roomType}&month=${month}&year=${year}`);
  if (!response.ok) throw new Error('Failed to fetch pricing');
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

export async function subscribeToShoreClub(email: string) {
  const response = await fetch(`${API_BASE_URL}/subscribers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error('Failed to subscribe');
  return response.json();
}
