import { useEffect } from "react"

const useTitle = (title: string) => {
    useEffect(() => {
        document.title = `${title} | Furniture Shop`

        return () => {
            document.title = "Furniture Shop"
        }
    }, [title])
}

export default useTitle