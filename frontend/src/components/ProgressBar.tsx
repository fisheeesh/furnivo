import { useEffect } from "react"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { useIsFetching } from "@tanstack/react-query"
import { useNavigation } from "react-router"

export default function ProgressBar() {
    const fetching = useIsFetching()
    const navigation = useNavigation()

    useEffect(() => {
        if (fetching > 0 || navigation.state !== "idle") {
            console.log(navigation.state)
            NProgress.start()
        } else {
            console.log(navigation.state)
            NProgress.done()
        }
    }, [fetching, navigation.state])

    return null
}