import { AiFillHeart } from "react-icons/ai";
import { HiShoppingBag } from "react-icons/hi2";
import { IoIosPerson } from "react-icons/io";
import { Link, useLocation } from "react-router";

const navLinks = [
    {
        name: 'My Profile',
        href: '/settings',
        icon: < IoIosPerson className='h-5 w-5' />,
    },
    {
        name: 'My Orders',
        href: '/settings/my-orders',
        icon: <HiShoppingBag className='h-5 w-5' />,
    },
    {
        name: 'My Favorites',
        href: '/settings/my-favorites',
        icon: <AiFillHeart className='h-5 w-5' />,
    },
];


export default function SideNavigation() {
    const location = useLocation()

    const isActive = (href: string) => `${location.pathname === href ? 'bg-own text-white' : ''} py-3 px-5 hover:bg-own hover:text-white rounded-md transition-colors flex items-center gap-4 font-semibold`

    return (
        <nav className='hidden lg:block'>
            <ul className='flex flex-col gap-2 h-full'>
                {navLinks.map((link) => (
                    <li key={link.name} className="">
                        <Link
                            className={isActive(link.href)}
                            to={link.href}>
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
