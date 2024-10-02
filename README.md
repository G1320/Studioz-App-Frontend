# Studioz App Frontend

This repository contains the client-side code for the **Studioz** application, built using **React**, **Vite**, **Auth0** for authentication, **Cloudinary** for media uploads, and various other libraries for state management, routing, and forms.

## Getting Started

To get the frontend of the **Studioz** app up and running, follow these steps.

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v16.x or higher)
- **Vite** (Vite is used for building and serving the app)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/G1320/Studioz-App-Frontend.git
   cd studioz-app-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Set up Environment Variables

The app requires several environment variables for configuration. You can find an example in the `.env.example` file. To get started, create a `.env` file in the root of your project by copying `.env.example`:

```bash
cp .env.example .env
```

Fill in the values for the environment variables in your .env file. Here's an explanation of each:

VITE_NODE_ENV: The environment in which the app is running (development, production).

VITE_AUTH0_DOMAIN: The domain for your Auth0 application.

VITE_AUTH0_CLIENT_ID: The client ID for your Auth0 application.

VITE_CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name for managing image uploads.

VITE_CLOUDINARY_UPLOAD_PRESET: Cloudinary preset used for media uploads.

VITE_CLOUDINARY_API_KEY: API key for your Cloudinary account.

VITE_CLOUDINARY_API_SECRET: API secret for your Cloudinary account.

VITE_CLOUDINARY_CLOUDINARY_URL: The full Cloudinary URL for media management.

### Scripts

Here are the available scripts you can use from the package.json file:

Start the Development Server: Runs the app locally in development mode.

```bash
npm start
```

Build the App: Builds the project for production. This compiles the TypeScript and bundles the app using Vite.

```bash
npm run build
```

Preview the Build: After running the build command, you can preview the production build.

```bash
npm run preview
```

Running the Application:
Start the development server, By default, the Vite dev server will start on http://localhost:5173.

```bash
npm start
```

Build and run the production version:

```bash
npm run build
```

### Folder Structure

src/: Contains the source code for the frontend.

public/: Static assets like images, icons, and the index.html file.

dist/: Contains built assets, redirects, and an index.html

### Author

Developed by Darnell Green.
