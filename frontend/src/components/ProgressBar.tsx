import { useIsFetching } from "@tanstack/react-query"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { useEffect } from "react"
import { useNavigation } from "react-router"

export default function ProgressBar() {
    const fetching = useIsFetching()
    const navigation = useNavigation()

    //* Routes where we don't want to show progress bar
    const skipProgressRoutes = ['/login', '/register', '/forgot-password']

    //* Check if we're navigating to a route that should skip progress
    const shouldSkipProgress = navigation.location &&
        skipProgressRoutes.includes(navigation.location.pathname)

    useEffect(() => {
        if (shouldSkipProgress) {
            NProgress.done()
            return
        }

        if (fetching > 0 || navigation.state !== "idle") {
            NProgress.start()
        } else {
            NProgress.done()
        }
    }, [fetching, navigation.state, shouldSkipProgress])

    return null
}