import RichTextRender from "@/components/blogs/RichTextRender"
import { Icons } from "@/components/Icons"
import { Button } from "@/components/ui/button"
import { posts } from "@/data/posts"
import useTitle from "@/hooks/useTitle"
import { Link, useParams } from "react-router"

export default function BlogDetail() {
    const { postId } = useParams()
    const post = posts.find(post => post.id === postId)

    if (!post) throw new Error("Post not found")

    useTitle(post.title)

    return (
        <div className="max-w-7xl mx-auto">
            <section className="flex flex-col lg:flex-row">
                <section className="w-full lg:w-3/4 lg:pr-16">
                    <Button variant='outline' asChild className="mb-6 mt-8">
                        <Link to='/blogs'>
                            <Icons.arrowLeft /> All Posts
                        </Link>
                    </Button>

                    {
                        post ? (
                            <>
                                <h2 className="text-3xl font-extrabold mb-3">{post.title}</h2>
                                <div className="text-sm">
                                    by <span className="font-[600]">{post.author} </span>
                                    on <span className="font-[600]">{post.updated_at}</span>
                                </div>
                                <h3 className="font-[400] my-6">{post.content}</h3>
                                <img src={post.image} alt={post.title} className="w-full rounded-xl" />

                                <RichTextRender content={post.body} className="my-8" />

                                <div className="mb-12 space-x-2">
                                    {
                                        post.tags.map(tag => (
                                            <Button variant='secondary'>
                                                {tag}
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
                            posts.map(post => (
                                <Link to={`/blogs/${post.id}`} key={post.id} className="mb-6 flex items-start gap-2">
                                    <img src={post.image} alt={post.title} className="w-1/4 rounded" />
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
