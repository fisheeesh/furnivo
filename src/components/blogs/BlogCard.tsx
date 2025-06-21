import type { Post } from "@/types"
import { Link } from "react-router"

interface PostProps {
    posts: Post[]
}

export default function BlogCard({ posts }: PostProps) {
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8 mb-20">
            {
                posts.map(post => (
                    <Link key={post.id} to={`/blogs/${post.id}`}>
                        <img src={post.image} alt='Blog Post' className="w-full rounded-2xl mb-4" />
                        <h3 className="line-clamp-1 ml-4 font-semibold">{post.title}</h3>
                        <div className="ml-4 mt-2 text-sm">
                            by <span className="font-semibold">{post.author} </span>
                            on <span className="font-semibold">{post.updated_at}</span>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}
