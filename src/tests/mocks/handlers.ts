import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:3000';

// Mock data
const mockItems = [
  {
    _id: 'item-1',
    name: { en: 'Recording Studio A', he: 'אולפן הקלטות A' },
    description: { en: 'Professional recording studio', he: 'אולפן הקלטות מקצועי' },
    price: 200,
    pricePer: 'hour',
    studioId: 'studio-1',
    studioName: { en: 'Music Studio', he: 'סטודיו מוזיקה' },
    availability: [
      { date: '25/01/2026', times: ['10:00', '11:00', '12:00', '14:00', '15:00'] }
    ],
    instantBook: true,
    inStock: true,
  },
  {
    _id: 'item-2',
    name: { en: 'Mixing Room', he: 'חדר מיקס' },
    description: { en: 'Professional mixing room', he: 'חדר מיקס מקצועי' },
    price: 150,
    pricePer: 'hour',
    studioId: 'studio-1',
    studioName: { en: 'Music Studio', he: 'סטודיו מוזיקה' },
    availability: [
      { date: '25/01/2026', times: ['09:00', '10:00', '11:00', '13:00', '14:00'] }
    ],
    instantBook: true,
    inStock: true,
  },
];

const mockStudios = [
  {
    _id: 'studio-1',
    name: { en: 'Music Studio', he: 'סטודיו מוזיקה' },
    description: { en: 'Professional music studio', he: 'סטודיו מוזיקה מקצועי' },
    city: 'Tel Aviv',
    address: '123 Music Street',
    categories: ['Recording Studio'],
    active: true,
    items: [{ itemId: 'item-1' }, { itemId: 'item-2' }],
  },
];

const mockUser = {
  _id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'vendor',
  subscriptionStatus: 'ACTIVE',
};

export const handlers = [
  // Items
  http.get(`${API_BASE}/api/items`, () => {
    return HttpResponse.json(mockItems);
  }),

  http.get(`${API_BASE}/api/items/:itemId`, ({ params }) => {
    const item = mockItems.find(i => i._id === params.itemId);
    if (!item) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(item);
  }),

  // Studios
  http.get(`${API_BASE}/api/studios`, () => {
    return HttpResponse.json(mockStudios);
  }),

  http.get(`${API_BASE}/api/studios/:studioId`, ({ params }) => {
    const studio = mockStudios.find(s => s._id === params.studioId);
    if (!studio) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(studio);
  }),

  // User
  http.get(`${API_BASE}/api/users/me`, () => {
    return HttpResponse.json(mockUser);
  }),

  http.get(`${API_BASE}/api/users/:userId`, ({ params }) => {
    if (params.userId === 'user-1') {
      return HttpResponse.json(mockUser);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Cart
  http.get(`${API_BASE}/api/cart/:userId`, () => {
    return HttpResponse.json({
      _id: 'cart-1',
      userId: 'user-1',
      items: [],
    });
  }),

  // Reservations
  http.post(`${API_BASE}/api/reservations`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown> | null;
    return HttpResponse.json({
      _id: 'reservation-1',
      ...(body && typeof body === 'object' ? body : {}),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),

  http.get(`${API_BASE}/api/reservations`, () => {
    return HttpResponse.json([]);
  }),

  // Bookings
  http.post(`${API_BASE}/api/bookings/reserve-time-slots/`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown> | null;
    return HttpResponse.json({
      _id: 'booking-1',
      ...(body && typeof body === 'object' ? body : {}),
      status: 'confirmed',
    });
  }),
];
