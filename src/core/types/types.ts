interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string;
  readonly VITE_CLOUDINARY_API_KEY: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_CALLBACK_URL: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_PAYPAL_SANDBOX_CLIENT_ID: string;
  readonly VITE_PAYPAL_LIVE_CLIENT_ID: string;
  readonly VITE_PAYPAL_SANDBOX_SECRET_KEY: string;
  readonly VITE_PAYPAL_SUBSCRIPTION_SANDBOX_CLIENT_ID: string;
  readonly VITE_PAYPAL_SUBSCRIPTION_SANDBOX_SECRET_KEY: string;
  readonly VITE_PAYPAL_LIVE_SECRET_KEY: string;
  readonly VITE_PAYPAL_LIVE_BASE_URL: string;
  readonly VITE_PAYPAL_SANDBOX_BASE_URL: string;
  readonly VITE_MAPBOX_PUBLIC_TOKEN: string;
  readonly VITE_BREVO_SENDER_EMAIL: string;
  readonly VITE_BREVO_SENDER_NAME: string;
  readonly VITE_BREVO_WELCOME_TEMPLATE_ID: string;
  readonly VITE_BREVO_ORDER_CONFIRMATION_TEMPLATE_ID: string;
  readonly VITE_BREVO_PASSWORD_RESET_TEMPLATE_ID: string;
  readonly VITE_SUMIT_PUBLIC_API_KEY: string;
  readonly VITE_SUMIT_COMPANY_ID: string;
  readonly VITE_PAYME_PUBLIC_KEY: string;
  readonly VITE_PAYME_SECRET_KEY: string;
  readonly VITE_PAYME_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
