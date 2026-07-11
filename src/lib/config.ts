import { z } from 'zod'

const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  VITE_FIREBASE_APP_ID: z.string().min(1),
  VITE_APP_NAME: z.string().min(1),
  VITE_DEFAULT_HOURLY_RATE: z.coerce.number().positive(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${parsed.error.errors.map(e => `  - ${e.path.join('.')}: ${e.message}`).join('\n')}`
  )
}

export const config = {
  firebase: {
    apiKey: parsed.data.VITE_FIREBASE_API_KEY,
    authDomain: parsed.data.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: parsed.data.VITE_FIREBASE_PROJECT_ID,
    storageBucket: parsed.data.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: parsed.data.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: parsed.data.VITE_FIREBASE_APP_ID,
  },
  appName: parsed.data.VITE_APP_NAME,
  defaultHourlyRate: parsed.data.VITE_DEFAULT_HOURLY_RATE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
