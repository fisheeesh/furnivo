import MainNavigation from "./MainNavigation";

export default function Header() {
    return (
        <header className="w-full border-b">
            <div className="container flex items-center h-16">
                <MainNavigation />
            </div>
        </header>
    )
}
