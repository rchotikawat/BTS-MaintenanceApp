import { getMyProfile } from "@/app/actions/profileActions"
import ProfileForm from "./ProfileForm"

export default async function ProfilePage() {
    const profile = await getMyProfile()

    return (
        <div className="max-w-3xl mx-auto p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">โปรไฟล์ของฉัน</h1>
                        <p className="text-sm text-gray-500">My Profile — ดูและแก้ไขข้อมูลส่วนตัว</p>
                    </div>
                </div>
            </div>

            <ProfileForm profile={profile} />
        </div>
    )
}
