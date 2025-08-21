import { OTPForm } from "@/components/auth/OTPForm";
import useTitle from "@/hooks/useTitle";

export default function OTPPage() {
    useTitle("Verify OTP")
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <OTPForm />
            </div>
        </div>
    )
}
