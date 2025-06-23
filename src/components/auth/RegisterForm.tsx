import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router"

import google from '@/assets/google.png'

export default function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Register</CardTitle>
                    <CardDescription>
                        Enter your phone number below to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="phone">Phone Number <span className="text-red-600">*</span></Label>
                                <Input
                                    id="phone"
                                    type="email"
                                    placeholder="09924****"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">Password <span className="text-red-600">*</span></Label>
                                <Input id="password" type="password" placeholder="******" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="confirm-password">Confirm Password <span className="text-red-600">*</span></Label>
                                <Input id="confirm-password" type="password" placeholder="******" required />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" asChild>
                                    <Link to='/register'>
                                        Register
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link to='/' className="flex items-center gap-4">
                                        <img src={google} alt="Google" className="w-4 h-4" />
                                        Register with Google
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Alreay have an account?{" "}
                            <Link to="/login" className="underline-offset-4 hover:underline font-bold">
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
