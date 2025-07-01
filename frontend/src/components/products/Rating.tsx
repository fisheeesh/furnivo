import { cn } from "@/lib/utils"
import { Icons } from "../Icons"

interface RatingProps {
    rating: number
}

export default function Rating({ rating }: RatingProps) {
    return (
        <div className="flex items-center space-x-1">
            {
                Array.from({ length: 5 }).map((_, index) => (
                    <Icons.star key={index} className={cn('size-4', rating >= index + 1 ? "text-yellow-400" : "text-muted-foreground")} stroke={rating >= index + 1 ? "#eab308" : "currentColor"} fill={rating >= index + 1 ? "#eab308" : "none"} />
                ))
            }
        </div>
    )
}
