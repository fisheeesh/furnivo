import { Icons } from "@/components/Icons"
import { Button } from "@/components/ui/button"
import { useLoaderData, useNavigate } from "react-router"

import Autoplay from "embla-carousel-autoplay"

import { oneProductQuery, productQuery } from "@/api/query"
import AddToCartForm from "@/components/products/AddToCartForm"
import AddToFavorite from "@/components/products/AddToFavorite"
import ProductCard from "@/components/products/ProductCard"
import Rating from "@/components/products/Rating"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"
import { ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import useTitle from "@/hooks/useTitle"
import { IMG_URL } from "@/lib/constants"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useRef } from "react"

export default function ProductDetail() {
    const { productId } = useLoaderData()
    const { data: productData } = useSuspenseQuery(oneProductQuery(productId))
    const { data: productsData } = useSuspenseQuery(productQuery("?limit=6"))

    const navigate = useNavigate()

    useTitle(productData.product.name)

    const showCaseProducts = productsData.products.filter((product: Product) => product.id !== productData.product.id)

    const plugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    )

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <Button onClick={() => navigate(-1)} variant='outline' className="mt-8 cursor-pointer">
                <Icons.arrowLeft /> All Products
            </Button>
            <section className="flex flex-col gap-8 md:flex-row md:gap-16">
                <Carousel
                    plugins={[plugin.current]}
                    className="w-full md:w-1/2"
                >
                    <CarouselContent>
                        {productData.product?.images.map((image: { id: string, path: string }) => (
                            <CarouselItem key={image.id}>
                                <div className="p-1">
                                    <img loading="lazy" decoding="async" src={IMG_URL + image.path} alt={productData.product.name} className="size-full rounded-md object-cover" />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <Separator className="mt-4 md:hidden" />
                <div className="flex w-full flex-col gap-4 md:w-1/2">
                    <div className="space-y-2">
                        <h2 className="line-clamp-1 text-2xl font-bold">{productData.product?.name}</h2>
                        <p className="text-base text-muted-foreground">
                            {formatPrice(productData.product.price - productData.product.discount)}
                            {productData.product.discount > 0 && (
                                <span className="ml-2 font-extralight line-through">{formatPrice(productData.product.price)}</span>
                            )}
                        </p>
                    </div>
                    <Separator className="my-1.5" />
                    <p className="text-base text-muted-foreground">{productData.product?.inventory} in stock</p>
                    <div className="flex items-center justify-between">
                        <Rating rating={Number(productData.product?.rating)} />
                        <AddToFavorite productId={String(productData.product?.id)} rating={Number(productData.product?.rating)} />
                    </div>
                    <AddToCartForm sold={productData.product?.status === 'ACTIVE' ? false : true} />
                    <Separator className="mt-5" />
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue="item-1"
                    >
                        <AccordionItem value="item-1" className="border-none">
                            <AccordionTrigger className="text-base cursor-pointer">Description</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                {productData.product?.description ?? 'No description is available for this product.'}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>
            <section className="space-y-6 overflow-hidden">
                <h2 className="line-clamp-1 text-2xl font-bold">More Products from Funiture Shop</h2>
                <ScrollArea className="pb-8">
                    <div className="flex gap-4">
                        {showCaseProducts.slice(0, 4).map((item: Product) => (
                            <ProductCard key={item.id} product={item} className="min-w-[260px]" />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </section>
        </div>
    )
}
