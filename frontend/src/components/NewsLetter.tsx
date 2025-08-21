
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type ControllerRenderProps, type SubmitHandler } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader } from "lucide-react"
import { Icons } from "./Icons"
import { NewsLetterSchema } from "@/lib/validator"
import { toast } from "sonner"

export default function NewsLetterForm() {
    const form = useForm<z.infer<typeof NewsLetterSchema>>({
        defaultValues: {
            email: ''
        },
        resolver: zodResolver(NewsLetterSchema)
    })

    const onSubmit: SubmitHandler<z.infer<typeof NewsLetterSchema>> = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        form.reset()
        toast.success("Success", {
            description: "Subscribed to newsletter"
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full pr-8 lg:pr-0" autoComplete="off">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof NewsLetterSchema>, "email"> }) => (
                        <FormItem className="relative space-y-0">
                            <FormLabel className="sr-only">Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    className="pr-12"
                                    disabled={form.formState.isSubmitting}
                                    placeholder="furniture@gmail.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            <Button
                                className="absolute top-[4px] right-[3.5px] size-7 z-20 cursor-pointer"
                                size='icon'
                                disabled={form.formState.isSubmitting}>
                                {
                                    form.formState.isSubmitting ?
                                        <Loader className="size-3 animate-spin" aria-hidden="true" /> :
                                        <Icons.paperPlane className="size-3" aria-hidden="true" />
                                }
                                <span className="sr-only">Join newsletter</span>
                            </Button>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}