import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import { Icons } from "../Icons"
import { Separator } from "../ui/separator"
import { cartItems } from "@/data/carts"
import { Link } from "react-router"
import { ScrollArea } from "../ui/scroll-area"
import CartItem from "../carts/CartItem"
import { formatPrice } from "@/lib/utils"

export default function CartSheet() {
    const itemCount = 4
    const amountTotal = 190

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size='icon' className="relative cursor-pointer" aria-label="Open Cart">
                    <Badge variant='destructive' className="h-5 min-w-5 absolute -top-2 -right-2 rounded-full px-1">
                        {itemCount}
                    </Badge>
                    <Icons.cart className="size-4" aria-hidden="true" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full md:max-w-lg space-y-0 gap-0">
                <SheetHeader className="pb-0">
                    <SheetTitle className="text-center text-2xl">Cart - {itemCount}</SheetTitle>
                </SheetHeader>
                <Separator className="mt-4 mb-2" />
                {
                    cartItems.length > 0 ? (
                        <>
                            <ScrollArea className="my-4 h-[calc(100vh-19rem)] px-4">
                                {
                                    cartItems.map(item => (
                                        <CartItem key={item.id} cart={item} />
                                    ))
                                }
                            </ScrollArea>
                            <SheetFooter className="">
                                <Separator className="my-2" />
                                <div className="space-y-2 text-sm mb-2">
                                    <div className="flex items-center gap-1 justify-between">
                                        <span className="font-medium">Shipping</span>
                                        <span className="">Free</span>
                                    </div>
                                    <div className="flex items-center gap-1 justify-between">
                                        <span className="font-medium">Taxes</span>
                                        <span className="">Calculated at checkout</span>
                                    </div>
                                    <div className="flex items-center gap-1 justify-between">
                                        <span className="font-medium">Total</span>
                                        <span className="font-semibold">{formatPrice(amountTotal.toFixed(2))}</span>
                                    </div>
                                </div>
                                <SheetClose asChild>
                                    <Button type="submit" asChild className="h-12">
                                        <Link to='/check-out' aria-label="Check Out" className="">
                                            Continue to checkout
                                        </Link>
                                    </Button>
                                </SheetClose>
                            </SheetFooter>
                        </>
                    ) : (
                        <div className="flex h-full justify-center items-center space-y-1">
                            <Icons.cart className="size-16 mb-4 text-muted-foreground" />
                            <div className="text-xl font-medium text-muted-foreground">Your cart is empty.</div>
                        </div>
                    )
                }

            </SheetContent>
        </Sheet>
    )
}
