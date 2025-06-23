import { createBrowserRouter, RouterProvider } from 'react-router'
import HomePage from '@/pages/Home'
import AboutPage from '@/pages/About'
import RootLayout from './pages/RootLayout'
import ErrorPage from './pages/Error'
import BlogPage from './pages/blogs/Blog'
import BlogDetailPage from './pages/blogs/BlogDetail'
import ProductRootLayout from './pages/products/ProductRootLayout'
import ProductPage from './pages/products/Product'
import ProductDetailPage from './pages/products/ProductDetail'
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
                        const { default: BlogRootLayout } = await import('@/pages/blogs/BlogRootLayout');
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
                    Component: ProductRootLayout,
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
    ])

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <RouterProvider router={router} />
        </Suspense>
    )
}
