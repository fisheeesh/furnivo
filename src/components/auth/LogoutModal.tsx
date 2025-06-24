import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Link } from "react-router"

export default function LogoutModal() {
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
                    <Button variant="outline" className="cursor-pointer">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="cursor-pointer" asChild>
                    <Link to='/login'>Confirm</Link>
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
