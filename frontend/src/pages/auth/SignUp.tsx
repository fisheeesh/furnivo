import { SignUpForm } from "@/components/auth/SignUpForm";
import useTitle from "@/hooks/useTitle";

export default function SignUpPage() {
    useTitle("Sign Up")
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SignUpForm />
            </div>
        </div>
    )
}
