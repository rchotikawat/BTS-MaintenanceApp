"use client"

import { useState } from "react"
import { updateMyProfile, changeMyPassword } from "@/app/actions/profileActions"
import { useRouter } from "next/navigation"
import Image from "next/image"

type Profile = {
    id: string
    name: string | null
    email: string | null
    role: string
    image: string | null
    createdAt: Date
    updatedAt: Date
}

export default function ProfileForm({ profile }: { profile: Profile }) {
    const router = useRouter()

    // ── Profile Info ──
    const [name, setName] = useState(profile.name || "")
    const [email, setEmail] = useState(profile.email || "")
    const [isSaving, setIsSaving] = useState(false)
    const [profileMsg, setProfileMsg] = useState("")
    const [profileError, setProfileError] = useState("")

    // ── Password ──
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isChangingPw, setIsChangingPw] = useState(false)
    const [pwMsg, setPwMsg] = useState("")
    const [pwError, setPwError] = useState("")

    // Avatar initials
    const initials = (profile.name || "U")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setProfileMsg("")
        setProfileError("")

        try {
            const result = await updateMyProfile({ name, email })
            if (result.success) {
                setProfileMsg("✅ บันทึกข้อมูลสำเร็จ")
                router.refresh()
                setTimeout(() => setProfileMsg(""), 3000)
            } else {
                setProfileError(result.error || "เกิดข้อผิดพลาด")
            }
        } catch {
            setProfileError("เกิดข้อผิดพลาดในการบันทึก")
        } finally {
            setIsSaving(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setPwMsg("")
        setPwError("")

        if (newPassword !== confirmPassword) {
            setPwError("รหัสผ่านใหม่ไม่ตรงกัน")
            return
        }

        if (newPassword.length < 6) {
            setPwError("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร")
            return
        }

        setIsChangingPw(true)
        try {
            const result = await changeMyPassword({
                currentPassword,
                newPassword,
            })
            if (result.success) {
                setPwMsg("✅ เปลี่ยนรหัสผ่านสำเร็จ")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
                setTimeout(() => setPwMsg(""), 3000)
            } else {
                setPwError(result.error || "เกิดข้อผิดพลาด")
            }
        } catch {
            setPwError("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน")
        } finally {
            setIsChangingPw(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* ── Profile Card ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header Banner */}
                <div className="h-24 bg-linear-to-r from-blue-500 to-indigo-600 relative">
                    <div className="absolute -bottom-10 left-8">
                        {profile.image ? (
                            <Image
                                src={profile.image}
                                alt="Avatar"
                                width={80}
                                height={80}
                                className="w-20 h-20 rounded-2xl ring-4 ring-white shadow-lg object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center ring-4 ring-white shadow-lg">
                                <span className="text-2xl font-bold text-white">{initials}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-14 pb-6 px-8">
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 uppercase">
                            {profile.role}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span>
                            สมัครเมื่อ: {new Date(profile.createdAt).toLocaleDateString("th-TH", {
                                day: "numeric", month: "long", year: "numeric"
                            })}
                        </span>
                        <span>•</span>
                        <span>
                            อัปเดตล่าสุด: {new Date(profile.updatedAt).toLocaleDateString("th-TH", {
                                day: "numeric", month: "long", year: "numeric"
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Edit Profile Info ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">ข้อมูลส่วนตัว</h3>
                        <p className="text-sm text-gray-500">แก้ไขชื่อและอีเมลของคุณ</p>
                    </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                ชื่อ-นามสกุล
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm"
                                placeholder="ระบุชื่อ-นามสกุล"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                อีเมล
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm"
                                placeholder="example@bts.co.th"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            บทบาท (Role)
                        </label>
                        <input
                            type="text"
                            value={profile.role.toUpperCase()}
                            disabled
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">* บทบาทสามารถเปลี่ยนได้โดย Admin เท่านั้น</p>
                    </div>

                    {/* Messages */}
                    {profileMsg && (
                        <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
                            {profileMsg}
                        </div>
                    )}
                    {profileError && (
                        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                            {profileError}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-medium text-sm shadow-lg shadow-blue-600/25 disabled:opacity-50"
                        >
                            {isSaving ? "กำลังบันทึก..." : "💾 บันทึกข้อมูล"}
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Change Password ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">เปลี่ยนรหัสผ่าน</h3>
                        <p className="text-sm text-gray-500">ตั้งรหัสผ่านใหม่สำหรับบัญชีของคุณ</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            รหัสผ่านปัจจุบัน
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                รหัสผ่านใหม่
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm"
                                placeholder="อย่างน้อย 6 ตัวอักษร"
                                required
                                minLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                ยืนยันรหัสผ่านใหม่
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    {/* Messages */}
                    {pwMsg && (
                        <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
                            {pwMsg}
                        </div>
                    )}
                    {pwError && (
                        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                            {pwError}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isChangingPw}
                            className="px-6 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition font-medium text-sm shadow-lg shadow-amber-500/25 disabled:opacity-50"
                        >
                            {isChangingPw ? "กำลังเปลี่ยน..." : "🔒 เปลี่ยนรหัสผ่าน"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
