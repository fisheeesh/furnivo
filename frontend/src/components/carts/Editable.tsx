
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type ControllerRenderProps } from "react-hook-form"
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
import { QuantitySchema } from "@/lib/validator"
import { Icons } from "../Icons"

interface Props {
    onDelete: () => void
    quantity: number,
    onUpdate: (quantity: number) => void
}

export default function Editable({ onDelete, quantity, onUpdate }: Props) {
    const form = useForm<z.infer<typeof QuantitySchema>>({
        defaultValues: {
            quantity: quantity.toString()
        },
        resolver: zodResolver(QuantitySchema)
    })

    const { setValue, watch } = form
    const currentQuantity = Number(watch("quantity"))

    const handleDecrease = () => {
        const newQuantity = Math.max(currentQuantity - 1, 1) //* Min limit 0
        setValue("quantity", newQuantity.toString(), { shouldValidate: true })
        onUpdate(newQuantity)
    }

    const handleIncrease = () => {
        const newQuantity = Math.min(currentQuantity + 1, 9999) //* Max limit 9999
        setValue("quantity", newQuantity.toString(), { shouldValidate: true })
        onUpdate(newQuantity)
    }

    return (
        <Form {...form}>
            <form className="flex w-full justify-between">
                <div className="flex items-center">
                    <Button
                        onClick={handleDecrease}
                        disabled={currentQuantity === 0}
                        type="button"
                        variant='outline'
                        size='icon'
                        className="size-8 shrink-0 rounded-r-none"
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
                                        min={0}
                                        className="h-8 w-16 rounded-none border-x-0"
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
                        disabled={currentQuantity > 9999}
                        type="button"
                        variant='outline'
                        size='icon'
                        className="size-8 shrink-0 rounded-l-none"
                    >
                        <Icons.plus className="size-3" aria-hidden="true" />
                        <span className="sr-only">Add one item</span>
                    </Button>
                </div>
                <Button
                    onClick={onDelete}
                    type="button"
                    size='icon'
                    variant='outline'
                    aria-label="Delete cart item"
                >
                    <Icons.trash className="size-3" aria-hidden="true" />
                    <span className="sr-only">Delete Item</span>
                </Button>
            </form>
        </Form>
    )
}