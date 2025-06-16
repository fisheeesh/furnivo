import { useParams } from "react-router"

export default function Contact() {
    const { "*": splat } = useParams()
    return (
        <div>
            Contact {splat}
        </div>
    )
}
