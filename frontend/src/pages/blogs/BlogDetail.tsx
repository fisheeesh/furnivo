import { onePostQuery, postQuery } from "@/api/query"
import RichTextRender from "@/components/blogs/RichTextRender"
import { Icons } from "@/components/Icons"
import { Button } from "@/components/ui/button"
import useTitle from "@/hooks/useTitle"
import { IMG_URL } from "@/lib/constants"
import type { Post, Tag } from "@/types"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, useLoaderData } from "react-router"

export default function BlogDetail() {
    // const { postId } = useParams()
    const { postId } = useLoaderData()

    const { data: postDetail } = useSuspenseQuery(onePostQuery(postId))
    const { data: postsData } = useSuspenseQuery(postQuery("?limit=6"))
    useTitle(postDetail.title)

    return (
        <div className="max-w-7xl mx-auto">
            <section className="flex flex-col lg:flex-row">
                <section className="w-full lg:w-3/4 lg:pr-16">
                    <Button variant='outline' asChild className="mb-6 mt-8">
                        <Link to={'/blogs'}>
                            <Icons.arrowLeft /> All Posts
                        </Link>
                    </Button>

                    {
                        postDetail ? (
                            <>
                                <h2 className="text-3xl font-extrabold mb-3">{postDetail.post.title}</h2>
                                <div className="text-sm">
                                    by <span className="font-[600]">{postDetail.post.author.fullName} </span>
                                    on <span className="font-[600]">{postDetail.post.updatedAt}</span>
                                </div>
                                <h3 className="font-[400] my-6">{postDetail.post.content}</h3>
                                <img loading="lazy" decoding="async" src={IMG_URL + postDetail.post.image} alt={postDetail.post.title} className="w-full rounded-xl" />

                                <RichTextRender content={postDetail.post.body} className="my-8" />

                                <div className="mb-12 space-x-2">
                                    {
                                        postDetail.post.tags.map((tag: Tag) => (
                                            <Button variant='secondary'>
                                                {tag.name}
                                            </Button>
                                        ))
                                    }
                                </div>
                            </>
                        ) : (
                            <p className="mb-16 mt-8 text-xl font-bold text-muted-foreground lg:mt-24">Not post found.</p>
                        )
                    }
                </section>
                <section className="w-full lg:w-1/4 lg:mt-24 mb-4 lg:mb-0">
                    <div className="flex items-center mb-8 gap-2 font-semibold">
                        <Icons.layers />
                        <h3 className="">Other Blog Posts</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                        {
                            postsData.posts.map((post: Post) => (
                                <Link to={`/blogs/${post.id}`} key={post.id} className="mb-6 flex items-start gap-2">
                                    <img loading="lazy" decoding="async" src={IMG_URL + post.image} alt={post.title} className="w-1/4 rounded" />
                                    <div className="w-3/4 text-sm font-[500] text-muted-foreground">
                                        <p className="line-clamp-2">{post.content}</p>
                                        <i>See More</i>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </section>
            </section>
        </div>
    )
}
