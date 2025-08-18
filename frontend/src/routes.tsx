import { createBrowserRouter, RouterProvider } from 'react-router'
import HomePage from '@/pages/Home'
import AboutPage from '@/pages/About'
import RootLayout from './pages/RootLayout'
import ErrorPage from './pages/Error'
import BlogPage from './pages/blogs/Blog'
import BlogDetailPage from './pages/blogs/BlogDetail'
import ProductPage from './pages/products/Product'
import ProductDetailPage from './pages/products/ProductDetail'
import NotFoundPage from './pages/NotFound'
import { Suspense } from 'react'

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
                    Component: AboutPage,
                },
                {
                    path: 'blogs',
                    lazy: async () => {
                        const { default: BlogRootLayout, } = await import('@/pages/blogs/BlogRootLayout');
                        return { Component: BlogRootLayout };
                    },
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
                {
                    path: 'products',
                    lazy: async () => {
                        const { default: ProductRootLayout } = await import('@/pages/products/ProductRootLayout')
                        return { Component: ProductRootLayout };
                    },
                    children: [
                        {
                            index: true,
                            Component: ProductPage
                        },
                        {
                            path: ':productId',
                            Component: ProductDetailPage
                        }
                    ]
                },
            ]
        },
        {
            path: '/login',
            lazy: async () => {
                const { default: LoginPage } = await import('@/pages/auth/Login')
                return { Component: LoginPage }
            }
        },
        {
            path: '/register',
            lazy: async () => {
                const { default: RegisterPage } = await import('@/pages/auth/Register')
                return { Component: RegisterPage }
            }
        },
        {
            path: '*',
            Component: NotFoundPage
        }
    ])

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <RouterProvider router={router} />
        </Suspense>
    )
}
