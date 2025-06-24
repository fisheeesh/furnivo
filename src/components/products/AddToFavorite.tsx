/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Icons } from "../Icons";

interface FavoriteProps {
    productId: string;
    rating: number;
    className?: string;
}

export default function AddToFavorite({ productId, rating, className, ...props }: FavoriteProps) {
    return (
        <Button variant='secondary' size='icon' className={cn('size-8 shrink-0 cursor-pointer', className)} {...props}>
            <Icons.heart className="size-4" />
        </Button>
    )
}
