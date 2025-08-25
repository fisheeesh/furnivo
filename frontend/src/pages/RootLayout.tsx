import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import ScrollTopBtn from "@/components/layouts/ScrollTopBtn";
import { Outlet, useLocation } from "react-router";

export default function RootLayout() {
    const location = useLocation()

    const removeFooterPath = ["/settings", "/settings/my-favorites", "/settings/my-orders"]

    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <Header />
            <main className="flex-1 mt-16 px-4">
                <Outlet />
                <ScrollTopBtn />
            </main>
            {!removeFooterPath.includes(location.pathname) && <Footer />}
        </div>
    )
}
