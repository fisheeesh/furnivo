
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ConfirmPasswordSchema } from "@/lib/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useActionData, useSubmit } from "react-router"
import type { z } from "zod"
import Logo from "../Logo"
import Spinner from "../Spinner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

export function ConfirmPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const submit = useSubmit()
    const actionData = useActionData()
    const form = useForm<z.infer<typeof ConfirmPasswordSchema>>({
        resolver: zodResolver(ConfirmPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    })

    function onSubmit(values: z.infer<typeof ConfirmPasswordSchema>) {
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
                    <h1 className="text-xl font-bold">Please confirm your password</h1>
                    <p className="text-muted-foreground text-center text-sm">
                        Passwords must be 8 digits long and contain only numbers. They <b>MUST</b> match.
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password <span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="Create a password"
                                                    required {...field}
                                                    inputMode="numeric"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password <span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="Repeat your password"
                                                    required {...field}
                                                    inputMode="numeric"
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
                        <Spinner label="Submitting..." isLoading={form.formState.isSubmitting}>
                            Confirm
                        </Spinner>
                    </Button>
                </div>
            </div>
        </div >
    )
}
