import { postQuery, productQuery, userDataQuery } from '@/api/query'
import BlogCard from '@/components/blogs/BlogCard'
import CarouselCard from '@/components/products/CarouselCard'
import ProductCard from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import Couch from '/couch.png'
import useUserStore from '@/store/userStore'
import type { Product } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Link } from 'react-router'

export default function Home() {
  // const { productsData, postsData } = useLoaderData()

  // const {
  //   data: productsData,
  //   isPending: productsPending,
  //   error: productsError,
  //   refetch: productRefetch
  // } = useQuery(productQuery("?limit=8"))

  // const {
  //   data: postsData,
  //   isPending: postsPending,
  //   error: postsError,
  //   refetch: postRefetch
  // } = useQuery(postQuery("?limit=3"))

  const { setUser } = useUserStore()

  const { data: productsData } = useSuspenseQuery(productQuery("?limit=8"))
  const { data: postsData } = useSuspenseQuery(postQuery("?limit=3"))
  const { data: userData } = useSuspenseQuery(userDataQuery())

  useEffect(() => {
    if (userData) {
      setUser({
        firstName: userData.user.firstName,
        lastName: userData.user.lastName,
        email: userData.user.email,
        phone: userData.user.phone,
        avatar: userData.user.image
      })
    }
  }, [userData, setUser])

  const Title = ({ title, href, sideText }: { title: string; href: string; sideText: string }) => (
    <div className='flex md:items-center flex-col mt-28 mb-10 md:flex-row md:justify-between'>
      <h2 className='text-2xl font-bold mb-4 md:mb-0'>{title}</h2>
      <Link to={href} className='text-muted-foreground hover:text-foreground duration-200 font-semibold underline'>{sideText}</Link>
    </div>
  )

  // if (productsPending || postsPending) {
  //   return (
  //     <p className='text-center'>Loading...</p>
  //   )
  // }

  // if (productsError || postsError) {
  //   return (
  //     <p className='text-center'>{productsError?.message} & {postsError?.message}</p>
  //   )
  // }

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
      <CarouselCard products={productsData.products} />
      <Title title='Featured Products' href='/products' sideText='View All Products' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {
          productsData.products.slice(0, 4).map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))
        }
      </div>
      <Title title='Recent Blog' href='/blogs' sideText='View All Posts' />
      <BlogCard posts={postsData.posts} />
    </div>
  )
}
