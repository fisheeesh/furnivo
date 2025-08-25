import { AiFillHeart } from "react-icons/ai";
import { HiShoppingBag } from "react-icons/hi2";
import { IoIosPerson } from "react-icons/io";
import { Link, useLocation } from "react-router";

const navLinks = [
    {
        name: 'My Profile',
        href: '/settings',
        icon: < IoIosPerson className='hidden md:block h-5 w-5' />,
    },
    {
        name: 'My Orders',
        href: '/settings/my-orders',
        icon: <HiShoppingBag className='hidden md:block h-5 w-5' />,
    },
    {
        name: 'My Favorites',
        href: '/settings/my-favorites',
        icon: <AiFillHeart className='hidden md:block h-5 w-5' />,
    },
];

export default function AccountPanel() {
    const location = useLocation()

    const isActive = (href: string) => `${location.pathname === href ? 'bg-own text-white' : ''} py-2 px-5 hover:bg-own hover:text-white text-sm transition-colors flex items-center gap-4 font-semibold`

    return (
        <div className="flex h-fit lg:hidden justify-end">
            <div className="border border-own flex justify-end items-center">
                {
                    navLinks.map(link => (
                        <Link
                            key={link.name}
                            className={isActive(link.href)}
                            to={link.href}>
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}
