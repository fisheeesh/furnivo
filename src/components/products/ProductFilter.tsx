import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type ControllerRenderProps } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import type { Category } from "@/types"
import { toast } from "sonner"
import { ProductFilterSchema } from "@/lib/validator"

interface FilterProps {
    filterList: { categories: Category[], types: Category[] }
}

export default function ProudctFilter({ filterList }: FilterProps) {
    const form = useForm<z.infer<typeof ProductFilterSchema>>({
        resolver: zodResolver(ProductFilterSchema),
        defaultValues: {
            categories: [],
            types: [],
        },
    })

    function onSubmit(data: z.infer<typeof ProductFilterSchema>) {
        toast.success(`You have selected ${data.categories.length} categories and ${data.types.length} types`)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="categories"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Furniture Made By</FormLabel>
                            </div>
                            {filterList.categories.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="categories"
                                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof ProductFilterSchema>, "categories"> }) => {
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-center gap-2"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, item.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== item.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="types"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Furniture Types</FormLabel>
                            </div>
                            {filterList.types.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="types"
                                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof ProductFilterSchema>, "types"> }) => {
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-center gap-2"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, item.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== item.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" variant='outline'>Filter</Button>
            </form>
        </Form>
    )
}
