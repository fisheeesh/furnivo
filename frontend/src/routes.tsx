import AboutPage from '@/pages/About'
import HomePage from '@/pages/Home'
import { Suspense } from 'react'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router'
import ErrorPage from './pages/Error'
import NotFoundPage from './pages/NotFound'
import RootLayout from './pages/RootLayout'
import ConfirmPasswordPage from './pages/auth/ConfirmPassword'
import OTPPage from './pages/auth/OTP'
import SignUpPage from './pages/auth/SignUp'
import BlogPage from './pages/blogs/Blog'
import BlogDetailPage from './pages/blogs/BlogDetail'
import ProductPage from './pages/products/Product'
import ProductDetailPage from './pages/products/ProductDetail'
import { confirmPasswordAction, loginAction, logoutAction, OTPAction, registerAction } from './router/actions'
import { blogInfiniteLoader, confirmPasswordLoader, homeLoader, loginLoader, OTPLoader, postLoader } from './router/loaders'

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
                            Component: BlogPage,
                            loader: blogInfiniteLoader
                        },
                        {
                            path: ':postId',
                            Component: BlogDetailPage,
                            loader: postLoader
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
                const { default: AuthRootLayout } = await import('@/pages/auth/AuthRootLayout')
                return { Component: AuthRootLayout }
            },
            children: [
                {
                    index: true,
                    Component: SignUpPage,
                    loader: loginLoader,
                    action: registerAction
                },
                {
                    path: "otp",
                    Component: OTPPage,
                    loader: OTPLoader,
                    action: OTPAction
                },
                {
                    path: "confirm-password",
                    Component: ConfirmPasswordPage,
                    loader: confirmPasswordLoader,
                    action: confirmPasswordAction
                }
            ]
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
