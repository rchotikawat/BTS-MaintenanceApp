"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import bcrypt from "bcryptjs"

// ============================================================
// Helper: ดึง Session ของ User ปัจจุบัน
// ============================================================
async function requireAuth() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        throw new Error("Unauthorized: กรุณาเข้าสู่ระบบ")
    }
    return session
}

// ============================================================
// GET: ดึงข้อมูลโปรไฟล์ของตัวเอง
// ============================================================
export async function getMyProfile() {
    const session = await requireAuth()

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    if (!user) {
        throw new Error("ไม่พบข้อมูลผู้ใช้งาน")
    }

    return user
}

// ============================================================
// UPDATE: แก้ไขโปรไฟล์ของตัวเอง
// ============================================================
export async function updateMyProfile(data: {
    name?: string
    email?: string
}) {
    const session = await requireAuth()
    const userId = session.user.id!

    // ค้นหา user ปัจจุบัน
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
        return { success: false, error: "ไม่พบผู้ใช้งาน" }
    }

    // ถ้าเปลี่ยน email → ตรวจว่าไม่ซ้ำ
    if (data.email && data.email !== user.email) {
        const existing = await prisma.user.findUnique({ where: { email: data.email } })
        if (existing) {
            return { success: false, error: "Email นี้มีอยู่ในระบบแล้ว" }
        }
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.email !== undefined && { email: data.email }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
        },
    })

    return { success: true, user: updated }
}

// ============================================================
// UPDATE: เปลี่ยนรหัสผ่าน
// ============================================================
export async function changeMyPassword(data: {
    currentPassword: string
    newPassword: string
}) {
    const session = await requireAuth()
    const userId = session.user.id!

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
        return { success: false, error: "ไม่พบผู้ใช้งาน" }
    }

    // ถ้า user ไม่มี password (OAuth user) → ไม่อนุญาตเปลี่ยน
    if (!user.password) {
        return { success: false, error: "บัญชีนี้ใช้ Social Login ไม่สามารถเปลี่ยนรหัสผ่านได้" }
    }

    // ตรวจรหัสผ่านเก่า
    const isValid = await bcrypt.compare(data.currentPassword, user.password)
    if (!isValid) {
        return { success: false, error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }
    }

    // Validate new password
    if (data.newPassword.length < 6) {
        return { success: false, error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" }
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 12)
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    })

    return { success: true }
}
