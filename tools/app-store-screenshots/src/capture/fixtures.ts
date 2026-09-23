import type { AuthState, CaptureScenario } from '../config/types.js';

const STUDIO_ID = 'studio-demo';
const ITEM_ID = 'item-demo';
const VENDOR_ID = '6645d783a319b216a0277e85';

const studio = {
  _id: STUDIO_ID,
  name: { en: 'Tempo Studios', he: 'אולפני טמפו' },
  subtitle: { en: 'Recording, mixing and podcast production', he: 'הקלטה, מיקס והפקת פודקאסטים' },
  description: {
    en: 'A warm, beautifully designed creative space in Tel Aviv with an experienced team and a workflow built around great sound.',
    he: 'מרחב יצירתי חם ומעוצב בתל אביב עם צוות מנוסה ותהליך עבודה שנבנה סביב סאונד מצוין.'
  },
  categories: ['Recording Studio', 'Podcast Studio'],
  subCategories: ['Recording', 'Mixing', 'Podcast'],
  genres: ['Pop', 'Indie', 'Electronic', 'Hip Hop'],
  amenities: ['Control room', 'Live room', 'Kitchen', 'Fast Wi-Fi'],
  equipment: [
    { category: 'Monitoring', items: 'Genelec 8351B\nNeumann KH 310' },
    { category: 'Microphones', items: 'Neumann U87\nShure SM7B\nAKG C414' }
  ],
  averageRating: 4.9,
  reviewCount: 48,
  totalBookings: 326,
  maxOccupancy: 8,
  size: 74,
  isSmokingAllowed: false,
  city: 'Tel Aviv',
  address: 'Florentin, Tel Aviv',
  phone: '+972 50 555 0198',
  lat: 32.055,
  lng: 34.77,
  isWheelchairAccessible: true,
  coverImage: '/images/screenshots/tempo-studios-real.webp',
  galleryImages: [
    '/images/screenshots/tempo-studios-real.webp',
    '/images/screenshots/tempo-studios-console.webp',
    '/images/screenshots/tempo-studios-live-room.webp',
    '/images/screenshots/tempo-studios-vocal-setup.webp',
    '/images/screenshots/tempo-studios-podcast-room.webp'
  ],
  portfolio: [
    {
      id: 'portfolio-neon-tides',
      title: 'Neon Tides',
      artist: 'Lia North',
      type: 'audio',
      coverUrl: '/images/screenshots/northline-track-neon-tides.webp',
      link: 'https://soundcloud.com/',
      role: 'Recorded & Mixed'
    },
    {
      id: 'portfolio-paper-planes',
      title: 'Paper Planes',
      artist: 'The Quiet Hours',
      type: 'audio',
      coverUrl: '/images/screenshots/northline-track-paper-planes.webp',
      link: 'https://open.spotify.com/',
      role: 'Produced'
    },
    {
      id: 'portfolio-after-hours',
      title: 'After Hours',
      artist: 'Maya Sol',
      type: 'album',
      coverUrl: '/images/screenshots/northline-track-after-hours.webp',
      link: 'https://music.apple.com/',
      role: 'Mixed & Mastered'
    }
  ],
  socialLinks: {
    spotify: 'https://open.spotify.com/',
    soundcloud: 'https://soundcloud.com/',
    instagram: 'https://instagram.com/',
    website: 'https://studioz.co.il/'
  },
  isSelfService: false,
  parking: 'street',
  arrivalInstructions: 'Entrance from the quiet courtyard.',
  cancellationPolicy: { type: 'moderate', houseRules: { en: 'Please arrive ten minutes before your session.' } },
  createdAt: '2026-01-15T09:00:00.000Z',
  createdBy: VENDOR_ID,
  isFeatured: true,
  active: true,
  paymentEnabled: true,
  is24Hours: false,
  studioAvailability: {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    times: [{ start: '09:00', end: '23:00' }]
  },
  items: [
    {
      idx: 0,
      itemId: ITEM_ID,
      studioId: STUDIO_ID,
      name: { en: 'Recording Session', he: 'סשן הקלטה' },
      active: true,
      price: 320,
      categories: ['Recording Studio'],
      subCategories: ['Recording']
    }
  ]
};

const item = {
  _id: ITEM_ID,
  studio: STUDIO_ID,
  studioId: STUDIO_ID,
  name: { en: 'Recording Session', he: 'סשן הקלטה' },
  description: {
    en: 'A focused recording session with an experienced engineer, premium microphones and a comfortable live room.',
    he: 'סשן הקלטה ממוקד עם טכנאי מנוסה, מיקרופונים איכותיים וחדר הקלטה נוח.'
  },
  studioName: studio.name,
  address: studio.address,
  city: studio.city,
  categories: ['Recording Studio'],
  subCategories: ['Recording'],
  genres: ['Pop', 'Indie', 'Hip Hop'],
  price: 320,
  pricePer: 'hour',
  imageUrl: studio.coverImage,
  inStock: true,
  studioImgUrl: studio.coverImage,
  createdBy: VENDOR_ID,
  createdAt: '2026-01-15T09:00:00.000Z',
  instantBook: true,
  minimumBookingDuration: { value: 2, unit: 'hours' },
  preparationTime: { value: 15, unit: 'minutes' },
  active: true,
  availability: [
    { date: '22/09/2026', times: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'] },
    { date: '23/09/2026', times: ['09:00', '10:00', '13:00', '14:00', '17:00'] }
  ]
};

const vendorUser = {
  _id: VENDOR_ID,
  sub: 'auth0|studioz-screenshots',
  name: 'Maya Cohen',
  email: 'maya@northlinesound.example',
  role: 'vendor',
  studios: [STUDIO_ID],
  subscriptionStatus: 'ACTIVE',
  sumitCompanyId: 'demo-company',
  picture: ''
};

const customerUser = {
  _id: 'customer-demo',
  sub: 'auth0|studioz-customer',
  name: 'Daniel Levi',
  email: 'daniel@example.test',
  role: 'customer',
  studios: []
};

const reservations = [
  {
    _id: 'reservation-1',
    studioId: STUDIO_ID,
    itemId: ITEM_ID,
    customerId: customerUser._id,
    customerName: customerUser.name,
    studioName: studio.name,
    itemName: item.name,
    bookingDate: '24/09/2026',
    timeSlots: ['10:00', '11:00'],
    startTime: '10:00',
    endTime: '12:00',
    price: 640,
    status: 'confirmed',
    createdAt: '2026-09-20T11:30:00.000Z'
  },
  {
    _id: 'reservation-2',
    studioId: STUDIO_ID,
    itemId: ITEM_ID,
    customerId: 'customer-two',
    customerName: 'Noa Shaham',
    studioName: studio.name,
    itemName: item.name,
    bookingDate: '25/09/2026',
    timeSlots: ['15:00', '16:00', '17:00'],
    startTime: '15:00',
    endTime: '18:00',
    price: 960,
    status: 'pending',
    createdAt: '2026-09-21T08:15:00.000Z'
  }
];

const merchantDocuments = [
  {
    id: 'document-1',
    externalId: 'sumit-document-1',
    number: 'INV-2026-0918',
    type: 'invoice',
    studioId: STUDIO_ID,
    studioName: 'Tempo Studios',
    amount: 2800,
    currency: 'ILS',
    date: '2026-09-18',
    dueDate: '2026-09-28',
    status: 'paid',
    customerName: 'Daniel Levi',
    customerEmail: 'daniel@example.test'
  }
];

const projects = [
  {
    _id: 'project-demo',
    title: 'Midnight Drive — Final Mix',
    brief: 'Final mix and mastering for a four-track electronic EP.',
    customerId: customerUser,
    vendorId: vendorUser,
    studioId: studio,
    itemId: item,
    itemName: item.name,
    studioName: studio.name,
    price: 2800,
    depositPaid: true,
    finalPaid: false,
    estimatedDeliveryDays: 7,
    deadline: '2026-09-29T18:00:00.000Z',
    revisionsIncluded: 2,
    revisionsUsed: 1,
    paymentStatus: 'deposit_paid',
    status: 'in_progress',
    artworkUrl: '/images/screenshots/midnight-drive-artwork.webp',
    createdAt: '2026-09-18T10:00:00.000Z',
    updatedAt: '2026-09-22T08:00:00.000Z'
  }
];

const projectFiles = [
  {
    _id: 'source-midnight-drive',
    projectId: 'project-demo',
    uploadedBy: customerUser,
    type: 'source',
    fileName: 'Midnight Drive — Multitrack.wav',
    fileSize: 187_420_672,
    mimeType: 'audio/wav',
    storageKey: 'screenshots/projects/source-midnight-drive.wav',
    description: 'Consolidated stems at 48 kHz / 24-bit',
    waveformStatus: 'ready',
    createdAt: '2026-09-18T12:20:00.000Z'
  },
  {
    _id: 'source-vocal',
    projectId: 'project-demo',
    uploadedBy: customerUser,
    type: 'source',
    fileName: 'Lead Vocal — Comp 04.wav',
    fileSize: 64_225_280,
    mimeType: 'audio/wav',
    storageKey: 'screenshots/projects/lead-vocal.wav',
    waveformStatus: 'ready',
    createdAt: '2026-09-18T12:24:00.000Z'
  },
  {
    _id: 'deliverable-mix-v3',
    projectId: 'project-demo',
    uploadedBy: vendorUser,
    type: 'deliverable',
    fileName: 'Midnight Drive — Mix V3.wav',
    fileSize: 92_340_224,
    mimeType: 'audio/wav',
    storageKey: 'screenshots/projects/mix-v3.wav',
    description: 'Latest full-resolution mix',
    waveformStatus: 'ready',
    createdAt: '2026-09-21T17:15:00.000Z'
  },
  {
    _id: 'deliverable-reference',
    projectId: 'project-demo',
    uploadedBy: vendorUser,
    type: 'deliverable',
    fileName: 'Midnight Drive — Mix V3 Reference.mp3',
    fileSize: 10_485_760,
    mimeType: 'audio/mpeg',
    storageKey: 'screenshots/projects/mix-v3-reference.mp3',
    waveformStatus: 'ready',
    createdAt: '2026-09-21T17:16:00.000Z'
  },
  {
    _id: 'revision-v2',
    projectId: 'project-demo',
    uploadedBy: vendorUser,
    type: 'revision',
    fileName: 'Midnight Drive — Revision 2.wav',
    fileSize: 89_128_960,
    mimeType: 'audio/wav',
    storageKey: 'screenshots/projects/revision-2.wav',
    revisionNumber: 2,
    waveformStatus: 'ready',
    createdAt: '2026-09-20T15:40:00.000Z'
  }
];

const projectMessages = [
  {
    _id: 'message-general-1',
    projectId: 'project-demo',
    senderId: customerUser,
    senderRole: 'customer',
    message: 'The direction feels great. Can we give the chorus a little more width?',
    readAt: '2026-09-21T18:10:00.000Z',
    createdAt: '2026-09-21T17:48:00.000Z'
  },
  {
    _id: 'message-general-2',
    projectId: 'project-demo',
    senderId: vendorUser,
    senderRole: 'vendor',
    message: 'Absolutely — I widened the synth bus and kept the vocal centered.',
    readAt: '2026-09-21T18:25:00.000Z',
    createdAt: '2026-09-21T18:14:00.000Z'
  },
  {
    _id: 'message-general-3',
    projectId: 'project-demo',
    senderId: {
      _id: 'collaborator-vendor-1',
      name: 'Amir Halevi',
      email: 'amir@northlinesound.example'
    },
    senderRole: 'vendor_collaborator',
    message: 'I also cleaned the low end before the final limiter pass.',
    readAt: '2026-09-22T08:10:00.000Z',
    createdAt: '2026-09-22T08:04:00.000Z'
  },
  {
    _id: 'message-track-1',
    projectId: 'project-demo',
    senderId: customerUser,
    senderRole: 'customer',
    message: 'Could the vocal delay come in one beat later here?',
    fileId: 'source-midnight-drive',
    offsetSeconds: 47.2,
    readAt: '2026-09-21T13:00:00.000Z',
    createdAt: '2026-09-21T12:42:00.000Z'
  },
  {
    _id: 'message-track-reply-1',
    projectId: 'project-demo',
    senderId: vendorUser,
    senderRole: 'vendor',
    message: 'Done — it now starts after the first phrase.',
    fileId: 'source-midnight-drive',
    parentId: 'message-track-1',
    offsetSeconds: 47.2,
    readAt: '2026-09-21T13:20:00.000Z',
    createdAt: '2026-09-21T13:08:00.000Z'
  },
  {
    _id: 'message-track-2',
    projectId: 'project-demo',
    senderId: customerUser,
    senderRole: 'customer',
    message: 'Love this transition. The impact lands perfectly now.',
    fileId: 'source-midnight-drive',
    offsetSeconds: 92.8,
    resolvedAt: '2026-09-22T07:50:00.000Z',
    resolvedBy: customerUser,
    readAt: '2026-09-22T07:50:00.000Z',
    createdAt: '2026-09-21T16:30:00.000Z'
  }
];

export function getUserFixture(auth: AuthState): Record<string, unknown> | null {
  if (auth === 'vendor') return vendorUser;
  if (auth === 'customer') return customerUser;
  return null;
}

export interface FixtureResponse {
  status: number;
  body: unknown;
  contentType?: string;
}

function json(body: unknown, status = 200): FixtureResponse {
  return { status, body, contentType: 'application/json' };
}

export function resolveFixtureRequest(
  method: string,
  requestUrl: string,
  scenario: CaptureScenario
): FixtureResponse | null {
  const url = new URL(requestUrl);
  const path = url.pathname.replace(/^\/api/, '');

  if (method === 'GET' && (path === '/studios' || path === '/studios/')) return json([studio]);
  if (method === 'GET' && path === `/studios/${STUDIO_ID}`) {
    return json({ currStudio: studio, prevStudio: null, nextStudio: null, vendorCredentials: null });
  }
  if (method === 'GET' && path === '/items') return json([item]);
  if (method === 'GET' && path === `/items/${ITEM_ID}`) return json(item);
  if (method === 'GET' && path === '/reservations') {
    return json({
      reservations,
      pagination: { page: 1, limit: 100, total: reservations.length, totalPages: 1 }
    });
  }
  if (method === 'GET' && path.startsWith('/reservations/studio/')) return json(reservations);
  if (method === 'GET' && /^\/reservations\/[^/]+$/.test(path)) {
    return json(reservations.find((reservation) => path.endsWith(reservation._id)) ?? null);
  }
  if (method === 'GET' && path.startsWith('/cart/')) {
    return json({ _id: 'cart-demo', userId: getUserFixture(scenario.auth)?._id ?? 'guest', items: [] });
  }
  if (method === 'GET' && path === '/remote-projects') {
    return json({
      projects,
      pagination: { page: 1, limit: 20, total: projects.length, totalPages: 1 }
    });
  }
  if (method === 'GET' && path === '/remote-projects/project-demo') {
    return json({
      project: projects[0],
      fileCounts: { source: 2, deliverable: 2, revision: 1 },
      access: {
        side: 'vendor',
        isPrimary: true,
        isCollaborator: false,
        senderRole: 'vendor',
        canInvite: true,
        canPay: false,
        canCustomerWorkflow: false,
        canVendorWorkflow: true,
        canUpdateMetadata: true,
        canUpdateArtwork: true,
        canChat: true,
        canFiles: true,
        canDownloadDeliverables: true,
        canManageDownloadLock: true
      },
      deliverablesLocked: false
    });
  }
  if (method === 'GET' && path === '/remote-projects/invites/pending') return json([]);
  if (method === 'GET' && path === '/remote-projects/project-demo/files') {
    const type = url.searchParams.get('type');
    return json({ files: type ? projectFiles.filter((file) => file.type === type) : projectFiles });
  }
  if (method === 'GET' && /^\/remote-projects\/project-demo\/files\/[^/]+\/waveform$/.test(path)) {
    const fileId = path.split('/')[4];
    return json({
      fileId,
      status: 'ready',
      peaks: Array.from({ length: 160 }, (_, index) => 40 + ((index * 47 + index * index * 7) % 205)),
      durationMs: 214_000,
      sampleRate: 48_000,
      channels: 2,
      version: 1
    });
  }
  if (method === 'GET' && path === '/remote-projects/project-demo/collaborators') {
    return json({
      collaborators: [
        {
          userId: {
            _id: 'collaborator-vendor-1',
            name: 'Amir Halevi',
            email: 'amir@northlinesound.example'
          },
          side: 'vendor',
          invitedBy: vendorUser,
          joinedAt: '2026-09-19T09:30:00.000Z',
          status: 'active'
        },
        {
          userId: {
            _id: 'collaborator-customer-1',
            name: 'Noa Shaham',
            email: 'noa@example.test'
          },
          side: 'customer',
          invitedBy: customerUser,
          joinedAt: '2026-09-19T11:15:00.000Z',
          status: 'active'
        }
      ],
      pendingInvites: [
        {
          _id: 'invite-demo-1',
          projectId: 'project-demo',
          email: 'ron@northlinesound.example',
          side: 'vendor',
          invitedBy: vendorUser,
          status: 'pending',
          expiresAt: '2026-09-29T10:00:00.000Z',
          createdAt: '2026-09-22T10:00:00.000Z'
        }
      ]
    });
  }
  if (method === 'GET' && path.includes('/messages')) {
    return json({
      messages: projectMessages,
      pagination: { page: 1, limit: 300, total: projectMessages.length, pages: 1 }
    });
  }
  if (method === 'GET' && path.startsWith('/notifications/unread-count')) return json({ count: 2 });
  if (method === 'GET' && path.startsWith('/notifications')) return json([]);
  if (method === 'GET' && path === '/merchant/documents') {
    return json({
      documents: merchantDocuments,
      stats: { totalRevenue: 2800, pendingAmount: 0, overdueAmount: 0, totalDocs: 1 },
      pagination: { total: 1, page: 1, limit: 50, pages: 1 }
    });
  }
  if (method === 'GET' && path.includes('/saved-cards')) return json([]);
  if (method === 'GET' && path === '/google-calendar/status') return json({ connected: true });
  if (method === 'GET' && path.startsWith('/wishlists')) return json([]);
  if (method === 'GET' && path === `/studios/${STUDIO_ID}/files`) return json([]);
  if (method === 'GET' && path === `/add-ons/item/${ITEM_ID}`) return json([]);
  if (method === 'GET' && path.startsWith('/studio-files/')) return json([]);

  return null;
}
