import AuthForm from '@/components/auth/AuthForm'
import Logo from '@/components/Logo'
import banner from '/house.webp'
import useTitle from '@/hooks/useTitle'
import { LogInSchema } from '@/lib/validator'

export default function Login() {
    useTitle('Login')

    return (
        <section className='relative'>
            <Logo className='fixed top-6 left-8' />
            <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
                <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-[420px]">
                        <AuthForm
                            formType='LOGIN'
                            schema={LogInSchema}
                            defaultValues={{
                                phone: '0991479581',
                                password: '12345678'
                            }}
                        />
                    </div>
                </div>
                <div className="relative hidden lg:block">
                    <img
                        src={banner}
                        alt="Furniture Shop"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            </main>
        </section>
    )
}
