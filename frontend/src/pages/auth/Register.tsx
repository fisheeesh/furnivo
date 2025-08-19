import AuthForm from "@/components/auth/AuthForm";
import Logo from "@/components/Logo";
import useTitle from "@/hooks/useTitle";
import { RegisterSchema } from "@/lib/validator";

export default function Register() {
    useTitle('Register')

    return (
        <section className="relative">
            <Logo className='fixed top-6 left-8' />
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-[420px]">
                    {/* <RegisterForm /> */}
                    <AuthForm
                        formType='REGISTER'
                        schema={RegisterSchema}
                        defaultValues={{
                            phone: '',
                            password: '',
                            confirmPassword: ''
                        }}
                    />
                </div>
            </div>
        </section>
    )
}
