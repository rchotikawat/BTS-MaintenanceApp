"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

// ============================================================
// Helper: ตรวจสอบว่าเป็น Admin หรือไม่
// ============================================================
async function requireAdmin() {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        throw new Error("Unauthorized: กรุณาเข้าสู่ระบบ")
    }
    const role = (session.user as { role?: string }).role
    if (role !== "admin") {
        throw new Error("Forbidden: เฉพาะ Admin เท่านั้น")
    }
    return session
}

// ============================================================
// GET: ดึงรายชื่อ User ทั้งหมด
// ============================================================
export async function getUsers(search?: string) {
    await requireAdmin()

    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
            ],
        }
        : {}

    const users = await prisma.user.findMany({
        where,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
    })

    return users
}

// ============================================================
// CREATE: เพิ่ม User ใหม่
// ============================================================
export async function createUser(data: {
    name: string
    email: string
    password: string
    role: string
}) {
    await requireAdmin()

    // ตรวจสอบว่า Email ซ้ำไหม
    const existing = await prisma.user.findUnique({
        where: { email: data.email },
    })
    if (existing) {
        return { success: false, error: "Email นี้มีอยู่ในระบบแล้ว" }
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
        },
    })

    revalidatePath("/admin/users")
    return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
}

// ============================================================
// UPDATE: แก้ไข User
// ============================================================
export async function updateUser(
    userId: string,
    data: {
        name?: string
        email?: string
        role?: string
        password?: string
    }
) {
    await requireAdmin()

    // ตรวจสอบว่า User มีอยู่จริง
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.role !== undefined) updateData.role = data.role
    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 12)
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: updateData,
    })

    revalidatePath("/admin/users")
    return { success: true, user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role } }
}

// ============================================================
// DELETE: ลบ User
// ============================================================
export async function deleteUser(userId: string) {
    const session = await requireAdmin()

    // ห้ามลบตัวเอง
    if ((session.user as { id?: string })?.id === userId) {
        return { success: false, error: "ไม่สามารถลบบัญชีของตัวเองได้" }
    }

    // ตรวจสอบว่า User มีอยู่จริง
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
        return { success: false, error: "ไม่พบผู้ใช้งาน" }
    }

    await prisma.user.delete({ where: { id: userId } })

    revalidatePath("/admin/users")
    return { success: true }
}

// ============================================================
// GET: นับจำนวน User แยกตาม Role
// ============================================================
export async function getUserStats() {
    await requireAdmin()

    const [total, admins, users, technicians, supervisors] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "admin" } }),
        prisma.user.count({ where: { role: "user" } }),
        prisma.user.count({ where: { role: "TECHNICIAN" } }),
        prisma.user.count({ where: { role: "SUPERVISOR" } }),
    ])

    return { total, admins, users, technicians, supervisors }
}