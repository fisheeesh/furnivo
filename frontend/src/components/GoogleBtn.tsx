import { Link } from 'react-router'
import { Button } from './ui/button'
import google from '@/assets/google.png'

export default function GoogleBtn() {
    return (
        <Button type="button" variant="outline" className="w-full" asChild>
            <Link to='/' className="flex items-center gap-4">
                <img src={google} alt="Google" className="w-4 h-4" />
                Continue with Google
            </Link>
        </Button>
    )
}
