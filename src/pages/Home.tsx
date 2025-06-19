import { Button } from '@/components/ui/button'
import Couch from '@/data/images/couch.png'
import { Link } from 'react-router'


export default function Home() {
  return (
    <div className='container mx-auto'>
      <div className='flex flex-col lg:flex-row lg:justify-between items-center'>
        {/* Text Sectioin */}
        <div className='text-center lg:text-start'>
          <h1>Modern Interior Design Studio</h1>
          <p>
            Furniture is an essential component of any living space, providing
            functionality, comfort, and aesthietic appeal.
          </p>
          <div>
            <Button asChild>
              <Link to="#">Shop Now</Link>
            </Button>
            <Button>
              <Link to="#">Explore</Link>
            </Button>
          </div>
        </div>
        {/* Image Section */}
        <img src={Couch} alt="couch" />
      </div>
    </div>
  )
}
