import { siteConfig } from "@/config/site";
import MainNavigation from "./MainNavigation";
import MobileNavigation from "./MobileNavigation";
import { ModeToggle } from "../ModeToggle";
import AuthDropdown from "./AuthDropdown";
import CartSheet from "./CartSheet";
import ProgressBar from "../ProgressBar";

export default function Header() {
    return (
        <header className="w-full border-b z-50 fixed top-0 bg-background px-4">
            <nav className="max-w-7xl flex items-center h-16 mx-auto">
                <ProgressBar />
                <MainNavigation items={siteConfig.mainNav} />
                <MobileNavigation items={siteConfig.mainNav} />
                <div className="flex flex-1 justify-end items-center space-x-4">
                    <CartSheet />
                    <ModeToggle />
                    <AuthDropdown/>
                </div>
            </nav>
        </header>
    )
}
