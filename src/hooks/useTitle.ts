import { useEffect } from "react"

const useTitle = (title: string) => {
    useEffect(() => {
        document.title = `${title} | Furniture`

        return () => {
            document.title = "Furniture"
        }
    }, [title])
}

export default useTitle