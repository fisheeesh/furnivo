import AccountPanel from "@/components/profile/AccountPanel";
import SideNavigation from "@/components/profile/SideNavigation";
import { Outlet } from "react-router";

export default function SettingsRootLayout() {
    return (
        <div className="lg:grid lg:grid-cols-[16rem_1fr] h-full gap-12 max-w-7xl mx-auto space-y-6 my-8">
            <SideNavigation />
            <AccountPanel />
            <div className="py-1 mt-5 lg:mt-0">
                <Outlet />
            </div>
        </div>
    )
}
