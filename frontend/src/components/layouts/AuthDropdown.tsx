import { Link } from "react-router"
import { Button } from "../ui/button"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IMG_URL } from "@/lib/constants"
import useUserStore from "@/store/userStore"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { useRef } from "react"
import { Icons } from "../Icons"
import LogoutModal from "../auth/LogoutModal"
import { Dialog } from "../ui/dialog"

export default function AuthDropdown() {
    const dialogTriggerRef = useRef<HTMLButtonElement>(null)

    const { user } = useUserStore()

    if (!user) {
        return (
            <Button asChild>
                <Link to='/login'>
                    Sign In
                    <span className="sr-only">Sign In Button</span>
                </Link>
            </Button>
        )
    }

    const initialName = `${user.firstName?.charAt(0).toUpperCase()}${user.lastName?.charAt(0).toUpperCase()}`

    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="size-8 rounded-full cursor-pointer">
                        <Avatar className="size-8">
                            <AvatarImage src={IMG_URL + user.avatar} alt={initialName} />
                            <AvatarFallback>{initialName}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal mb-1">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none truncate">{user.firstName} {user.lastName}</p>
                            <p className="text-xs leading-none text-muted-foreground truncate">{user.email || "unspecified"}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to='/admin'>
                                <Icons.dashbord className="size-4 text-black mr-1 dark:text-white" aria-hidden="true" />
                                Dashboard
                                <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to='/admin'>
                                <Icons.card className="size-4 text-black mr-1 dark:text-white" aria-hidden="true" />
                                Billing
                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to='/settings'>
                                <Icons.settings className="size-4 text-black mr-1 dark:text-white" aria-hidden="true" />
                                Settings
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault()
                            dialogTriggerRef.current?.click()
                        }}
                        className="cursor-pointer"
                    >
                        <Icons.exist className="size-4 mr-1 text-sm dark:text-white" aria-hidden="true" />
                        Logout
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogTrigger asChild>
                <button ref={dialogTriggerRef} className="hidden" />
            </DialogTrigger>
            <LogoutModal />
        </Dialog>
    )
}
