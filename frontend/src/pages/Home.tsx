import BlogCard from '@/components/blogs/BlogCard'
import CarouselCard from '@/components/products/CarouselCard'
import ProductCard from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import Couch from '@/data/images/couch.png'
import { posts } from '@/data/posts'
import { products } from '@/data/products'
import { Link } from 'react-router'

export default function Home() {
  const Title = ({ title, href, sideText }: { title: string; href: string; sideText: string }) => (
    <div className='flex md:items-center flex-col mt-28 mb-10 md:flex-row md:justify-between'>
      <h2 className='text-2xl font-bold mb-4 md:mb-0'>{title}</h2>
      <Link to={href} className='text-muted-foreground hover:text-foreground duration-200 font-semibold underline'>{sideText}</Link>
    </div>
  )

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex flex-col min-[1055px]:flex-row min-[1055px]:justify-between min-[1055px]:gap-2'>
        {/* Text Sectioin */}
        <div className='text-center min-[1055px]:text-left my-8 min-[1055px]:mt-[5.5rem] min-[1055px]:mb-0 min-[1055px]:w-2/5'>
          <h1 className='text-4xl font-extrabold mb-4 min-[1055px]:mb-8 min-[1055px]:text-5xl xl:text-6xl text-own'>Modern Interior Design Studio</h1>
          <p className='mb-6 min-[1055px]:mb-8 max-w-md mx-auto min-[1055px]:mx-0'>
            Furniture is an essential component of any living space, providing
            functionality, comfort, and aesthietic appeal.
          </p>
          <div className=''>
            <Button asChild className='mr-2 rounded-full bg-orange-300 hover:bg-orange-400/80 dark:hover:bg-orange-300/80  px-8 py-6 font-bold'>
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button variant='outline' asChild className='rounded-full px-8 py-6 text-own font-bold'>
              <Link to="/blogs">Explore</Link>
            </Button>
          </div>
        </div>
        {/* Image Section */}
        <img src={Couch} alt="couch" className='w-full min-[1055px]:w-3/5' />
      </div>
      {/* Carousel */}
      <CarouselCard products={products} />
      <Title title='Featured Products' href='/products' sideText='View All Products' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {
          products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        }
      </div>
      <Title title='Recent Blog' href='/blogs' sideText='View All Posts' />
      <BlogCard posts={posts.slice(0, 3)} />
    </div>
  )
}
