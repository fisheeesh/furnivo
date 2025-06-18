import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Outlet } from "react-router";

export default function RootLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
