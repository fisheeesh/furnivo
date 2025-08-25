import api from "@/api"
import { queryClient } from "@/api/query"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UpadateUserDataSchema } from "@/lib/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import Spinner from "../Spinner"
import useUserStore from "@/store/userStore"

interface Props {
    phone: string,
    email: string,
    firstName: string,
    lastName: string
}

export default function UserDataForm({
    phone, email, firstName, lastName
}: Props) {
    const { setUser } = useUserStore()
    const form = useForm<z.infer<typeof UpadateUserDataSchema>>({
        resolver: zodResolver(UpadateUserDataSchema),
        defaultValues: {
            phone,
            email,
            firstName,
            lastName,
            image: ""
        },
    })

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof UpadateUserDataSchema>) => {
            const formData = new FormData()

            formData.append("email", values.email)
            formData.append("firstName", values.firstName)
            formData.append("lastName", values.lastName)
            if (formData.get("image") !== "") {
                formData.append("avatar", values.image as File)
            }
            const res = await api.patch("/user/update-profile", formData)

            if (res.status !== 200) {
                throw new Error("Something went wrong. Please try again.")
            }

            return res.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
            setUser({
                phone: data.user.phone,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                email: data.user.email,
                avatar: data.user.image
            })
            toast.success("Success", {
                description: "Profile updated successfully"
            })
        },
        onError: () => {
            toast.error("Error", {
                description: "Something went wrong. Please try again."
            })
        }
    })

    const currentImage = form.watch("image")

    function onSubmit(values: z.infer<typeof UpadateUserDataSchema>) {
        mutate(values)
    }

    const isWorking = isPending || form.formState.isSubmitting

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update your account</CardTitle>
                <CardDescription>
                    Make changes to your profile here. Click save when you&apos;re
                    done.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="flex flex-col md:flex-row md:items-center gap-4">
                                    <FormLabel className="w-full md:w-1/3 text-sm font-medium">Phone Number</FormLabel>
                                    <FormControl className="w-full md:w-1/3">
                                        <Input
                                            type="tel"
                                            inputMode="numeric"
                                            disabled
                                            className="w-full p-2 rounded-md"
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className="w-full md:w-1/3">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex flex-col md:flex-row md:items-center gap-4">
                                    <FormLabel className="w-full md:w-1/3 text-sm font-medium">Email</FormLabel>
                                    <FormControl className="w-full md:w-1/3">
                                        <Input
                                            disabled={isWorking}
                                            type="email"
                                            className="w-full p-2 rounded-md"
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className="w-full md:w-1/3">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="flex flex-col md:flex-row md:items-center gap-4">
                                    <FormLabel className="w-full md:w-1/3 text-sm font-medium">First Name</FormLabel>
                                    <FormControl className="w-full md:w-1/3">
                                        <Input
                                            disabled={isWorking}
                                            type="text"
                                            className="w-full p-2 rounded-md"
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className="w-full md:w-1/3">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="flex flex-col md:flex-row md:items-center gap-4">
                                    <FormLabel className="w-full md:w-1/3 text-sm font-medium">Last Name</FormLabel>
                                    <FormControl className="w-full md:w-1/3">
                                        <Input
                                            disabled={isWorking}
                                            type="text"
                                            className="w-full p-2 rounded-md"
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className="w-full md:w-1/3">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem className="flex flex-col md:flex-row md:items-center gap-4">
                                    <FormLabel className="w-full md:w-1/3 text-sm font-medium">Avatar Image</FormLabel>
                                    <FormControl className="w-full md:w-1/3">
                                        <div className="w-full">
                                            <label className="inline-block text-white font-medium px-4 py-2 rounded-md cursor-pointer transition bg-own">
                                                Choose File
                                                <Input
                                                    disabled={isWorking}
                                                    accept="image/*"
                                                    type="file"
                                                    className="hidden"
                                                    {...field}
                                                />
                                            </label>
                                            <span className="ml-3 text-sm">
                                                {currentImage ? currentImage.split('\\')[2] : "No file Chosen"}
                                                {/* No File Chosen */}
                                            </span>
                                        </div>
                                    </FormControl>
                                    <div className="w-full md:w-1/3">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                disabled={isWorking}
                                onClick={() => form.reset()}
                                type='button'
                                className='cursor-pointer'
                                variant='outline'
                                size='lg'
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="cursor-pointer bg-own text-white hover:bg-own-hover" size='lg'>
                                <Spinner isLoading={isWorking} label="Updating...">
                                    Update
                                </Spinner>
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}