import AboutPage from '@/pages/About'
import HomePage from '@/pages/Home'
import { Suspense } from 'react'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router'
import ErrorPage from './pages/Error'
import NotFoundPage from './pages/NotFound'
import RootLayout from './pages/RootLayout'
import BlogPage from './pages/blogs/Blog'
import BlogDetailPage from './pages/blogs/BlogDetail'
import ProductPage from './pages/products/Product'
import ProductDetailPage from './pages/products/ProductDetail'
import { loginAction, logoutAction } from './router/actions'
import { homeLoader, loginLoader } from './router/loaders'

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
                    loader: homeLoader,
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
                const { default: LoginPage, } = await import('@/pages/auth/Login')
                return { Component: LoginPage }
            },
            loader: loginLoader,
            action: loginAction
        },
        {
            path: '/register',
            lazy: async () => {
                const { default: RegisterPage } = await import('@/pages/auth/Register')
                return { Component: RegisterPage }
            }
        },
        {
            path: "/logout",
            action: logoutAction,
            loader: () => redirect("/")
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
