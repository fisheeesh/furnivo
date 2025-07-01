import BlogPostList from "@/components/blogs/BlogPostList";
import { posts } from "@/data/posts";
import useTitle from "@/hooks/useTitle";

export default function Blog() {
    useTitle('Blogs')

    return (
        <div className="max-w-7xl mx-auto my-8">
            <h1 className="font-bold text-2xl text-center md:text-left">Latest Blog Posts</h1>
            <BlogPostList posts={posts} />
        </div>
    )
}
