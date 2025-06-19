import Autoplay from "embla-carousel-autoplay"
import * as React from "react"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import type { Product } from "@/types"
import { Link } from "react-router"

interface ProductProps {
    products: Product[]
}

export default function CarouselCard({ products }: ProductProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 300, stopOnInteraction: true })
    )

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent className="-ml-1">
                {products.map((product) => (
                    <CarouselItem
                        key={product.id}
                        className="pl-1 lg:basis-1/3">
                        <div className="p-4 flex lg:px-4 gap-4">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="size-28 rounded-md"
                            />
                            <div className="">
                                <h3 className="text-sm font-bold line-clamp-1">{product.name}</h3>
                                <p className="my-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                                <Link
                                    className="text-sm font-semibold text-own hover:underline"
                                    to={`/products/${product.id}`}
                                >Read More</Link>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
