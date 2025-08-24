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
import { ProductFilterSchema } from "@/lib/validator"
import type { Category, Type } from "@/types"
import useFilterStore from "@/store/filterStore"
import { useEffect } from "react"

interface FilterProps {
    filterList: { categories: Category[], types: Type[] },
    selectedCategories: string[],
    selectedTypes: string[],
    onFilterChange: (categories: string[], types: string[]) => void
}

export default function ProudctFilter({ filterList, selectedCategories, selectedTypes, onFilterChange }: FilterProps) {
    const { setFilters, categories, types } = useFilterStore()
    const form = useForm<z.infer<typeof ProductFilterSchema>>({
        resolver: zodResolver(ProductFilterSchema),
        defaultValues: {
            categories: selectedCategories.length > 0 ? selectedCategories : categories,
            types: selectedTypes.length > 0 ? selectedTypes : types,
        },
    })

    useEffect(() => {
        if (categories.length > 0 || types.length > 0) {
            onFilterChange(categories, types)
        }
    }, [categories, types, onFilterChange])

    function onSubmit(data: z.infer<typeof ProductFilterSchema>) {
        setFilters(data.categories, data.types)
        onFilterChange(data.categories, data.types)
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
                                                        checked={field.value?.includes(String(item.id))}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, String(item.id)])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== String(item.id)
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">
                                                    {item.name}
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
                                                        checked={field.value?.includes(String(item.id))}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, String(item.id)])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== String(item.id)
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">
                                                    {item.name}
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
                <Button type="submit" variant='outline' className="cursor-pointer">Filter</Button>
            </form>
        </Form>
    )
}
