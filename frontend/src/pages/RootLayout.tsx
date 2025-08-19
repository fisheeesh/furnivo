import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import ScrollTopBtn from "@/components/layouts/ScrollTopBtn";
import { Toaster } from "@/components/ui/sonner"
import { Outlet } from "react-router";

export default function RootLayout() {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <Header />
            <main className="flex-1 mt-16 px-4">
                <Outlet />
                <ScrollTopBtn />
            </main>
            <Toaster richColors />
            <Footer />
        </div>
    )
}
