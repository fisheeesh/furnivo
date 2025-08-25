import { useMutation } from '@tanstack/react-query'
import Spinner from '../Spinner'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { UpdatePasswordSchema } from '@/lib/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import api from '@/api'
import { toast } from 'sonner'
import { queryClient } from '@/api/query'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function UpdatPasswordForm() {
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
    const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
        resolver: zodResolver(UpdatePasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: ""
        },
    })

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof UpdatePasswordSchema>) => {
            const data = {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            }
            const res = await api.post("/user/change-password", data)

            if (res.status !== 200) {
                throw new Error("Something went wrong. Please try again.")
            }

            return res.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
            toast.success("Success", {
                description: data.message || "Password updated successfully"
            })
            form.reset()
        },
        onError: (error) => {
            toast.error("Error", {
                // @ts-expect-error ignore type check
                description: error.response.data.message
            })
            form.reset()
        }
    })

    function onSubmit(values: z.infer<typeof UpdatePasswordSchema>) {
        mutate(values)
    }

    const isWorking = form.formState.isSubmitting || isPending

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Password</CardTitle>
                <CardDescription>
                    Change your current password to keep your account secure.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem className="flex flex-col md:flex-row md:items-center justify-center gap-4">
                                    <FormLabel className="w-full md:w-1/3 text-sm font-medium">Old Password</FormLabel>
                                    <FormControl>
                                        <div className='w-full md:w-1/3 relative'>
                                            <Input
                                                disabled={isWorking}
                                                type={showPassword[field.name] ? 'text' : 'password'}
                                                className="p-2 rounded-md"
                                                {...field}
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
                                    <div className="w-full md:w-1/3">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem className="flex flex-col md:flex-row md:items-center justify-center gap-4">
                                    <FormLabel className="w-full md:w-1/3 text-sm font-medium">New Password</FormLabel>
                                    <FormControl>
                                        <div className='w-full md:w-1/3 relative'>
                                            <Input
                                                disabled={isWorking}
                                                type={showPassword[field.name] ? 'text' : 'password'}
                                                className="p-2 rounded-md"
                                                {...field}
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
                                    <div className="w-full md:w-1/3">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button onClick={() => form.reset()} type='button' className='cursor-pointer' variant='outline' size='lg'>
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
