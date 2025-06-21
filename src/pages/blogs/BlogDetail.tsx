import { Icons } from "@/components/Icons"
import { Button } from "@/components/ui/button"
import { posts } from "@/data/posts"
import { Link, useParams } from "react-router"

export default function BlogDetail() {
    const { postId } = useParams()
    const post = posts.find(post => post.id === postId)

    return (
        <div className="container mx-auto">
            <section className="flex flex-col lg:flex-row">
                <section>
                    <Button variant='outline' asChild>
                        <Link to='/blogs'>
                            <Icons.arrowLeft /> All Posts
                        </Link>
                    </Button>

                    {
                        post ? (
                            <>
                                <h2 className=""></h2>
                                <div className="">
                                    <span></span>
                                </div>
                                <h3 className=""></h3>
                                <img src="" alt="" className="" />
                            </>
                        ) : (
                            <p className="mb-16 mt-8 text-xl font-bold text-muted-foreground lg:mt-24">Not post found.</p>
                        )
                    }
                </section>
                <section>
                    Other
                </section>
            </section>
        </div>
    )
}
