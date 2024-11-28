interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string;
  readonly VITE_CLOUDINARY_API_KEY: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_CALLBACK_URL: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_PAYPAL_CLIENT_ID: string;
  readonly VITE_PAYPAL_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
