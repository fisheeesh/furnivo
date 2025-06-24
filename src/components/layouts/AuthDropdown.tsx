import type { User } from "@/types"
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
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Icons } from "../Icons"

interface UserProps {
    user: User
}

export default function AuthDropdown({ user }: UserProps) {
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

    const initialName = `${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="size-8 rounded-full cursor-pointer">
                    <Avatar className="size-8">
                        <AvatarImage src={user.imageUrl} alt={initialName} />
                        <AvatarFallback>{initialName}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal mb-1">
                    <div className="flex flex-col space-y-1">
                        <p className="textsm font-medium leading-none">{user.firstName} {user.lastName}</p>
                        <p className="text-sm leading-none text-muted-foreground">{user.email}</p>
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
                        <Link to='/admin'>
                            <Icons.settings className="size-4 text-black mr-1 dark:text-white" aria-hidden="true" />
                            Settings
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to='/login'>
                        <Icons.exist className="size-4 text-black mr-1 dark:text-white" aria-hidden="true" />
                        Logout
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
