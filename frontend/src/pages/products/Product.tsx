import { categoryTypeQuery, productInfiniteQuery, queryClient } from "@/api/query";
import ProductCard from "@/components/products/ProductCard";
import ProductFilter from "@/components/products/ProductFilter";
import { Button } from "@/components/ui/button";
import useTitle from "@/hooks/useTitle";
import type { Product } from "@/types";
import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSearchParams } from "react-router";

export default function Product() {
    useTitle("Products")

    const [searchParams, setSearchParams] = useSearchParams()

    const rawCategories = searchParams.get('categories')
    const rawTypes = searchParams.get('types')

    //* Decode & parase search params
    const selectedCategories = rawCategories ? decodeURIComponent(rawCategories)
        .split(",")
        .map(cat => Number(cat.trim()))
        .filter(cat => !isNaN(cat))
        .map(cat => cat.toString()) : []

    const selectedTypes = rawTypes ? decodeURIComponent(rawTypes)
        .split(",")
        .map(type => Number(type.trim()))
        .filter(type => !isNaN(type))
        .map(type => type.toString()) : []

    const cat = selectedCategories?.length > 0 ? selectedCategories?.join(",") : null
    const type = selectedTypes.length > 0 ? selectedTypes.join(",") : null

    const { data: catTypes } = useSuspenseQuery(categoryTypeQuery())
    const {
        status,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        refetch
    } = useInfiniteQuery(productInfiniteQuery(cat, type))

    const allProducts = data?.pages.flatMap(page => page.products) ?? []

    const handleFilterChange = useCallback((categories: string[], types: string[]) => {
        const newParams = new URLSearchParams()
        if (categories.length > 0)
            newParams.set("categories", encodeURIComponent(categories.join(",")))
        if (types.length > 0)
            newParams.set("types", encodeURIComponent(types.join(",")))

        //* Updates URL & triggers refetch via query key
        setSearchParams(newParams)
        //* Cancel In-flight queries
        queryClient.cancelQueries({ queryKey: ["products", "infinite"] })
        //* Clear cache
        queryClient.removeQueries({ queryKey: ["products", "infinite"] })
        //* refetch
        refetch()
    }, [refetch, setSearchParams])

    return status === 'pending'
        ? (<p>Loading...</p>)
        : status === 'error'
            ? (<p>Error: {error.message}</p>)
            : (<div className="max-w-7xl mx-auto">
                <section className="flex flex-col lg:flex-row">
                    <section className="my-8 w-full lg:w-1/5">
                        <ProductFilter filterList={catTypes}
                            selectedCategories={selectedCategories}
                            selectedTypes={selectedTypes}
                            onFilterChange={handleFilterChange} />
                    </section>
                    <section className="w-full lg:w-4/5 my-8 space-y-4">
                        <h1 className="text-2xl font-bold">All Products</h1>
                        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-6">
                            {
                                allProducts.map((product: Product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            }
                        </div>
                        <div className="my-4 flex items-center justify-center">
                            <Button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} variant={!hasNextPage ? 'ghost' : 'secondary'}>
                                {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load More" : "Nothing more to load"}
                            </Button>
                        </div>
                        <div className="">
                            {isFetching && !isFetchingNextPage ? "Background Updating..." : null}
                        </div>
                    </section>
                </section>
            </div>)
}
