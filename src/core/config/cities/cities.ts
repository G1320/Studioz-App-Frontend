export interface CityConfig {
  name: string;
  displayName?: string;
  lat: number;
  lng: number;
  zoom?: number;
  image: string;
}

export const cities: CityConfig[] = [
  {
    name: 'Tel Aviv-Yafo',
    displayName: 'Tel Aviv',
    lat: 32.0738062,
    lng: 34.7819764,
    zoom: 11,
    image: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Jerusalem',
    displayName: 'Jerusalem',
    lat: 31.7684335,
    lng: 35.2264873,
    zoom: 11,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Ashdod',
    displayName: 'Ashdod',
    lat: 31.7946419,
    lng: 34.6465042,
    zoom: 11,
    image: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Ramat Gan',
    displayName: 'Ramat Gan',
    lat: 32.069,
    lng: 34.83,
    zoom: 12,
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Haifa',
    displayName: 'Haifa',
    lat: 32.811354,
    lng: 34.9852867,
    zoom: 11,
    image: 'https://images.unsplash.com/photo-1486506574467-c44963fc7876?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Rishon LeTsiyon',
    displayName: 'Rishon LeTsiyon',
    lat: 31.9641474,
    lng: 34.803856,
    zoom: 11,
    image: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Herzliya',
    displayName: 'Herzliya',
    lat: 32.1683423,
    lng: 34.8039922,
    zoom: 12,
    image: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Beit Dagan',
    displayName: 'Beit Dagan',
    lat: 32.0015658,
    lng: 34.8270366,
    zoom: 12,
    image: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Holon',
    displayName: 'Holon',
    lat: 32.018374,
    lng: 34.7683935,
    zoom: 12,
    image: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Ashkelon',
    displayName: 'Ashkelon',
    lat: 31.6847179,
    lng: 34.5687094,
    zoom: 11,
    image: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Eilat',
    displayName: 'Eilat',
    lat: 29.5550691,
    lng: 34.9535926,
    zoom: 11,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
  }
];
