import { cn } from "@/lib/utils";
import Logo from "../Logo";
import Spinner from "../Spinner";
import { Button } from "../ui/button";
import { FormField, Form, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { RegisterSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { Link, useActionData, useNavigation, useSubmit } from "react-router";
import useError from "@/hooks/useError";

export default function ForgetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const submit = useSubmit()
    const navigation = useNavigation()
    const actionData = useActionData()

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            phone: ''
        }
    })

    const onSubmit: SubmitHandler<z.infer<typeof RegisterSchema>> = (data) => {
        submit(data, {
            method: "post",
            action: "."
        })
    }

    const isWorking = navigation.state === 'submitting'

    useError(actionData, actionData?.message)

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <Logo />
                    <h1 className="text-xl font-bold">Don't worry we get your back 😉</h1>
                    <div className="text-center text-sm">
                        Remember your password?{" "}
                        <Link to="/login" className="underline underline-offset-4">
                            Login
                        </Link>
                    </div>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Phone Number <span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="Enter your phone number"
                                                    inputMode="numeric"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full cursor-pointer">
                                <Spinner label="Sending..." isLoading={isWorking}>
                                    Send OTP
                                </Spinner>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div >
    )
}
