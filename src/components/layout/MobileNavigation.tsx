import type { MainNavItem } from "@/types"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet"
import { Icons } from "../icons"

interface MainNavigationProps {
    items?: MainNavItem[]
}

export default function MobileNavigation({ items }: MainNavigationProps) {
    return (
        <div className="lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-4">
                        <Icons.menu aria-hidden="true" className="size-7" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pl-1 pr-0 pt-9">
                </SheetContent>
            </Sheet>
        </div>
    )
}
