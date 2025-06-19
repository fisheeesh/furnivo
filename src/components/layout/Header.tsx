import { siteConfig } from "@/config/site";
import MainNavigation from "./MainNavigation";
import MobileNavigation from "./MobileNavigation";
import { ModeToggle } from "../ModeToggle";

export default function Header() {
    return (
        <header className="w-full border-b z-50 fixed top-0 bg-background">
            <nav className="container flex items-center h-16 mx-auto px-4">
                <MainNavigation items={siteConfig.mainNav} />
                <MobileNavigation items={siteConfig.mainNav} />
                <div className="flex flex-1 justify-end items-center space-x-4 mr-4 lg:mr-0">
                    <ModeToggle />
                </div>
            </nav>
        </header>
    )
}
