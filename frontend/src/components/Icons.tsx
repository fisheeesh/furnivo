import { ArrowLeftIcon, CreditCard, Heart, Layers, LayoutDashboard, LogOut, MinusIcon, PlusIcon, Settings, Star, ArrowUp } from "lucide-react";
import { BiMenuAltLeft } from "react-icons/bi";
import { BsExclamationTriangle } from "react-icons/bs";
import { FaPaperPlane, FaRegTrashAlt } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";

export type IconProps = React.HTMLAttributes<SVGElement>

export const Icons = {
    logo: (props: IconProps) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
            <path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z" />
            <path d="M4 18v2" />
            <path d="M20 18v2" />
            <path d="M12 4v9" />
        </svg>
    ),
    menu: BiMenuAltLeft,
    paperPlane: FaPaperPlane,
    exclamation: BsExclamationTriangle,
    arrowLeft: ArrowLeftIcon,
    layers: Layers,
    plus: PlusIcon,
    minus: MinusIcon,
    star: Star,
    heart: Heart,
    dashbord: LayoutDashboard,
    settings: Settings,
    card: CreditCard,
    exist: LogOut,
    cart: GiShoppingCart,
    trash: FaRegTrashAlt,
    up: ArrowUp
}