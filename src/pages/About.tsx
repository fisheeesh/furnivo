import { useParams } from "react-router"

export default function About() {
    const { "*": splat } = useParams()
    return (
        <div>
            Contact {splat}
        </div>
    )
}
