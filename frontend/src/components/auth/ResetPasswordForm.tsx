import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useError from "@/hooks/useError"
import { cn } from "@/lib/utils"
import { ConfirmPasswordSchema } from "@/lib/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useActionData, useNavigation, useSubmit } from "react-router"
import type { z } from "zod"
import Logo from "../Logo"
import Spinner from "../Spinner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
    const submit = useSubmit()
    const actionData = useActionData()
    const navigation = useNavigation()

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
            action: "/forget-password/reset-password"
        })
    }

    const isWorking = navigation.state === 'submitting'

    useError(actionData, actionData?.message)

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <Logo />
                    <p className="text-muted-foreground text-center text-sm">
                        OK OK. Make sure you won't forget it again. 😜
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
                                            <FormLabel>New Password <span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={showPassword[field.name] ? 'text' : 'password'}
                                                        placeholder="Create a new password"
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
                                            <FormLabel>Repeat New Password <span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        id="confirmPassword"
                                                        type={showPassword[field.name] ? 'text' : 'password'}
                                                        placeholder="Repeat your new password"
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
                                <Spinner label="Submitting..." isLoading={isWorking}>
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
