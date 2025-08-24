import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import Spinner from "../Spinner"
import { authApi } from "@/api"
import { queryClient } from "@/api/query"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export default function LogoutModal() {
    // const navigation = useNavigation()
    // const isWorking = navigation.state === 'submitting'

    const navigate = useNavigate()

    const { mutate, isPending: isWorking } = useMutation({
        mutationFn: async () => {
            const res = await authApi.post("/logout")

            if (res.status !== 200) {
                throw new Error("Something went wrong. Please try again.")
            }

            return res.data
        },
        onSuccess: () => {
            //? After success logout, we need to remove the current user data from react query cache even though that is removed from the local storage by server.
            //? In here, we remove all of the queries from the cache.
            queryClient.removeQueries()
            navigate('/', { replace: true })
        },
        onError: (error) => {
            toast.error("Error", {
                description: error instanceof Error ? error.message : "Something went wrong. Please try again."
            })
        }
    })

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Logout Confirmation.</DialogTitle>
                <DialogDescription>
                    Are you sure you want to log out?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button disabled={isWorking} variant="outline" className="cursor-pointer">Cancel</Button>
                </DialogClose>
                {/* <Form method="POST" action="/logout">
                    <Button disabled={isWorking} type="submit" className="cursor-pointer">
                        <Spinner isLoading={isWorking} label={'Loggint out...'}>
                            Confirm
                        </Spinner>
                    </Button>
                </Form> */}
                <Button onClick={() => mutate()} disabled={isWorking} type="submit" className="cursor-pointer">
                    <Spinner isLoading={isWorking} label={'Loggint out...'}>
                        Confirm
                    </Spinner>
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
