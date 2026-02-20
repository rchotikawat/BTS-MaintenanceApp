"use client"

import { useState, useEffect, useCallback } from "react"
import { getUsers, createUser, updateUser, deleteUser, getUserStats } from "@/app/actions/userActions"

// ============================================================
// Types
// ============================================================
type User = {
    id: string
    name: string | null
    email: string | null
    role: string
    image: string | null
    createdAt: Date
    updatedAt: Date
}

type UserStats = {
    total: number
    admins: number
    users: number
    technicians: number
    supervisors: number
}

type FormData = {
    name: string
    email: string
    password: string
    role: string
}

const ROLES = [
    { value: "admin", label: "Admin", color: "bg-red-100 text-red-700" },
    { value: "user", label: "User", color: "bg-blue-100 text-blue-700" },
    { value: "TECHNICIAN", label: "Technician", color: "bg-green-100 text-green-700" },
    { value: "SUPERVISOR", label: "Supervisor", color: "bg-purple-100 text-purple-700" },
]

// ============================================================
// Main Component
// ============================================================
export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [stats, setStats] = useState<UserStats | null>(null)
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [deletingUser, setDeletingUser] = useState<User | null>(null)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [form, setForm] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        role: "user",
    })

    // ── Fetch Users ──────────────────────────────────────────
    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const [data, statsData] = await Promise.all([
                getUsers(search || undefined),
                getUserStats(),
            ])
            setUsers(data)
            setStats(statsData)
        } catch {
            setError("ไม่สามารถโหลดข้อมูลได้")
        } finally {
            setLoading(false)
        }
    }, [search])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    // ── Auto-hide messages ──────────────────────────────────
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 3000)
            return () => clearTimeout(timer)
        }
    }, [success])

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 5000)
            return () => clearTimeout(timer)
        }
    }, [error])

    // ── Open Modal (Create / Edit) ──────────────────────────
    const openCreateModal = () => {
        setEditingUser(null)
        setForm({ name: "", email: "", password: "", role: "user" })
        setError("")
        setShowModal(true)
    }

    const openEditModal = (user: User) => {
        setEditingUser(user)
        setForm({
            name: user.name || "",
            email: user.email || "",
            password: "",
            role: user.role,
        })
        setError("")
        setShowModal(true)
    }

    const openDeleteModal = (user: User) => {
        setDeletingUser(user)
        setShowDeleteModal(true)
    }

    // ── Save (Create or Update) ─────────────────────────────
    const handleSave = async () => {
        setError("")
        setSaving(true)

        try {
            if (editingUser) {
                // Update
                const result = await updateUser(editingUser.id, {
                    name: form.name,
                    email: form.email,
                    role: form.role,
                    ...(form.password ? { password: form.password } : {}),
                })
                if (!result.success) {
                    setError(result.error || "เกิดข้อผิดพลาด")
                    return
                }
                setSuccess(`แก้ไขผู้ใช้ ${form.name} สำเร็จ`)
            } else {
                // Create
                if (!form.password) {
                    setError("กรุณากรอกรหัสผ่าน")
                    return
                }
                const result = await createUser(form)
                if (!result.success) {
                    setError(result.error || "เกิดข้อผิดพลาด")
                    return
                }
                setSuccess(`เพิ่มผู้ใช้ ${form.name} สำเร็จ`)
            }

            setShowModal(false)
            fetchUsers()
        } catch {
            setError("เกิดข้อผิดพลาดในระบบ")
        } finally {
            setSaving(false)
        }
    }

    // ── Delete ───────────────────────────────────────────────
    const handleDelete = async () => {
        if (!deletingUser) return
        setSaving(true)

        try {
            const result = await deleteUser(deletingUser.id)
            if (!result.success) {
                setError(result.error || "เกิดข้อผิดพลาด")
                setShowDeleteModal(false)
                return
            }
            setSuccess(`ลบผู้ใช้ ${deletingUser.name} สำเร็จ`)
            setShowDeleteModal(false)
            fetchUsers()
        } catch {
            setError("เกิดข้อผิดพลาดในระบบ")
        } finally {
            setSaving(false)
        }
    }

    // ── Role Badge ──────────────────────────────────────────
    const RoleBadge = ({ role }: { role: string }) => {
        const roleConfig = ROLES.find((r) => r.value === role)
        return (
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${roleConfig?.color || "bg-gray-100 text-gray-600"}`}>
                {roleConfig?.label || role}
            </span>
        )
    }

    return (
        <div className="space-y-6">
            {/* ── Toast Messages ─────────────────────────────── */}
            {success && (
                <div className="fixed top-20 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                    <span className="text-lg">✅</span>
                    <span className="font-medium">{success}</span>
                </div>
            )}

            {error && !showModal && (
                <div className="fixed top-20 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                    <span className="text-lg">❌</span>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* ── Stats Cards ────────────────────────────────── */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <StatCard icon="👥" label="ทั้งหมด" value={stats.total} color="from-blue-500 to-blue-600" />
                    <StatCard icon="🛡️" label="Admin" value={stats.admins} color="from-red-500 to-red-600" />
                    <StatCard icon="👤" label="User" value={stats.users} color="from-sky-500 to-sky-600" />
                    <StatCard icon="🔧" label="Technician" value={stats.technicians} color="from-green-500 to-green-600" />
                    <StatCard icon="📋" label="Supervisor" value={stats.supervisors} color="from-purple-500 to-purple-600" />
                </div>
            )}

            {/* ── Search + Add Button ────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ, อีเมล..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-600/25 transition whitespace-nowrap"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        เพิ่มผู้ใช้ใหม่
                    </button>
                </div>
            </div>

            {/* ── Users Table ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                        <span className="ml-3 text-gray-500">กำลังโหลด...</span>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <span className="text-4xl block mb-3">🔍</span>
                        <p className="font-medium">ไม่พบผู้ใช้งาน</p>
                        <p className="text-sm mt-1">ลองเปลี่ยนคำค้นหา หรือเพิ่มผู้ใช้ใหม่</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100">
                                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">ผู้ใช้งาน</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">อีเมล</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">บทบาท</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">วันที่สร้าง</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-blue-50/30 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-white">
                                                        {(user.name || "U").slice(0, 2).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-900 text-sm">{user.name || "—"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.email || "—"}</td>
                                        <td className="px-6 py-4">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString("th-TH", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="แก้ไข"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(user)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="ลบ"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Create / Edit Modal ────────────────────────── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                            {editingUser ? "✏️ แก้ไขผู้ใช้" : "➕ เพิ่มผู้ใช้ใหม่"}
                        </h2>

                        {error && showModal && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อ-นามสกุล</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="เช่น Somchai S."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">อีเมล</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="user@bts.co.th"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    รหัสผ่าน {editingUser && <span className="text-gray-400 font-normal">(เว้นว่างถ้าไม่เปลี่ยน)</span>}
                                </label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder={editingUser ? "••••••••" : "กรอกรหัสผ่าน"}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">บทบาท</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ROLES.map((role) => (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() => setForm({ ...form, role: role.value })}
                                            className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition ${form.role === role.value
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                                }`}
                                        >
                                            {role.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.name || !form.email}
                                className="px-6 py-2.5 text-sm font-medium bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? "กำลังบันทึก..." : editingUser ? "บันทึกการแก้ไข" : "เพิ่มผู้ใช้"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirmation Modal ───────────────────── */}
            {showDeleteModal && deletingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">ยืนยันการลบ</h3>
                            <p className="text-sm text-gray-600 mb-1">
                                คุณต้องการลบผู้ใช้
                            </p>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                                {deletingUser.name}
                            </p>
                            <p className="text-xs text-gray-500 mb-6">
                                ({deletingUser.email})
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={saving}
                                className="flex-1 px-4 py-2.5 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-xl transition disabled:opacity-50"
                            >
                                {saving ? "กำลังลบ..." : "ลบผู้ใช้"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ============================================================
// Stat Card Component
// ============================================================
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${color} flex items-center justify-center shadow-sm`}>
                <span className="text-lg">{icon}</span>
            </div>
            <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    )
}