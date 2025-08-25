import UpdatPasswordForm from "@/components/profile/UpdatPasswordForm";
import UserDataForm from "@/components/profile/UserDataForm";
import useTitle from "@/hooks/useTitle";
import useUserStore from "@/store/userStore";

export default function MyProfile() {
    useTitle('My Profile')

    const { user } = useUserStore()

    const { phone, email, firstName, lastName } = user

    return (
        <section className="">
            <h1 className="text-3xl font-bold mb-6 dark:text-slate-50">Update your Profile</h1>

            <div className="space-y-6">
                {/* Update User Data */}
                <UserDataForm phone={`09${phone}`} email={email} firstName={firstName} lastName={lastName} />

                {/* Update Password */}
                <UpdatPasswordForm />
            </div>
        </section>
    );
}