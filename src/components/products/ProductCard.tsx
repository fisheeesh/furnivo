import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types"
import { Link } from "react-router"
import { Icons } from "../Icons"
import { formatPrice } from "@/lib/utils"

interface Props {
    product: Product
}

export default function ProductCard({ product }: Props) {
    return (
        <div className="size-full overflow-hidden rounded-lg p-0 pb-4 border">
            <Link to={`/products/${product.id}`} aria-label={product.name} className="p-0">
                <div className="p-0">
                    <AspectRatio ratio={1 / 1} className="border-b">
                        <img src={product.images[0]} alt={product.name} className="size-full object-cover" loading="lazy" />
                    </AspectRatio>
                </div>
            </Link>
            <div className="space-y-1.5 px-4 py-2">
                <p className="line-clamp-1">{product.name}</p>
                <div className="line-clamp-1 text-gray-400">
                    {formatPrice(product.price)}
                    {product.discount > 0 && (
                        <span className="ml-2 font-extralight line-through">{formatPrice(product.discount)}</span>
                    )}
                </div>
            </div>
            <div className="px-4">
                {
                    product.status === 'sold' ?
                        (
                            <Button size='sm' disabled={true} aria-label="Sold Out Button" className="h-10 w-full rounded-sm font-bold">
                                Sold Out
                            </Button>
                        ) :
                        (
                            <Button size='sm' aria-label="Add to Cart Button" className="w-full h-10 rounded-sm font-bold bg-own">
                                <Icons.plus /> Add to Cart
                            </Button>
                        )
                }
            </div>
        </div>
    )
}
