import useTitle from "@/hooks/useTitle"
import { useParams } from "react-router"

export default function About() {
    useTitle('About')
    const { "*": splat } = useParams()
    return (
        <div className="max-w-7xl mx-auto">
            About {splat}
        </div>
    )
}
