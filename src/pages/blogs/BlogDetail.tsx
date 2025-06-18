import { useParams } from "react-router"

export default function BlogDetail() {
    const { postId } = useParams()
    return (
        <div>
            details {postId}
        </div>
    )
}
