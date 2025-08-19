
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { RegisterSchema } from "@/lib/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useActionData, useSubmit } from "react-router"
import type { z } from "zod"
import Logo from "../Logo"
import Spinner from "../Spinner"
import google from '@/assets/google.png';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const submit = useSubmit()
    const actionData = useActionData()
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            phone: ''
        }
    })

    function onSubmit(values: z.infer<typeof RegisterSchema>) {
        submit(values, {
            method: "post",
            action: "."
        })
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <Logo />
                    <h1 className="text-xl font-bold">Your space just got cozier ✨</h1>
                    <div className="text-center text-sm">
                        Aldready have an account?{" "}
                        <Link to="/login" className="underline underline-offset-4">
                            Login
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number <span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="Enter your phone number"
                                                    required {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                        {
                            actionData && <p className='text-red-600 w-full bg-red-200 text-center p-1.5 text-sm'>
                                {actionData.message}
                            </p>
                        }
                    </div>
                    <Button type="submit" className="w-full">
                        <Spinner label="Registering..." isLoading={form.formState.isSubmitting}>
                            Register
                        </Spinner>
                    </Button>
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                        Or
                    </span>
                </div>
                <Button type="button" variant="outline" className="w-full" asChild>
                    <Link to='/' className="flex items-center gap-4">
                        <img src={google} alt="Google" className="w-4 h-4" />
                        Continue with Google
                    </Link>
                </Button>
            </div>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <Link to="/">Terms of Service</Link>{" "}
                and <Link to="/">Privacy Policy</Link>.
            </div>
        </div >
    )
}
