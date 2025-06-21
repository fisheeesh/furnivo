import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Outlet } from "react-router";

export default function RootLayout() {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <Header />
            <main className="flex-1 mt-16 px-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
