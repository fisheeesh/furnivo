import { postInfiniteQuery } from "@/api/query";
import BlogPostList from "@/components/blogs/BlogPostList";
import LcoalSearch from "@/components/LocalSearch";
import { Button } from "@/components/ui/button";
import useTitle from "@/hooks/useTitle";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

export default function Blog() {
    useTitle('Blogs')

    const [searchParams] = useSearchParams()

    const query = searchParams.get('query')

    const {
        status,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        // isFetchingPreviousPage,
        fetchNextPage,
        // fetchPreviousPage,
        hasNextPage,
        // hasPreviousPage
    } = useInfiniteQuery(postInfiniteQuery(query))

    const allPosts = data?.pages.flatMap(page => page.posts) ?? []

    return status === 'pending'
        ? (<p>Loading...</p>)
        : status === 'error'
            ? (<p>Error: {error.message}</p>)
            : (
                <div className="max-w-7xl mx-auto my-8">
                    <div className="flex flex-col md:flex-row md:items-center items-start justify-between gap-4">
                        <h1 className="font-bold text-2xl text-center md:text-left">Latest Blog Posts</h1 >
                        <LcoalSearch />
                    </div>
                    <BlogPostList posts={allPosts} />
                    <div className="my-4 flex items-center justify-center">
                        <Button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} variant={!hasNextPage ? 'ghost' : 'secondary'}>
                            {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load More" : "Nothing more to load"}
                        </Button>
                    </div>
                    <div className="">
                        {isFetching && !isFetchingNextPage ? "Background Updating..." : null}
                    </div>
                </div>
            )
}
