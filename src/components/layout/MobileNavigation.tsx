import type { MainNavItem } from "@/types"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Icons } from "../icons"
import { Link } from "react-router"
import { siteConfig } from "@/config/site"
import { ScrollArea } from "../ui/scroll-area"

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
                <SheetContent side="left" className="py-9 px-5">
                    <SheetClose asChild>
                        <Link to='/' className="flex items-center gap-2">
                            <Icons.logo className="size-7" />
                            <span className="font-bold">{siteConfig.name}</span>
                            <span className="sr-only">Home</span>
                        </Link>
                    </SheetClose>

                    <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-8">
                        <Accordion
                            type="multiple"
                            className="w-full border-b"
                        >
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="">{items?.[0]?.title}</AccordionTrigger>
                                <AccordionContent className="flex flex-col space-y-3 pl-2">
                                    {
                                        items?.[0].card?.map(item => (
                                            <SheetClose asChild key={item.href}>
                                                <Link to={String(item.href)} className="text-muted-foreground">
                                                    {item.title}
                                                </Link>
                                            </SheetClose>
                                        ))
                                    }
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div className="flex flex-col space-y-2 mt-4">
                            {
                                items?.[0]?.menu?.map(item => (
                                    <SheetClose asChild key={item.href}>
                                        <Link to={String(item.href)} className="">
                                            {item.title}
                                        </Link>
                                    </SheetClose>
                                ))
                            }
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    )
}
