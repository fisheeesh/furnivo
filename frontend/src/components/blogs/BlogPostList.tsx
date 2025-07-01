import type { Post } from "@/types"
import { Link } from "react-router"

interface PostProps {
    posts: Post[]
}

export default function BlogPostList({ posts }: PostProps) {
    return (
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3 mt-8 mb-12">
            {
                posts.map(post => (
                    <Link key={post.id} to={`/blogs/${post.id}`}>
                        <img src={post.image} alt='Blog Post' className="w-full rounded-xl mb-4" />
                        <h2 className="line-clamp-1 text-xl font-extrabold">{post.title}</h2>
                        <h3 className="line-clamp-3 my-2 text-base font-[400]">{post.content}</h3>
                        <div className="text-sm">
                            by <span className="font-[600]">{post.author} </span>
                            on <span className="font-[600]">{post.updated_at}</span>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}
