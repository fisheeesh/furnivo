import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Form, useNavigation } from "react-router"
import Spinner from "../Spinner"

export default function LogoutModal() {
    const navigation = useNavigation()
    const isWorking = navigation.state === 'submitting'

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
                <Form method="POST" action="/logout">
                    <Button disabled={isWorking} type="submit" className="cursor-pointer">
                        <Spinner isLoading={isWorking} label={'Loggint out...'}>
                            Confirm
                        </Spinner>
                    </Button>
                </Form>
            </DialogFooter>
        </DialogContent>
    )
}
