import RegisterForm from "@/components/auth/RegisterForm";
import Logo from "@/components/Logo";

export default function Register() {
    return (
        <section className="relative">
            <Logo className='fixed top-6 left-8' />
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-[420px]">
                    <RegisterForm />
                </div>
            </div>
        </section>
    )
}
