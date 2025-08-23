/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Icons } from "../Icons";
import { useFetcher } from "react-router";

interface FavoriteProps {
    productId: string;
    rating: number;
    isFavorite: boolean,
    className?: string;
}

export default function AddToFavorite({ productId, rating, isFavorite, className, ...props }: FavoriteProps) {
    const fetcher = useFetcher({ key: `product:${productId}` })

    let favorite = isFavorite
    if (fetcher.formData) {
        favorite = fetcher.formData.get("favorite") === 'true'
    }

    return (
        <fetcher.Form method="POST">
            <Button
                name="favorite"
                value={favorite ? 'false' : 'true'}
                title={favorite ? "Remove from favorites" : "Add to favorites"}
                variant='secondary'
                size='icon'
                className={cn('size-8 shrink-0 cursor-pointer', className)}
                {...props}
            >
                {favorite
                    ? (<Icons.heartFill className="size-4 text-red-600" />)
                    : (<Icons.heart className="size-4" />)
                }
            </Button>
        </fetcher.Form>
    )
}
