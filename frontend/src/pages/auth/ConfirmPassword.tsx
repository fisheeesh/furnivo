import { ConfirmPasswordForm } from "@/components/auth/ConfrimPasswordForm";
import useTitle from "@/hooks/useTitle";

export default function ConfirmPasswordPage() {
    useTitle("Confirm Password")
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <ConfirmPasswordForm />
            </div>
        </div>
    )
}
