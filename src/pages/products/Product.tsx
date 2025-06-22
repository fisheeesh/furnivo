import Pagination from "@/components/products/Pagination";
import ProductCard from "@/components/products/ProductCard";
import ProductFilter from "@/components/products/ProductFilter";
import { filterList, products } from "@/data/products";

export default function Product() {
    return (
        <div className="">
            <section className="">
                <section className="">
                    <ProductFilter title="Furnitures Made By" filterList={filterList.categories} />
                    <ProductFilter title="Furnitures Types" filterList={filterList.types} />
                </section>
                <section className="">
                    <h1 className="">All Products</h1>
                    <div className="">
                        {
                            products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        }
                    </div>
                    <Pagination />
                </section>
            </section>
        </div>
    )
}
