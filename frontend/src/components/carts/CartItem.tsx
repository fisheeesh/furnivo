import { formatPrice } from "@/lib/utils"
import type { Cart } from "@/types"
import { Separator } from "../ui/separator"
import Editable from "./Editable"
import { IMG_URL } from "@/lib/constants"
import useCartStore from "@/store/cartStore"

interface CartItemProps {
    cart: Cart
}

export default function CartItem({ cart }: CartItemProps) {
    const { updateItem, removeItem } = useCartStore()

    const updateHandler = (quantity: number) => {
        updateItem(cart.id, quantity)
    }

    const deleteHandler = () => {
        removeItem(cart.id)
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-4 mb-2 mt-4">
                <img
                    loading="lazy"
                    decoding="async"
                    src={IMG_URL + cart.image}
                    alt={cart.name}
                    className="object-cover w-16"
                />
                <div className="flex flex-col space-y-1">
                    <span className="line-clamp-1 font-medium text-sm">{cart.name}</span>
                    <span className="text-xs text-muted-foreground">{formatPrice(cart.price)} x {cart.quantity} = {formatPrice((cart.price * cart.quantity).toFixed(2))}</span>
                </div>
            </div>
            <Editable onDelete={deleteHandler} quantity={cart.quantity} onUpdate={updateHandler} />
            <Separator />
        </div>
    )
}
