# Studioz App Frontend

A modern, full-featured React application for discovering and booking recording studios. Built with TypeScript, React, and a comprehensive tech stack for optimal performance and user experience.

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **State Management**: TanStack Query (React Query) with persistence
- **Routing**: React Router DOM v6 with animated transitions
- **Authentication**: Auth0
- **Styling**: SCSS with CSS custom properties and container queries
- **UI Components**: Material-UI (MUI) v6
- **Maps**: Mapbox GL JS, Google Maps API
- **Forms**: React Hook Form
- **Date/Time**: FullCalendar, MUI Date Pickers with Day.js
- **Internationalization**: i18next with react-i18next (English & Hebrew)
- **Image Management**: Cloudinary
- **Animations**: Framer Motion
- **Notifications**: Sonner
- **Payment**: Sumit React SDK
- **Real-time**: Socket.io Client

## 📋 Prerequisites

- **Node.js** (v16.x or higher recommended)
- **npm** or **yarn**

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/G1320/Studioz-App-Frontend.git
   cd Studioz-App-Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## ⚙️ Environment Variables

Create a `.env` file in the root directory. Required environment variables:

```env
# Environment
VITE_NODE_ENV=development

# Auth0
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
VITE_CLOUDINARY_API_KEY=your-api-key
VITE_CLOUDINARY_API_SECRET=your-api-secret
VITE_CLOUDINARY_CLOUDINARY_URL=your-cloudinary-url

# Maps
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_MAPBOX_PUBLIC_TOKEN=your-mapbox-public-token

# API
VITE_API_URL=your-backend-api-url
```

## 📜 Available Scripts

- **`npm start`** - Start the development server (default: http://localhost:5173)
- **`npm run build`** - Build the production bundle with TypeScript type checking
- **`npm run preview`** - Preview the production build locally
- **`npm run lint`** - Run ESLint to check code quality
- **`npm run format`** - Format code using Prettier
- **`npm run test:performance`** - Run performance tests with k6

## 🏗️ Project Structure

```
src/
├── app/                    # Main application setup
│   ├── layout/            # Header, Footer, Hero components
│   └── routes/            # Route configuration with animations
├── assets/                 # Static assets and global styles
│   └── styles/            # SCSS utilities, variables, base styles
├── core/                   # Core application logic
│   ├── config/            # Feature flags, categories, cities, banners
│   ├── contexts/          # React Context providers
│   └── i18n/              # Internationalization configuration
├── features/               # Feature-based modules
│   ├── auth/              # Authentication components
│   ├── entities/          # Domain entities (studios, items, cart, etc.)
│   ├── home/              # Homepage
│   ├── navigation/        # Navigation components
│   ├── search/            # Search functionality
│   └── translation/       # Language switching
└── shared/                 # Shared utilities and components
    ├── components/        # Reusable UI components
    ├── hooks/             # Custom React hooks
    ├── services/          # API service layer
    ├── utils/             # Utility functions
    └── utility-components/ # Higher-level utility components
```

## 🎨 Key Features

- **Multi-language Support**: English and Hebrew (RTL) with i18next
- **Responsive Design**: Mobile-first approach with container queries
- **Location Services**: Geolocation with Mapbox and Google Maps integration
- **Booking System**: Calendar-based booking with time slot management
- **Image Optimization**: Cloudinary integration with lazy loading
- **State Persistence**: TanStack Query with localStorage persistence
- **Real-time Updates**: Socket.io live updates
- **Payment Integration**: PayPal checkout flow, live Sumit subscriptions
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Performance**: Code splitting, lazy loading, optimized bundle chunks

## 🧩 Architecture Highlights

- **Feature-based Organization**: Code organized by features for better maintainability
- **Component Composition**: Reusable components with consistent styling
- **Type Safety**: Full TypeScript coverage
- **Custom Hooks**: Encapsulated business logic in reusable hooks
- **Service Layer**: Centralized API communication
- **Context Providers**: Global state management with React Context
- **Route-based Code Splitting**: Lazy-loaded routes for optimal performance

## 🎯 Development

### Code Style

- ESLint for linting
- Prettier for code formatting
- TypeScript strict mode enabled

### Styling Guidelines

- SCSS modules with BEM-like naming
- CSS custom properties for theming
- Container queries for responsive design
- Glassmorphic design patterns
- Brand color system with variables

## 📦 Build & Deployment

The build process:

1. Type checks TypeScript code
2. Bundles with Vite
3. Optimizes assets
4. Generates sitemap and robots.txt
5. Outputs to `dist/` directory

Manual chunks are configured for optimal loading:

- React vendor bundle
- UI vendor bundle (MUI)
- Mapbox vendor bundle
- React Query vendor bundle
- i18n vendor bundle
- Calendar vendor bundle

## 🔧 Configuration

- **TypeScript**: `tsconfig.json` with path aliases
- **Vite**: `vite.config.js` with React plugin and optimizations
- **PostCSS**: Configured for SCSS processing
- **Feature Flags**: Centralized in `src/core/config/featureFlags.ts`

## 📝 Author

Developed by Darnell Green.

## 📄 License

[Add your license information here]
