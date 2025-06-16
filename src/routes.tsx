import ContactPage from '@/pages/Contact'
import HomePage from '@/pages/Home'
import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './pages/RootLayout'
import ErrorPage from './pages/Error'

export default function Router() {

    const router = createBrowserRouter([
        {
            path: '/',
            Component: RootLayout,
            errorElement: <ErrorPage />,
            children: [
                {
                    index: true,
                    Component: HomePage,
                },
                {
                    path: 'contact',
                    Component: ContactPage
                }
            ]
        },
    ])

    return <RouterProvider router={router} />
}
