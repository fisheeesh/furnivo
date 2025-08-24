
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type ControllerRenderProps, type SubmitHandler } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Icons } from "../Icons"
import { QuantitySchema } from "@/lib/validator"
import useCartStore from "@/store/cartStore"
import { useEffect } from "react"

interface AddToCartFormProps {
    sold: boolean
    onHandleCart: (quantity: number) => void,
    idInCart: number
}

export default function AddToCartForm({ sold, onHandleCart, idInCart }: AddToCartFormProps) {
    const cartItem = useCartStore(state => state.carts.find(i => i.id === idInCart))

    const form = useForm<z.infer<typeof QuantitySchema>>({
        defaultValues: {
            quantity: cartItem ? cartItem.quantity.toString() : "1"
        },
        resolver: zodResolver(QuantitySchema)
    })

    const { setValue, watch } = form
    const currentQuantity = Number(watch("quantity"))

    const handleDecrease = () => {
        const newQuantity = Math.max(currentQuantity - 1, 0)
        setValue("quantity", newQuantity.toString(), { shouldValidate: true })
    }

    const handleIncrease = () => {
        const newQuantity = Math.min(currentQuantity + 1, 9999)
        setValue("quantity", newQuantity.toString(), { shouldValidate: true })
    }

    useEffect(() => {
        if (cartItem) {
            setValue("quantity", cartItem.quantity.toString(), { shouldValidate: true })
        }
    }, [cartItem, setValue])

    const onSubmit: SubmitHandler<z.infer<typeof QuantitySchema>> = (data) => {
        onHandleCart(Number(data.quantity))
        toast.success("Success", {
            description: cartItem ? "Successfully updated quantity" : "Successfully added to cart"
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-w-[260px] gap-4 flex-col">
                <div className="flex items-center">
                    <Button
                        onClick={handleDecrease}
                        disabled={currentQuantity <= 1}
                        type="button"
                        variant='outline'
                        size='icon'
                        className="size-8 shrink-0 rounded-r-none cursor-pointer"
                    >
                        <Icons.minus className="size-3" aria-hidden="true" />
                        <span className="sr-only">Remove one item</span>
                    </Button>
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof QuantitySchema>, "quantity"> }) => (
                            <FormItem className="space-y-0">
                                <FormLabel className="sr-only">Quantity</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        min={1}
                                        max={9999}
                                        className="h-8 w-16 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        disabled={form.formState.isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        onClick={handleIncrease}
                        disabled={currentQuantity >= 9999}
                        type="button"
                        variant='outline'
                        size='icon'
                        className="size-8 shrink-0 rounded-l-none cursor-pointer"
                    >
                        <Icons.plus className="size-3" aria-hidden="true" />
                        <span className="sr-only">Add one item</span>
                    </Button>
                </div>
                <div className="flex items-center space-x-2.5">
                    <Button disabled={sold} type="button" size='sm' className={cn(sold && 'bg-muted-foreground', "w-fit px-8 font-bold bg-own text-white hover:bg-own-hover cursor-pointer")} aria-label="Buy Now">
                        Buy Now
                    </Button>
                    <Button size='sm' type="submit" variant={sold ? 'default' : 'outline'} className="w-fit px-8 font-semibold cursor-pointer" aria-label="Add to Cart">
                        {
                            cartItem ? "Update Cart" : "Add to Cart"
                        }
                    </Button>
                </div>
            </form>
        </Form>
    )
}