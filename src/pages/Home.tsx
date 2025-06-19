import { CarouselCard } from '@/components/products/CarouselCard'
import { Button } from '@/components/ui/button'
import Couch from '@/data/images/couch.png'
import { Link } from 'react-router'


export default function Home() {
  return (
    <div className='container mx-auto px-4'>
      <div className='flex flex-col lg:flex-row lg:justify-between'>
        {/* Text Sectioin */}
        <div className='text-center lg:text-left my-8 lg:mt-[5.5rem] lg:mb-0 lg:w-2/5'>
          <h1 className='text-4xl font-extrabold mb-4 lg:mb-8 lg:text-6xl text-own'>Modern Interior Design Studio</h1>
          <p className='mb-6 lg:mb-8'>
            Furniture is an essential component of any living space, providing
            functionality, comfort, and aesthietic appeal.
          </p>
          <div className=''>
            <Button asChild className='mr-2 rounded-full bg-orange-300 px-8 py-6 font-bold'>
              <Link to="#">Shop Now</Link>
            </Button>
            <Button variant='outline' asChild className='rounded-full px-8 py-6 text-own font-bold'>
              <Link to="#">Explore</Link>
            </Button>
          </div>
        </div>
        {/* Image Section */}
        <img src={Couch} alt="couch" className='w-full lg:w-3/5' />
      </div>
      <CarouselCard />
    </div>
  )
}
