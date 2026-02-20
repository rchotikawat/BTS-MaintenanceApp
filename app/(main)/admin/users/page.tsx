import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { redirect } from "next/navigation"
import UserManagement from "./UserManagement"

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    // ตรวจสอบ Role — เฉพาะ Admin เท่านั้น
    const role = (session.user as { role?: string })?.role
    if (role !== "admin") {
        redirect("/dashboard")
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="text-3xl">👥</span>
                        จัดการผู้ใช้งาน
                    </h1>
                    <p className="text-gray-500 mt-1">User Management — เพิ่ม แก้ไข ลบ ผู้ใช้งานในระบบ</p>
                </div>
            </div>

            {/* Client Component for interactive CRUD */}
            <UserManagement />
        </div>
    )
}