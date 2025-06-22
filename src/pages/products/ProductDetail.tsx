import { Icons } from "@/components/Icons"
import ProductCard from "@/components/products/ProductCard"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { products } from "@/data/products"
import { Link, useParams } from "react-router"

export default function ProductDetail() {
    const { productId } = useParams()
    const product = products.find(product => product.id === productId)

    return (
        <div className="container mx-auto">
            <Button asChild variant='outline' className="mt-8">
                <Link to='/products' className="flex items-center gap-2">
                    <Icons.arrowLeft /> All Products
                </Link>
            </Button>
            <section className="">

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
