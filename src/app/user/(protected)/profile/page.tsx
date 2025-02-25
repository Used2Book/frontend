import ProfileCard from "@/app/user/components/profile";
export default function ProfilePage() {
    return (
        <div className="flex flex-1 overflow-hidden">
            <div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <ProfileCard />
            </div>
        </div>
    );
}