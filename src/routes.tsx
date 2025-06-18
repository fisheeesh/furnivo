import { createBrowserRouter, RouterProvider } from 'react-router'
import HomePage from '@/pages/Home'
import AboutPage from '@/pages/About'
import RootLayout from './pages/RootLayout'
import ErrorPage from './pages/Error'
import BlogPage from './pages/blogs/Blog'
import BlogDetailPage from './pages/blogs/BlogDetail'
import BlogRootLayout from './pages/blogs/BlogRootLayout'

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
                    path: 'about',
                    Component: AboutPage
                },
                {
                    path: 'blogs',
                    Component: BlogRootLayout,
                    children: [
                        {
                            index: true,
                            Component: BlogPage
                        },
                        {
                            path: ':postId',
                            Component: BlogDetailPage
                        }
                    ]
                },

            ]
        },
    ])

    return <RouterProvider router={router} />
}
