/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import { useIsFetching, useMutation } from "@tanstack/react-query";
import { Icons } from "../Icons";
import { Button } from "../ui/button";
import api from "@/api";
import { queryClient } from "@/api/query";

interface FavoriteProps {
    productId: string;
    rating: number;
    isFavorite: boolean,
    className?: string;
}

export default function AddToFavorite({ productId, rating, isFavorite, className, ...props }: FavoriteProps) {
    const fetching = useIsFetching() > 0

    let favorite = isFavorite
    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const data = {
                productId: Number(productId),
                favorite: !isFavorite
            }
            const res = await api.patch("/user/products/toggle-favorite", data)

            if (res.status !== 200) {
                throw new Error("Something went wrong. Please try again.")
            }

            return res.data
        },
        // onSuccess: () => {
        //     queryClient.invalidateQueries({ queryKey: ['products', 'detail', productId] })
        // },
        // onError: (error) => {
        //     toast.error("Error", {
        //         description: error instanceof Error ? error.message : "Something went wrong. Please try again."
        //     })
        // },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['products', 'detail', productId] })
        }
    })

    if (isPending || fetching) {
        favorite = !isFavorite
    }

    return (
        <Button
            onClick={() => mutate()}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
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
    )
}
