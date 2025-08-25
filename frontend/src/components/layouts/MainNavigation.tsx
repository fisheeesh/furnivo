import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { siteConfig } from "@/config/site"
import type { MainNavItem } from "@/types"
import { Link, useNavigate } from "react-router"
import { Icons } from "../Icons"
import Logo from "../Logo"
import useFilterStore from "@/store/filterStore"

interface MainNavigationProps {
    items?: MainNavItem[]
}

export default function MainNavigation({ items }: MainNavigationProps) {

    return (
        <div className="hidden md:flex gap-4">
            <Logo />
            <NavigationMenu viewport={false}>
                <NavigationMenuList>
                    {
                        items?.[0]?.card && (
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>{items[0].title}</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    className="from-muted/50 to-muted flex size-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                                    to="/"
                                                >
                                                    <Icons.logo className="size-6" aria-hidden="true" />
                                                    <div className="mt-4 mb-2 text-lg font-medium">
                                                        {siteConfig.name}
                                                    </div>
                                                    <p className="text-muted-foreground text-sm leading-tight">
                                                        {siteConfig.description}
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        {
                                            items[0].card.map(item => (
                                                <ListItem key={item.title} href={String(item.href)} title={item.title}>
                                                    {item.description}
                                                </ListItem>
                                            ))
                                        }
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        )
                    }
                    {
                        items?.[0]?.menu &&
                        items[0].menu.map(item => (
                            <NavigationMenuItem key={item.title}>
                                <NavigationMenuLink asChild>
                                    <Link to={String(item.href)} className={navigationMenuTriggerStyle()}>
                                        {item.title}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))
                    }
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    const { setFilters } = useFilterStore()
    const navigate = useNavigate()

    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <div onClick={() => {
                    setFilters([], [href.split("=")[1]])
                    navigate(href)
                }}>
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </div>
            </NavigationMenuLink>
        </li>
    )
}