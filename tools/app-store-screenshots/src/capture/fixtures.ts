import type { AuthState, CaptureScenario } from '../config/types.js';

const STUDIO_ID = 'studio-demo';
const ITEM_ID = 'item-demo';
const VENDOR_ID = '6645d783a319b216a0277e85';

/** Local SVG avatars — screenshot capture blocks external hosts like randomuser.me. */
function fixtureAvatar(seed: string, initials: string): string {
  const hues = [18, 32, 48, 160, 200, 265, 300, 340];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = hues[hash % hues.length];
  const bg = `hsl(${hue} 42% 32%)`;
  const fg = `hsl(${hue} 55% 92%)`;
  const label = initials.slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="64" fill="${bg}"/>
  <text x="64" y="64" dy="0.36em" text-anchor="middle" font-family="system-ui,sans-serif" font-size="52" font-weight="700" fill="${fg}">${label}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;
}

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
    },
    {
      idx: 1,
      itemId: 'item-mixing',
      studioId: STUDIO_ID,
      name: { en: 'Mixing Session', he: 'סשן מיקס' },
      active: true,
      price: 280,
      categories: ['Recording Studio'],
      subCategories: ['Mixing']
    },
    {
      idx: 2,
      itemId: 'item-mastering',
      studioId: STUDIO_ID,
      name: { en: 'Mastering', he: 'מאסטרינג' },
      active: true,
      price: 450,
      categories: ['Recording Studio'],
      subCategories: ['Mixing']
    },
    {
      idx: 3,
      itemId: 'item-podcast',
      studioId: STUDIO_ID,
      name: { en: 'Podcast Production', he: 'הפקת פודקאסט' },
      active: true,
      price: 260,
      categories: ['Podcast Studio'],
      subCategories: ['Podcast']
    },
    {
      idx: 4,
      itemId: 'item-remote-mix',
      studioId: STUDIO_ID,
      name: { en: 'Remote Mix Project', he: 'פרויקט מיקס מרחוק' },
      active: true,
      price: 1800,
      categories: ['Recording Studio'],
      subCategories: ['Mixing']
    }
  ]
};

const availabilitySlots = [
  { date: '22/09/2026', times: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'] },
  { date: '23/09/2026', times: ['09:00', '10:00', '13:00', '14:00', '17:00'] }
];

function buildItem(partial: {
  _id: string;
  name: { en: string; he: string };
  description: { en: string; he: string };
  categories: string[];
  subCategories: string[];
  genres: string[];
  price: number;
  pricePer: 'hour' | 'project';
  instantBook: boolean;
  minimumBookingDuration: { value: number; unit: 'hours' };
  imageUrl?: string;
}) {
  return {
    studio: STUDIO_ID,
    studioId: STUDIO_ID,
    studioName: studio.name,
    address: studio.address,
    city: studio.city,
    inStock: true,
    studioImgUrl: studio.coverImage,
    createdBy: VENDOR_ID,
    createdAt: '2026-01-15T09:00:00.000Z',
    preparationTime: { value: 15, unit: 'minutes' },
    active: true,
    availability: availabilitySlots,
    imageUrl: partial.imageUrl ?? studio.coverImage,
    ...partial
  };
}

const item = buildItem({
  _id: ITEM_ID,
  name: { en: 'Recording Session', he: 'סשן הקלטה' },
  description: {
    en: 'A focused recording session with an experienced engineer, premium microphones and a comfortable live room.',
    he: 'סשן הקלטה ממוקד עם טכנאי מנוסה, מיקרופונים איכותיים וחדר הקלטה נוח.'
  },
  categories: ['Recording Studio'],
  subCategories: ['Recording'],
  genres: ['Pop', 'Indie', 'Hip Hop'],
  price: 320,
  pricePer: 'hour',
  instantBook: true,
  minimumBookingDuration: { value: 2, unit: 'hours' }
});

const items = [
  item,
  buildItem({
    _id: 'item-mixing',
    name: { en: 'Mixing Session', he: 'סשן מיקס' },
    description: {
      en: 'Hands-on mixing time in the control room with reference monitoring and recall-ready sessions.',
      he: 'זמן מיקס בחדר הבקרה עם מוניטורינג מדויק וסשנים מוכנים לריקול.'
    },
    categories: ['Recording Studio'],
    subCategories: ['Mixing'],
    genres: ['Pop', 'Electronic', 'Indie'],
    price: 280,
    pricePer: 'hour',
    instantBook: true,
    minimumBookingDuration: { value: 3, unit: 'hours' },
    imageUrl: '/images/screenshots/tempo-studios-console.webp'
  }),
  buildItem({
    _id: 'item-mastering',
    name: { en: 'Mastering', he: 'מאסטרינג' },
    description: {
      en: 'Final polish for singles and EPs with loudness-ready delivery for streaming platforms.',
      he: 'גימור סופי לסינגלים ול־EP עם מסירה מוכנה לסטרים.'
    },
    categories: ['Recording Studio'],
    subCategories: ['Mixing'],
    genres: ['Pop', 'Hip Hop', 'Electronic'],
    price: 450,
    pricePer: 'hour',
    instantBook: false,
    minimumBookingDuration: { value: 2, unit: 'hours' },
    imageUrl: '/images/screenshots/tempo-studios-console.webp'
  }),
  buildItem({
    _id: 'item-podcast',
    name: { en: 'Podcast Production', he: 'הפקת פודקאסט' },
    description: {
      en: 'Multi-guest podcast capture with isolated mics, clean routing and same-day rough edits.',
      he: 'הקלטת פודקאסט למספר אורחים עם מיקרופונים מבודדים ועריכה גסה באותו יום.'
    },
    categories: ['Podcast Studio'],
    subCategories: ['Podcast'],
    genres: ['Talk', 'Interview'],
    price: 260,
    pricePer: 'hour',
    instantBook: true,
    minimumBookingDuration: { value: 2, unit: 'hours' },
    imageUrl: '/images/screenshots/tempo-studios-vocal-setup.webp'
  }),
  buildItem({
    _id: 'item-remote-mix',
    name: { en: 'Remote Mix Project', he: 'פרויקט מיקס מרחוק' },
    description: {
      en: 'Send stems, get timed feedback and revisions in a connected remote project workspace.',
      he: 'שולחים סטמים, מקבלים פידבק מתוזמן ותיקונים בסביבת פרויקט מרוחקת.'
    },
    categories: ['Recording Studio'],
    subCategories: ['Mixing'],
    genres: ['Pop', 'Indie', 'Electronic'],
    price: 1800,
    pricePer: 'project',
    instantBook: false,
    minimumBookingDuration: { value: 1, unit: 'hours' },
    imageUrl: '/images/screenshots/tempo-studios-live-room.webp'
  })
];

const vendorUser = {
  _id: VENDOR_ID,
  sub: 'auth0|studioz-screenshots',
  name: 'Maya Cohen',
  email: 'maya@northlinesound.example',
  role: 'vendor',
  studios: [STUDIO_ID],
  subscriptionStatus: 'ACTIVE',
  sumitCompanyId: 'demo-company',
  picture: fixtureAvatar('maya-cohen', 'MC')
};

const customerUser = {
  _id: 'customer-demo',
  sub: 'auth0|studioz-customer',
  name: 'Daniel Levi',
  email: 'daniel@example.test',
  role: 'customer',
  studios: [],
  picture: fixtureAvatar('daniel-levi', 'DL')
};

const collabAmir = {
  _id: 'collaborator-vendor-1',
  name: 'Amir Halevi',
  email: 'amir@northlinesound.example',
  picture: fixtureAvatar('amir-halevi', 'AH')
};
const collabNoa = {
  _id: 'collaborator-customer-1',
  name: 'Noa Shaham',
  email: 'noa@example.test',
  picture: fixtureAvatar('noa-shaham', 'NS')
};
const collabEitan = {
  _id: 'collaborator-vendor-2',
  name: 'Eitan Mizrahi',
  email: 'eitan@example.test',
  picture: fixtureAvatar('eitan-mizrahi', 'EM')
};
const collabShira = {
  _id: 'collaborator-customer-2',
  name: 'Shira Ben-Ami',
  email: 'shira@example.test',
  picture: fixtureAvatar('shira-ben-ami', 'SB')
};

function activeCollab(
  userId: { _id: string; name: string; email: string; picture?: string },
  side: 'vendor' | 'customer',
  joinedAt: string
) {
  return {
    userId,
    side,
    invitedBy: side === 'vendor' ? vendorUser : customerUser,
    joinedAt,
    status: 'active' as const
  };
}

const reservationSeed = [
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
    itemName: { en: 'Mixing Session', he: 'סשן מיקס' },
    bookingDate: '25/09/2026',
    timeSlots: ['15:00', '16:00', '17:00'],
    startTime: '15:00',
    endTime: '18:00',
    price: 960,
    status: 'confirmed',
    createdAt: '2026-09-21T08:15:00.000Z'
  },
  {
    _id: 'reservation-3',
    studioId: STUDIO_ID,
    itemId: ITEM_ID,
    customerId: 'customer-three',
    customerName: 'Yael Cohen',
    studioName: studio.name,
    itemName: item.name,
    bookingDate: '27/09/2026',
    timeSlots: ['09:00', '10:00'],
    startTime: '09:00',
    endTime: '11:00',
    price: 640,
    status: 'confirmed',
    createdAt: '2026-09-21T13:40:00.000Z'
  },
  {
    _id: 'reservation-4',
    studioId: STUDIO_ID,
    itemId: ITEM_ID,
    customerId: 'customer-four',
    customerName: 'David Levi',
    studioName: studio.name,
    itemName: { en: 'Podcast Recording', he: 'הקלטת פודקאסט' },
    bookingDate: '28/09/2026',
    timeSlots: ['12:00', '13:00', '14:00', '15:00'],
    startTime: '12:00',
    endTime: '16:00',
    price: 1280,
    status: 'confirmed',
    createdAt: '2026-09-22T07:25:00.000Z'
  },
  {
    _id: 'reservation-5',
    studioId: STUDIO_ID,
    itemId: ITEM_ID,
    customerId: 'customer-five',
    customerName: 'Shira Ben-David',
    studioName: studio.name,
    itemName: item.name,
    bookingDate: '29/09/2026',
    timeSlots: ['18:00', '19:00', '20:00'],
    startTime: '18:00',
    endTime: '21:00',
    price: 960,
    status: 'confirmed',
    createdAt: '2026-09-22T09:10:00.000Z'
  },
  {
    _id: 'reservation-6',
    studioId: STUDIO_ID,
    itemId: ITEM_ID,
    customerId: 'customer-six',
    customerName: 'Eitan Mizrahi',
    studioName: studio.name,
    itemName: item.name,
    bookingDate: '01/10/2026',
    timeSlots: ['10:00', '11:00', '12:00'],
    startTime: '10:00',
    endTime: '13:00',
    price: 960,
    status: 'confirmed',
    createdAt: '2026-09-22T12:05:00.000Z'
  },
  {
    _id: 'reservation-7',
    studioId: STUDIO_ID,
    itemId: ITEM_ID,
    customerId: 'customer-seven',
    customerName: 'Lior Shalev',
    studioName: studio.name,
    itemName: item.name,
    bookingDate: '02/10/2026',
    timeSlots: ['14:00', '15:00'],
    startTime: '14:00',
    endTime: '16:00',
    price: 640,
    status: 'cancelled',
    createdAt: '2026-09-22T15:30:00.000Z'
  },
  {
    _id: 'reservation-8',
    studioId: STUDIO_ID,
    itemId: ITEM_ID,
    customerId: 'customer-eight',
    customerName: 'Roni Barak',
    studioName: studio.name,
    itemName: item.name,
    bookingDate: '04/10/2026',
    timeSlots: ['16:00', '17:00', '18:00'],
    startTime: '16:00',
    endTime: '19:00',
    price: 960,
    status: 'pending',
    createdAt: '2026-09-23T06:50:00.000Z'
  }
];

const additionalReservationSeed: Array<{
  customerId: string;
  customerName: string;
  bookingDate: string;
  startHour: number;
  duration: number;
  status: string;
  createdAt: string;
  itemName?: { en: string; he: string };
}> = [
  {
    customerId: 'customer-nine',
    customerName: 'Amit Rosen',
    bookingDate: '05/10/2026',
    startHour: 9,
    duration: 3,
    status: 'confirmed',
    itemName: { en: 'Recording Session', he: 'סשן הקלטה' },
    createdAt: '2026-09-23T08:10:00.000Z'
  },
  {
    customerId: 'customer-ten',
    customerName: 'Maya Azulay',
    bookingDate: '06/10/2026',
    startHour: 13,
    duration: 2,
    status: 'confirmed',
    itemName: { en: 'Vocal Take', he: 'טייק ווקאלי' },
    createdAt: '2026-09-23T09:20:00.000Z'
  },
  {
    customerId: 'customer-eleven',
    customerName: 'Omer Katz',
    bookingDate: '07/10/2026',
    startHour: 17,
    duration: 4,
    status: 'confirmed',
    itemName: { en: 'Live Band Tracking', he: 'הקלטת הרכב' },
    createdAt: '2026-09-23T10:35:00.000Z'
  },
  {
    customerId: 'customer-twelve',
    customerName: 'Tal Shahar',
    bookingDate: '08/10/2026',
    startHour: 10,
    duration: 2,
    status: 'confirmed',
    itemName: { en: 'Mixing Session', he: 'סשן מיקס' },
    createdAt: '2026-09-23T11:05:00.000Z'
  },
  {
    customerId: 'customer-thirteen',
    customerName: 'Gal Naveh',
    bookingDate: '09/10/2026',
    startHour: 15,
    duration: 3,
    status: 'confirmed',
    itemName: { en: 'Mastering', he: 'מאסטרינג' },
    createdAt: '2026-09-23T12:15:00.000Z'
  },
  {
    customerId: 'customer-fourteen',
    customerName: 'Niv Cohen',
    bookingDate: '11/10/2026',
    startHour: 11,
    duration: 3,
    status: 'confirmed',
    itemName: { en: 'Recording Session', he: 'סשן הקלטה' },
    createdAt: '2026-09-23T13:40:00.000Z'
  },
  {
    customerId: 'customer-fifteen',
    customerName: 'Dana Peled',
    bookingDate: '12/10/2026',
    startHour: 18,
    duration: 2,
    status: 'cancelled',
    createdAt: '2026-09-23T14:25:00.000Z'
  },
  {
    customerId: 'customer-sixteen',
    customerName: 'Yoni Amir',
    bookingDate: '13/10/2026',
    startHour: 14,
    duration: 4,
    status: 'pending',
    createdAt: '2026-09-23T15:10:00.000Z'
  },
  // Month-spread calendar fixtures (today = 22/09/2026):
  // lighter than the late-month pile-up; ~1 booking on selected days across September.
  {
    customerId: 'customer-seventeen',
    customerName: 'Alex Rivera',
    bookingDate: '02/09/2026',
    startHour: 10,
    duration: 2,
    status: 'confirmed',
    itemName: { en: 'Vocal Take', he: 'טייק ווקאלי' },
    createdAt: '2026-08-28T16:00:00.000Z'
  },
  {
    customerId: 'customer-pending-sep',
    customerName: 'Noa Farhi',
    bookingDate: '19/09/2026',
    startHour: 13,
    duration: 2,
    status: 'pending',
    itemName: { en: 'Studio Rental', he: 'השכרת אולפן' },
    createdAt: '2026-09-17T11:00:00.000Z'
  },
  {
    customerId: 'customer-pending-sep-2',
    customerName: 'Dan Peretz',
    bookingDate: '24/09/2026',
    startHour: 14,
    duration: 2,
    status: 'pending',
    itemName: { en: 'Mixing Session', he: 'סשן מיקס' },
    createdAt: '2026-09-20T14:30:00.000Z'
  },
  {
    customerId: 'customer-eighteen',
    customerName: 'Mia Ben-Ami',
    bookingDate: '05/09/2026',
    startHour: 14,
    duration: 3,
    status: 'confirmed',
    itemName: { en: 'Mixing Session', he: 'סשן מיקס' },
    createdAt: '2026-08-30T16:20:00.000Z'
  },
  {
    customerId: 'customer-nineteen',
    customerName: 'Ron Hadad',
    bookingDate: '08/09/2026',
    startHour: 11,
    duration: 2,
    status: 'confirmed',
    itemName: { en: 'Podcast Recording', he: 'הקלטת פודקאסט' },
    createdAt: '2026-09-01T16:40:00.000Z'
  },
  {
    customerId: 'customer-twenty',
    customerName: 'Sara Klein',
    bookingDate: '11/09/2026',
    startHour: 10,
    duration: 3,
    status: 'confirmed',
    itemName: { en: 'Recording Session', he: 'סשן הקלטה' },
    createdAt: '2026-09-03T09:00:00.000Z'
  },
  {
    customerId: 'customer-twentyone',
    customerName: 'Idan Bar',
    bookingDate: '14/09/2026',
    startHour: 15,
    duration: 2,
    status: 'confirmed',
    itemName: { en: 'Mastering', he: 'מאסטרינג' },
    createdAt: '2026-09-04T10:00:00.000Z'
  },
  {
    customerId: 'customer-twentytwo',
    customerName: 'Hila Mor',
    bookingDate: '16/09/2026',
    startHour: 11,
    duration: 3,
    status: 'confirmed',
    itemName: { en: 'Live Band Tracking', he: 'הקלטת הרכב' },
    createdAt: '2026-09-06T08:00:00.000Z'
  },
  {
    customerId: 'customer-twentythree',
    customerName: 'Tom Avraham',
    bookingDate: '18/09/2026',
    startHour: 16,
    duration: 2,
    status: 'confirmed',
    itemName: { en: 'Vocal Take', he: 'טייק ווקאלי' },
    createdAt: '2026-09-07T09:00:00.000Z'
  },
  {
    customerId: 'customer-twentyfour',
    customerName: 'Lina Weiss',
    bookingDate: '21/09/2026',
    startHour: 10,
    duration: 2,
    status: 'confirmed',
    itemName: { en: 'Recording Session', he: 'סשן הקלטה' },
    createdAt: '2026-09-10T11:00:00.000Z'
  },
  {
    customerId: 'customer-twentyfive',
    customerName: 'Ori Segal',
    bookingDate: '22/09/2026',
    startHour: 14,
    duration: 2,
    status: 'confirmed',
    itemName: { en: 'Podcast Recording', he: 'הקלטת פודקאסט' },
    createdAt: '2026-09-11T12:00:00.000Z'
  },
  {
    customerId: 'customer-twentysix',
    customerName: 'Neta Carmel',
    bookingDate: '23/09/2026',
    startHour: 11,
    duration: 2,
    status: 'confirmed',
    itemName: { en: 'Mixing Session', he: 'סשן מיקס' },
    createdAt: '2026-09-13T14:00:00.000Z'
  },
  {
    customerId: 'customer-twentyseven',
    customerName: 'Yoav Dahan',
    bookingDate: '26/09/2026',
    startHour: 15,
    duration: 3,
    status: 'confirmed',
    itemName: { en: 'Recording Session', he: 'סשן הקלטה' },
    createdAt: '2026-09-14T15:00:00.000Z'
  },
  {
    customerId: 'customer-twentyeight',
    customerName: 'Eden Levy',
    bookingDate: '30/09/2026',
    startHour: 10,
    duration: 2,
    status: 'confirmed',
    itemName: { en: 'Mastering', he: 'מאסטרינג' },
    createdAt: '2026-09-18T08:00:00.000Z'
  },
  {
    customerId: 'customer-twentynine',
    customerName: 'Barak Tzur',
    bookingDate: '03/10/2026',
    startHour: 14,
    duration: 2,
    status: 'confirmed',
    itemName: { en: 'Vocal Take', he: 'טייק ווקאלי' },
    createdAt: '2026-09-19T09:00:00.000Z'
  }
];

const reservations = [
  ...reservationSeed,
  ...additionalReservationSeed.map((reservation, index) => ({
    _id: `reservation-${index + 9}`,
    studioId: STUDIO_ID,
    itemId: ITEM_ID,
    customerId: reservation.customerId,
    customerName: reservation.customerName,
    studioName: studio.name,
    itemName: reservation.itemName || item.name,
    bookingDate: reservation.bookingDate,
    timeSlots: Array.from(
      { length: reservation.duration },
      (_, slot) => `${String(reservation.startHour + slot).padStart(2, '0')}:00`
    ),
    startTime: `${String(reservation.startHour).padStart(2, '0')}:00`,
    endTime: `${String(reservation.startHour + reservation.duration).padStart(2, '0')}:00`,
    price: reservation.duration * 320,
    status: reservation.status,
    createdAt: reservation.createdAt
  }))
].map((reservation) => ({
  ...reservation,
  itemPrice: 320,
  totalPrice: reservation.price
}));

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

const projectCollaboratorsDemo = [
  activeCollab(collabAmir, 'vendor', '2026-09-19T09:30:00.000Z'),
  activeCollab(collabNoa, 'customer', '2026-09-19T11:15:00.000Z'),
  activeCollab(collabEitan, 'vendor', '2026-09-20T08:45:00.000Z'),
  activeCollab(collabShira, 'customer', '2026-09-20T13:20:00.000Z')
];

const remoteMixItem = items.find((entry) => entry._id === 'item-remote-mix') ?? item;
const mixingItem = items.find((entry) => entry._id === 'item-mixing') ?? item;
const masteringItem = items.find((entry) => entry._id === 'item-mastering') ?? item;

const projectDemo = {
  _id: 'project-demo',
  title: 'Midnight Drive — Final Mix',
  brief: 'Final mix and mastering for a four-track electronic EP.',
  customerId: customerUser,
  customerName: customerUser.name,
  vendorId: vendorUser,
  studioId: studio,
  itemId: remoteMixItem,
  itemName: remoteMixItem.name,
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
  collaborators: projectCollaboratorsDemo,
  createdAt: '2026-09-18T10:00:00.000Z',
  updatedAt: '2026-09-22T08:00:00.000Z'
};

const additionalProjects = [
  {
    _id: 'project-neon-tides',
    title: 'Neon Tides — Vocal Production',
    brief: 'Lead vocal comp, tuning and FX for a single release.',
    customerId: { _id: 'customer-yael', name: 'Yael Cohen', email: 'yael@example.test' },
    customerName: 'Yael Cohen',
    vendorId: vendorUser,
    studioId: studio,
    itemId: remoteMixItem,
    itemName: remoteMixItem.name,
    studioName: studio.name,
    price: 1600,
    depositPaid: true,
    finalPaid: false,
    estimatedDeliveryDays: 5,
    deadline: '2026-09-26T18:00:00.000Z',
    revisionsIncluded: 2,
    revisionsUsed: 0,
    paymentStatus: 'deposit_paid',
    status: 'in_progress',
    artworkUrl: '/images/screenshots/northline-track-neon-tides.webp',
    collaborators: [
      activeCollab(collabAmir, 'vendor', '2026-09-20T10:00:00.000Z'),
      activeCollab(
        { _id: 'customer-yael', name: 'Yael Cohen', email: 'yael@example.test', picture: fixtureAvatar('yael-cohen', 'YC') },
        'customer',
        '2026-09-20T10:05:00.000Z'
      )
    ],
    createdAt: '2026-09-19T09:00:00.000Z',
    updatedAt: '2026-09-22T12:00:00.000Z'
  },
  {
    _id: 'project-paper-planes',
    title: 'Paper Planes — Mix Revisions',
    brief: 'Second-pass mix notes on drums, bass and stereo image.',
    customerId: { _id: 'customer-noa', name: 'Noa Shapira', email: 'noa.s@example.test' },
    customerName: 'Noa Shapira',
    vendorId: vendorUser,
    studioId: studio,
    itemId: mixingItem,
    itemName: mixingItem.name,
    studioName: studio.name,
    price: 2200,
    depositPaid: true,
    finalPaid: false,
    estimatedDeliveryDays: 4,
    deadline: '2026-09-24T18:00:00.000Z',
    revisionsIncluded: 3,
    revisionsUsed: 2,
    paymentStatus: 'deposit_paid',
    status: 'revision_requested',
    artworkUrl: '/images/screenshots/northline-track-paper-planes.webp',
    collaborators: [
      activeCollab(collabEitan, 'vendor', '2026-09-18T14:00:00.000Z'),
      activeCollab(collabNoa, 'customer', '2026-09-18T14:10:00.000Z'),
      activeCollab(
        { _id: 'customer-noa', name: 'Noa Shapira', email: 'noa.s@example.test', picture: fixtureAvatar('noa-shapira', 'NS') },
        'customer',
        '2026-09-18T14:12:00.000Z'
      )
    ],
    createdAt: '2026-09-15T11:00:00.000Z',
    updatedAt: '2026-09-22T16:30:00.000Z'
  },
  {
    _id: 'project-after-hours',
    title: 'After Hours — Mastering',
    brief: 'Album mastering for eight tracks with streaming and vinyl specs.',
    customerId: { _id: 'customer-eitan', name: 'Eitan Mizrahi', email: 'eitan.client@example.test' },
    customerName: 'Eitan Mizrahi',
    vendorId: vendorUser,
    studioId: studio,
    itemId: masteringItem,
    itemName: masteringItem.name,
    studioName: studio.name,
    price: 3600,
    depositPaid: true,
    finalPaid: true,
    estimatedDeliveryDays: 10,
    deadline: '2026-09-20T18:00:00.000Z',
    revisionsIncluded: 1,
    revisionsUsed: 1,
    paymentStatus: 'paid',
    status: 'delivered',
    artworkUrl: '/images/screenshots/northline-track-after-hours.webp',
    collaborators: [
      activeCollab(vendorUser, 'vendor', '2026-09-10T09:00:00.000Z'),
      activeCollab(
        { _id: 'customer-eitan', name: 'Eitan Mizrahi', email: 'eitan.client@example.test', picture: fixtureAvatar('eitan-client', 'EM') },
        'customer',
        '2026-09-10T09:05:00.000Z'
      ),
      activeCollab(collabAmir, 'vendor', '2026-09-10T09:10:00.000Z')
    ],
    createdAt: '2026-09-08T10:00:00.000Z',
    updatedAt: '2026-09-21T18:00:00.000Z'
  },
  {
    _id: 'project-live-session',
    title: 'Live Session — Band Tracking',
    brief: 'Full-day live tracking for drums, bass and two guitars.',
    customerId: { _id: 'customer-shira', name: 'Shira Ben-David', email: 'shira.bd@example.test' },
    customerName: 'Shira Ben-David',
    vendorId: vendorUser,
    studioId: studio,
    itemId: item,
    itemName: item.name,
    studioName: studio.name,
    price: 4200,
    depositPaid: true,
    finalPaid: false,
    estimatedDeliveryDays: 3,
    deadline: '2026-10-02T18:00:00.000Z',
    revisionsIncluded: 1,
    revisionsUsed: 0,
    paymentStatus: 'deposit_paid',
    status: 'accepted',
    artworkUrl: '/images/screenshots/tempo-studios-live-room.webp',
    collaborators: [
      activeCollab(collabAmir, 'vendor', '2026-09-21T08:00:00.000Z'),
      activeCollab(collabShira, 'customer', '2026-09-21T08:15:00.000Z'),
      activeCollab(
        { _id: 'customer-shira', name: 'Shira Ben-David', email: 'shira.bd@example.test', picture: fixtureAvatar('shira-ben-david', 'SB') },
        'customer',
        '2026-09-21T08:20:00.000Z'
      )
    ],
    createdAt: '2026-09-21T08:00:00.000Z',
    updatedAt: '2026-09-22T09:00:00.000Z'
  },
  {
    _id: 'project-podcast-edit',
    title: 'Studio Talk — Episode Edit',
    brief: 'Edit, clean and bounce a 45-minute podcast episode.',
    customerId: { _id: 'customer-ron', name: 'Ron Adler', email: 'ron@example.test' },
    customerName: 'Ron Adler',
    vendorId: vendorUser,
    studioId: studio,
    itemId: items.find((entry) => entry._id === 'item-podcast') ?? item,
    itemName: (items.find((entry) => entry._id === 'item-podcast') ?? item).name,
    studioName: studio.name,
    price: 900,
    depositPaid: true,
    finalPaid: true,
    estimatedDeliveryDays: 2,
    deadline: '2026-09-18T18:00:00.000Z',
    revisionsIncluded: 1,
    revisionsUsed: 0,
    paymentStatus: 'paid',
    status: 'completed',
    artworkUrl: '/images/screenshots/tempo-studios-podcast-room.webp',
    collaborators: [
      activeCollab(
        { _id: 'customer-ron', name: 'Ron Adler', email: 'ron@example.test', picture: fixtureAvatar('ron-adler', 'RA') },
        'customer',
        '2026-09-12T11:00:00.000Z'
      ),
      activeCollab(collabEitan, 'vendor', '2026-09-12T11:10:00.000Z'),
      activeCollab(vendorUser, 'vendor', '2026-09-12T11:15:00.000Z')
    ],
    createdAt: '2026-09-12T10:00:00.000Z',
    updatedAt: '2026-09-18T17:00:00.000Z'
  },
  {
    _id: 'project-new-request',
    title: 'Harbor Lights — Demo Mix',
    brief: 'First-pass mix from rough stems for a writer session.',
    customerId: { _id: 'customer-lia', name: 'Lia North', email: 'lia@example.test' },
    customerName: 'Lia North',
    vendorId: vendorUser,
    studioId: studio,
    itemId: remoteMixItem,
    itemName: remoteMixItem.name,
    studioName: studio.name,
    price: 1400,
    depositPaid: false,
    finalPaid: false,
    estimatedDeliveryDays: 6,
    deadline: '2026-10-05T18:00:00.000Z',
    revisionsIncluded: 2,
    revisionsUsed: 0,
    paymentStatus: 'unpaid',
    status: 'requested',
    artworkUrl: '/images/screenshots/tempo-studios-console.webp',
    collaborators: [
      activeCollab(collabAmir, 'vendor', '2026-09-22T15:05:00.000Z'),
      activeCollab(
        { _id: 'customer-lia', name: 'Lia North', email: 'lia@example.test', picture: fixtureAvatar('lia-north', 'LN') },
        'customer',
        '2026-09-22T15:10:00.000Z'
      ),
      activeCollab(collabNoa, 'customer', '2026-09-22T15:15:00.000Z')
    ],
    createdAt: '2026-09-22T15:00:00.000Z',
    updatedAt: '2026-09-22T15:00:00.000Z'
  }
];

const projects = [projectDemo, ...additionalProjects];

const hebrewProjectListCopy: Record<string, { title: string; brief: string }> = {
  'project-demo': {
    title: 'Midnight Drive — מיקס סופי',
    brief: 'מיקס ומאסטרינג סופיים ל־EP אלקטרוני של ארבעה שירים.'
  },
  'project-neon-tides': {
    title: 'Neon Tides — הפקת ווקאל',
    brief: 'קומפ, תיקון ו־FX לווקאל מוביל לסינגל.'
  },
  'project-paper-planes': {
    title: 'Paper Planes — תיקוני מיקס',
    brief: 'סבב שני של הערות על תופים, בס ותמונת סטריאו.'
  },
  'project-after-hours': {
    title: 'After Hours — מאסטרינג',
    brief: 'מאסטרינג לאלבום של שמונה שירים עם מפרטי סטרימינג וויניל.'
  },
  'project-live-session': {
    title: 'סשן לייב — הקלטת להקה',
    brief: 'יום הקלטה מלא לתופים, בס ושתי גיטרות.'
  },
  'project-podcast-edit': {
    title: 'Studio Talk — עריכת פרק',
    brief: 'עריכה, ניקוי וייצוא לפרק פודקאסט של 45 דקות.'
  },
  'project-new-request': {
    title: 'Harbor Lights — מיקס דמו',
    brief: 'מיקס ראשון מסטמים גולמיים לסשן כתיבה.'
  }
};

function getLocalizedProjects(locale: CaptureScenario['locale']) {
  if (locale !== 'he') return projects;
  return projects.map((project) => {
    const copy = hebrewProjectListCopy[project._id];
    if (!copy) return project;
    return { ...project, title: copy.title, brief: copy.brief };
  });
}

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
    _id: 'source-drums',
    projectId: 'project-demo',
    uploadedBy: {
      _id: 'collaborator-customer-1',
      name: 'Noa Shaham',
      email: 'noa@example.test'
    },
    type: 'source',
    fileName: 'Drums — Edited Multitrack.wav',
    fileSize: 142_870_528,
    mimeType: 'audio/wav',
    storageKey: 'screenshots/projects/drums-edited.wav',
    description: 'Edited live drums with room and close microphones',
    waveformStatus: 'ready',
    createdAt: '2026-09-18T12:31:00.000Z'
  },
  {
    _id: 'source-synths',
    projectId: 'project-demo',
    uploadedBy: customerUser,
    type: 'source',
    fileName: 'Synths — Printed Stems.wav',
    fileSize: 98_304_000,
    mimeType: 'audio/wav',
    storageKey: 'screenshots/projects/synth-stems.wav',
    description: 'Printed hardware synth stems at 48 kHz / 24-bit',
    waveformStatus: 'ready',
    createdAt: '2026-09-18T12:36:00.000Z'
  },
  {
    _id: 'source-guitars',
    projectId: 'project-demo',
    uploadedBy: customerUser,
    type: 'source',
    fileName: 'Guitars — Double Tracks.wav',
    fileSize: 76_414_976,
    mimeType: 'audio/wav',
    storageKey: 'screenshots/projects/guitar-doubles.wav',
    waveformStatus: 'ready',
    createdAt: '2026-09-18T12:41:00.000Z'
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
    _id: 'deliverable-mix-v4',
    projectId: 'project-demo',
    uploadedBy: {
      _id: 'collaborator-vendor-1',
      name: 'Amir Halevi',
      email: 'amir@northlinesound.example'
    },
    type: 'deliverable',
    fileName: 'Midnight Drive — Mix V4.wav',
    fileSize: 94_781_440,
    mimeType: 'audio/wav',
    storageKey: 'screenshots/projects/mix-v4.wav',
    description: 'Updated vocal automation and wider chorus',
    waveformStatus: 'ready',
    createdAt: '2026-09-22T09:18:00.000Z'
  },
  {
    _id: 'deliverable-instrumental',
    projectId: 'project-demo',
    uploadedBy: vendorUser,
    type: 'deliverable',
    fileName: 'Midnight Drive — Instrumental.wav',
    fileSize: 91_226_112,
    mimeType: 'audio/wav',
    storageKey: 'screenshots/projects/instrumental.wav',
    waveformStatus: 'ready',
    createdAt: '2026-09-22T09:20:00.000Z'
  },
  {
    _id: 'revision-v1',
    projectId: 'project-demo',
    uploadedBy: vendorUser,
    type: 'revision',
    fileName: 'Midnight Drive — Revision 1.wav',
    fileSize: 87_982_080,
    mimeType: 'audio/wav',
    storageKey: 'screenshots/projects/revision-1.wav',
    revisionNumber: 1,
    waveformStatus: 'ready',
    createdAt: '2026-09-19T16:10:00.000Z'
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
  },
  {
    _id: 'revision-v3',
    projectId: 'project-demo',
    uploadedBy: {
      _id: 'collaborator-vendor-2',
      name: 'Eitan Mizrahi',
      email: 'eitan@example.test'
    },
    type: 'revision',
    fileName: 'Midnight Drive — Revision 3.wav',
    fileSize: 90_566_656,
    mimeType: 'audio/wav',
    storageKey: 'screenshots/projects/revision-3.wav',
    revisionNumber: 3,
    waveformStatus: 'ready',
    createdAt: '2026-09-21T11:05:00.000Z'
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
    _id: 'message-general-4',
    projectId: 'project-demo',
    senderId: {
      _id: 'collaborator-customer-1',
      name: 'Noa Shaham',
      email: 'noa@example.test'
    },
    senderRole: 'customer_collaborator',
    message: 'The new chorus balance translates beautifully on smaller speakers.',
    readAt: '2026-09-22T08:35:00.000Z',
    createdAt: '2026-09-22T08:26:00.000Z'
  },
  {
    _id: 'message-general-5',
    projectId: 'project-demo',
    senderId: {
      _id: 'collaborator-vendor-2',
      name: 'Eitan Mizrahi',
      email: 'eitan@example.test'
    },
    senderRole: 'vendor_collaborator',
    message: 'I printed the final synth stems and added them to the source files.',
    readAt: '2026-09-22T09:05:00.000Z',
    createdAt: '2026-09-22T08:51:00.000Z'
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
  },
  {
    _id: 'message-track-3',
    projectId: 'project-demo',
    senderId: customerUser,
    senderRole: 'customer',
    message: 'Can we let the final vocal breathe before the outro begins?',
    fileId: 'source-midnight-drive',
    offsetSeconds: 135.5,
    readAt: '2026-09-22T09:15:00.000Z',
    createdAt: '2026-09-22T08:42:00.000Z'
  },
  {
    _id: 'message-track-reply-2',
    projectId: 'project-demo',
    senderId: vendorUser,
    senderRole: 'vendor',
    message: 'Yes — I opened that gap and softened the transition into the outro.',
    fileId: 'source-midnight-drive',
    parentId: 'message-track-3',
    offsetSeconds: 135.5,
    readAt: '2026-09-22T09:35:00.000Z',
    createdAt: '2026-09-22T09:22:00.000Z'
  },
  {
    _id: 'message-vocal-1',
    projectId: 'project-demo',
    senderId: {
      _id: 'collaborator-customer-1',
      name: 'Noa Shaham',
      email: 'noa@example.test'
    },
    senderRole: 'customer_collaborator',
    message: 'There is a small breath here that we can keep — it makes the take feel intimate.',
    fileId: 'source-vocal',
    offsetSeconds: 31.8,
    readAt: '2026-09-22T10:15:00.000Z',
    createdAt: '2026-09-22T10:02:00.000Z'
  },
  {
    _id: 'message-drums-1',
    projectId: 'project-demo',
    senderId: {
      _id: 'collaborator-customer-2',
      name: 'Shira Ben-Ami',
      email: 'shira@example.test'
    },
    senderRole: 'customer_collaborator',
    message: 'Could the snare be slightly tighter through this pre-chorus?',
    fileId: 'source-drums',
    offsetSeconds: 63.4,
    readAt: '2026-09-22T10:42:00.000Z',
    createdAt: '2026-09-22T10:28:00.000Z'
  },
  {
    _id: 'message-drums-reply-1',
    projectId: 'project-demo',
    senderId: {
      _id: 'collaborator-vendor-1',
      name: 'Amir Halevi',
      email: 'amir@northlinesound.example'
    },
    senderRole: 'vendor_collaborator',
    message: 'Yes — I shortened the room tail and tightened the parallel bus.',
    fileId: 'source-drums',
    parentId: 'message-drums-1',
    offsetSeconds: 63.4,
    readAt: '2026-09-22T11:04:00.000Z',
    createdAt: '2026-09-22T10:51:00.000Z'
  },
  {
    _id: 'message-synths-1',
    projectId: 'project-demo',
    senderId: {
      _id: 'collaborator-vendor-2',
      name: 'Eitan Mizrahi',
      email: 'eitan@example.test'
    },
    senderRole: 'vendor_collaborator',
    message: 'I automated the upper pad here so the lead has more space.',
    fileId: 'source-synths',
    offsetSeconds: 106.7,
    readAt: '2026-09-22T11:35:00.000Z',
    createdAt: '2026-09-22T11:18:00.000Z'
  },
  {
    _id: 'message-guitars-1',
    projectId: 'project-demo',
    senderId: customerUser,
    senderRole: 'customer',
    message: 'The double track on the right could come forward just a touch here.',
    fileId: 'source-guitars',
    offsetSeconds: 78.1,
    readAt: '2026-09-22T12:18:00.000Z',
    createdAt: '2026-09-22T12:03:00.000Z'
  },
  {
    _id: 'message-guitars-reply-1',
    projectId: 'project-demo',
    senderId: vendorUser,
    senderRole: 'vendor',
    message: 'Adjusted. It now matches the left side without narrowing the image.',
    fileId: 'source-guitars',
    parentId: 'message-guitars-1',
    offsetSeconds: 78.1,
    readAt: '2026-09-22T12:42:00.000Z',
    createdAt: '2026-09-22T12:29:00.000Z'
  }
];

const hebrewProjectMessageText: Record<string, string> = {
  'message-general-1': 'הכיוון מרגיש מצוין. אפשר לתת לפזמון קצת יותר רוחב?',
  'message-general-2': 'בהחלט — הרחבתי את ערוץ הסינת׳ והשארתי את השירה במרכז.',
  'message-general-3': 'ניקיתי גם את התדרים הנמוכים לפני מעבר הלימיטר הסופי.',
  'message-general-4': 'האיזון החדש בפזמון נשמע נהדר גם ברמקולים קטנים.',
  'message-general-5': 'הדפסתי את ערוצי הסינת׳ הסופיים והוספתי אותם לקובצי המקור.',
  'message-track-1': 'אפשר להכניס כאן את הדיליי של השירה פעימה אחת מאוחר יותר?',
  'message-track-reply-1': 'בוצע — עכשיו הוא מתחיל אחרי המשפט הראשון.',
  'message-track-2': 'אהבתי את המעבר הזה. הכניסה יושבת עכשיו בדיוק.',
  'message-track-3': 'אפשר לתת לשירה האחרונה לנשום לפני שהאאוטרו מתחיל?',
  'message-track-reply-2': 'כן — פתחתי שם מרווח וריככתי את המעבר לאאוטרו.',
  'message-vocal-1': 'יש כאן נשימה קטנה שכדאי להשאיר — היא נותנת לטייק תחושה אינטימית.',
  'message-drums-1': 'אפשר להדק מעט את הסנר לאורך הפרה־פזמון הזה?',
  'message-drums-reply-1': 'כן — קיצרתי את זנב החדר והידקתי את ערוץ הקומפרסיה המקביל.',
  'message-synths-1': 'עשיתי כאן אוטומציה לפד העליון כדי לפנות יותר מקום לליד.',
  'message-guitars-1': 'אפשר להעלות כאן מעט את הדאבל בצד ימין?',
  'message-guitars-reply-1': 'סודר. עכשיו הוא מאוזן מול צד שמאל בלי לצמצם את תמונת הסטריאו.'
};

function getLocalizedProjectMessages(locale: CaptureScenario['locale']) {
  if (locale !== 'he') return projectMessages;
  return projectMessages.map((message) => ({
    ...message,
    message: hebrewProjectMessageText[message._id] ?? message.message
  }));
}

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
  if (method === 'GET' && path === '/items') return json(items);
  if (method === 'GET' && path.startsWith('/items/')) {
    const itemId = path.split('/')[2];
    return json(items.find((entry) => entry._id === itemId) ?? null);
  }
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
    const localizedProjects = getLocalizedProjects(scenario.locale);
    return json({
      projects: localizedProjects,
      pagination: { page: 1, limit: 20, total: localizedProjects.length, totalPages: 1 }
    });
  }
  if (method === 'GET' && path === '/remote-projects/project-demo') {
    const localizedProjects = getLocalizedProjects(scenario.locale);
    const project = localizedProjects.find((entry) => entry._id === 'project-demo') ?? localizedProjects[0];
    return json({
      project,
      fileCounts: { source: 5, deliverable: 4, revision: 3 },
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
    const fileId = path.split('/')[4] ?? 'unknown-file';
    const waveformSeed = [...fileId].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 0);
    const phase = ((waveformSeed % 360) * Math.PI) / 180;
    const primaryFrequency = 0.07 + (waveformSeed % 11) * 0.003;
    const secondaryFrequency = 0.17 + (waveformSeed % 7) * 0.004;
    return json({
      fileId,
      status: 'ready',
      peaks: Array.from({ length: 160 }, (_, index) =>
        Math.min(
          245,
          Math.round(
            32 +
              79 * Math.abs(Math.sin(index * primaryFrequency + phase)) +
              71 * Math.abs(Math.sin(index * secondaryFrequency + phase / 2)) +
              ((index * 31 + waveformSeed) % 43)
          )
        )
      ),
      durationMs: 180_000 + (waveformSeed % 90_000),
      sampleRate: 48_000,
      channels: 2,
      version: 1
    });
  }
  if (method === 'GET' && path === '/remote-projects/project-demo/collaborators') {
    return json({
      collaborators: projectCollaboratorsDemo,
      pendingInvites: []
    });
  }
  if (method === 'GET' && path.includes('/messages')) {
    const localizedMessages = getLocalizedProjectMessages(scenario.locale);
    return json({
      messages: localizedMessages,
      pagination: { page: 1, limit: 300, total: localizedMessages.length, pages: 1 }
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
