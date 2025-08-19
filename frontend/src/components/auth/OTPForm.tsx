import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { cn } from "@/lib/utils"
import { OTPSchema } from "@/lib/validator"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useActionData, useSubmit } from "react-router"
import Logo from "../Logo"
import Spinner from "../Spinner"

export function OTPForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const submit = useSubmit()
    const actionData = useActionData()
    const form = useForm<z.infer<typeof OTPSchema>>({
        resolver: zodResolver(OTPSchema),
        defaultValues: {
            otp: "",
        },
    })

    function onSubmit(data: z.infer<typeof OTPSchema>) {
        submit(data, {
            method: "POST",
            action: '/register/otp'
        })
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 mb-3">
                    <Logo />
                    <h1 className="text-muted-foreground text-center">Please enter the OTP sent to your phone.</h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 flex items-center justify-center flex-col mx-auto">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            actionData && <p className='text-red-600 w-full bg-red-200 text-center p-1.5 text-sm'>
                                {actionData.message}
                            </p>
                        }
                        <Button type="submit" className="cursor-pointer w-full">
                            <Spinner label="Verifying..." isLoading={form.formState.isSubmitting}>
                                Verifty
                            </Spinner>
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
