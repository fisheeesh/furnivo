import { Icons } from "@/components/Icons"
import ProductCard from "@/components/products/ProductCard"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { products } from "@/data/products"
import { Link, useParams } from "react-router"

import Autoplay from "embla-carousel-autoplay"

import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { useRef } from "react"
import { formatPrice } from "@/lib/utils"
import Rating from "@/components/products/Rating"
import AddToFavorite from "@/components/products/AddToFavorite"
import AddToCartForm from "@/components/products/AddToCartForm"
import useTitle from "@/hooks/useTitle"

export default function ProductDetail() {
    const { productId } = useParams()
    const product = products.find(product => product.id === productId)

    if (!product) throw new Error("Product not found")

    useTitle(product.name)

    const plugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    )

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <Button asChild variant='outline' className="mt-8">
                <Link to='/products' className="flex items-center gap-2">
                    <Icons.arrowLeft /> All Products
                </Link>
            </Button>
            <section className="flex flex-col gap-8 md:flex-row md:gap-16">
                <Carousel
                    plugins={[plugin.current]}
                    className="w-full md:w-1/2"
                >
                    <CarouselContent>
                        {product?.images.map((image) => (
                            <CarouselItem key={image}>
                                <div className="p-1">
                                    <img src={image} alt={product.name} className="size-full rounded-md object-cover" />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <Separator className="mt-4 md:hidden" />
                <div className="flex w-full flex-col gap-4 md:w-1/2">
                    <div className="space-y-2">
                        <h2 className="line-clamp-1 text-2xl font-bold">{product?.name}</h2>
                        <p className="text-base text-muted-foreground">{formatPrice(Number(product?.price))}</p>
                    </div>
                    <Separator className="my-1.5" />
                    <p className="text-base text-muted-foreground">{product?.inventory} in stock</p>
                    <div className="flex items-center justify-between">
                        <Rating rating={Number(product?.rating)} />
                        <AddToFavorite productId={String(product?.id)} rating={Number(product?.rating)} />
                    </div>
                    <AddToCartForm sold={product?.status === 'active' ? false : true} />
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
                                {product?.description ?? 'No description is available for this product.'}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>
            <section className="space-y-6 overflow-hidden">
                <h2 className="line-clamp-1 text-2xl font-bold">More Products from Funiture Shop</h2>
                <ScrollArea className="pb-8">
                    <div className="flex gap-4">
                        {products.slice(0, 4).map((item) => (
                            <ProductCard key={item.id} product={item} className="min-w-[260px]" />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </section>
        </div>
    )
}
