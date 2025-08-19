import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function AuthRootLayout() {
    return (
        <div>
            <Outlet />
            <Toaster richColors />
        </div>
    )
}

