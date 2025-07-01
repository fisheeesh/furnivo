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
                    <CardTitle className="text-lg">Login to your account</CardTitle>
                    <CardDescription>
                        Enter your phone number below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="phone">Phone Number <span className="text-red-600">*</span></Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    placeholder="09924****"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password <span className="text-red-600">*</span></Label>
                                    <Link
                                        to="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input id="password" type="password" placeholder="******" required />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" asChild>
                                    <Link to='/'>
                                        LogIn
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link to='/' className="flex items-center gap-4">
                                        <img src={google} alt="Google" className="w-4 h-4" />
                                        LogIn with Google
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to='/register' className="underline-offset-4 hover:underline font-bold">
                                Register
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
