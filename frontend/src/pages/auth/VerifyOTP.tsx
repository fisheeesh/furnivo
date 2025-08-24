import { VerifyOTPForm } from "@/components/auth/VerifyOTPForm"
import useTitle from "@/hooks/useTitle"

export default function VerifyOTP() {
    useTitle("Forget Password")
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-md">
                <VerifyOTPForm />
            </div>
        </div>
    )
}
