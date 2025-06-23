import { Link } from 'react-router'
import { Icons } from './Icons'
import { cn } from '@/lib/utils'

export default function Logo({ className }: { className?: string }) {
    return (
        <Link to='/' className={cn('flex items-center space-x-2 text-lg tracking-tight text-foreground/80 hover:text-foreground transition-colors duration-200', className)}>
            <Icons.logo className="size-7" aria-hidden="true" />
            <span className="font-bold">Furniture Shop</span>
            <span className="sr-only">Home</span>
        </Link>
    )
}
