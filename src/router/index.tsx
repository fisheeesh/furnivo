import About from '@/pages/About'
import Home from '@/pages/Home'
import { createBrowserRouter, RouterProvider } from 'react-router'

export default function Router() {

    const router = createBrowserRouter([
        {
            index: true,
            Component: Home,
        },
        {
            path: '/about',
            Component: About,
        }
    ])

    return <RouterProvider router={router} />
}
