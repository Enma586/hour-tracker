import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B2415] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <App />
    </Suspense>
  </StrictMode>,
)
