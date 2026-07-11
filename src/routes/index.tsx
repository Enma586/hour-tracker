import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const TrackerPage = lazy(() => import('@/features/tracker/pages/TrackerPage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <TrackerPage />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
