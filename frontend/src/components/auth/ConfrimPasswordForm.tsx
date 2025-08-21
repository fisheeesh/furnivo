import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useError from "@/hooks/useError"
import { cn } from "@/lib/utils"
import { ConfirmPasswordSchema } from "@/lib/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
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
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
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

    useError(actionData, actionData?.message)

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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Password <span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={showPassword[field.name] ? 'text' : 'password'}
                                                        placeholder="Create a password"
                                                        {...field}
                                                        inputMode="numeric"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(prev => ({
                                                                ...prev,
                                                                [field.name]: !prev[field.name]
                                                            }))
                                                        }
                                                        className="absolute cursor-pointer right-3 top-2.5 text-muted-foreground"
                                                    >
                                                        {showPassword[field.name] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Confirm Password <span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        id="confirmPassword"
                                                        type={showPassword[field.name] ? 'text' : 'password'}
                                                        placeholder="Repeat your password"
                                                        {...field}
                                                        inputMode="numeric"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(prev => ({
                                                                ...prev,
                                                                [field.name]: !prev[field.name]
                                                            }))
                                                        }
                                                        className="absolute cursor-pointer right-3 top-2.5 text-muted-foreground"
                                                    >
                                                        {showPassword[field.name] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full cursor-pointer">
                                <Spinner label="Submitting..." isLoading={form.formState.isSubmitting}>
                                    Confirm
                                </Spinner>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div >
    )
}
