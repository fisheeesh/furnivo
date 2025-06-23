
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

const quantitySchema = z.object({
    quantity: z.number().min(0)
})

interface AddToCartFormProps {
    sold: boolean
}

export default function AddToCartForm({ sold }: AddToCartFormProps) {
    const form = useForm<z.infer<typeof quantitySchema>>({
        defaultValues: {
            quantity: 1
        },
        resolver: zodResolver(quantitySchema)
    })

    const onSubmit: SubmitHandler<z.infer<typeof quantitySchema>> = async () => {
        toast("Added to cart")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-w-[260px] gap-4 flex-col">
                <div className="flex items-center">
                    <Button type="button" variant='outline' size='icon' className="size-8 shrink-0 rounded-r-none">
                        <Icons.minus className="size-3" aria-hidden="true" />
                        <span className="sr-only">Remove one item</span>
                    </Button>
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof quantitySchema>, "quantity"> }) => (
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
                    <Button type="button" variant='outline' size='icon' className="size-8 shrink-0 rounded-l-none">
                        <Icons.plus className="size-3" aria-hidden="true" />
                        <span className="sr-only">Add one item</span>
                    </Button>
                </div>
                <div className="flex items-center space-x-2.5">
                    <Button disabled={sold} type="button" size='sm' className={cn(sold && 'bg-muted-foreground', "w-fit px-8 font-bold bg-own")} aria-label="Buy Now">
                        Buy Now
                    </Button>
                    <Button size='sm' type="submit" variant={sold ? 'default' : 'outline'} className="w-fit px-8 font-semibold" aria-label="Add to Cart">
                        Add to Cart
                    </Button>
                </div>
            </form>
        </Form>
    )
}