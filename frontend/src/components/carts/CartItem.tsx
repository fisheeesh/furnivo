import { formatPrice } from "@/lib/utils"
import type { Cart } from "@/types"
import { Separator } from "../ui/separator"
import Editable from "./Editable"

interface CartItemProps {
    cart: Cart
}


export default function CartItem({ cart }: CartItemProps) {
    return (
        <div className="space-y-3">
            <div className="flex gap-4 mb-2 mt-4">
                <img src={cart.image.url} alt={cart.image.name} className="object-cover w-16" />
                <div className="flex flex-col space-y-1">
                    <span className="line-clamp-1 font-medium text-sm">{cart.name}</span>
                    <span className="text-xs text-muted-foreground">{formatPrice(cart.price)} x {cart.quantity} = {formatPrice((cart.price * cart.quantity).toFixed(2))}</span>
                    <span className="line-clamp-1 text-xs capitalize text-muted-foreground">{cart.category} / {cart.subcategory}</span>
                </div>
            </div>
            <Editable />
            <Separator className="" />
        </div>
    )
}
