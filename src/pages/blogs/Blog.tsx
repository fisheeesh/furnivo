import BlogPostList from "@/components/blogs/BlogPostList";
import { posts } from "@/data/posts";

export default function Blog() {
    return (
        <div className="container mx-auto my-8">
            <h1 className="font-bold text-2xl text-center md:text-left">Latest Blog Posts</h1>
            <BlogPostList posts={posts} />
        </div>
    )
}
