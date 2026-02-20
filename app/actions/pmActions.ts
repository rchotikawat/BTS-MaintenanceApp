"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// ============================================
// 1. ดึงรายการ PM Reports ทั้งหมด
// ============================================
export async function getPmReports(filter?: {
    status?: string
    templateCode?: string
    search?: string
}) {
    const where: Record<string, unknown> = {}

    if (filter?.status && filter.status !== "ALL") {
        where.status = filter.status
    }

    if (filter?.templateCode && filter.templateCode !== "ALL") {
        where.jobTemplate = { code: filter.templateCode }
    }

    if (filter?.search) {
        where.OR = [
            { workOrderNo: { contains: filter.search, mode: "insensitive" } },
            { stationName: { contains: filter.search, mode: "insensitive" } },
            { leaderName: { contains: filter.search, mode: "insensitive" } },
        ]
    }

    const reports = await prisma.maintenanceReport.findMany({
        where,
        include: {
            jobTemplate: {
                select: {
                    code: true,
                    name: true,
                    equipmentType: true,
                    cycleLabel: true,
                },
            },
        },
        orderBy: { reportDate: "desc" },
    })

    return reports
}

// ============================================
// 2. ดึง PM Report ตาม ID
// ============================================
export async function getPmReportById(id: string) {
    const report = await prisma.maintenanceReport.findUnique({
        where: { id },
        include: {
            jobTemplate: true,
            leader: { select: { id: true, name: true, email: true } },
            apostle: { select: { id: true, name: true, email: true } },
            images: true,
        },
    })

    return report
}

// ============================================
// 3. สถิติ PM Reports
// ============================================
export async function getPmStats() {
    const [total, draft, submitted, approved] = await Promise.all([
        prisma.maintenanceReport.count(),
        prisma.maintenanceReport.count({ where: { status: "DRAFT" } }),
        prisma.maintenanceReport.count({ where: { status: "SUBMITTED" } }),
        prisma.maintenanceReport.count({ where: { status: "APPROVED" } }),
    ])

    return { total, draft, submitted, approved }
}

// ============================================
// 4. ดึง Job Templates ทั้งหมด
// ============================================
export async function getJobTemplates() {
    return prisma.jobTemplate.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    })
}

// ============================================
// 5. สร้าง PM Report ใหม่
// ============================================
export async function createPmReport(data: {
    jobTemplateId: string
    workOrderNo: string
    workOrderNo2?: string
    reportDate: string
    reportTimeStart: string
    reportTimeEnd?: string
    stationName: string
    locationArea: string
    leaderName: string
    apostleName: string
    coordinatePerson: string
    tprNo?: string
    teamNameList?: string
    workDescription?: string
    checklistData: unknown
}) {
    const report = await prisma.maintenanceReport.create({
        data: {
            jobTemplateId: data.jobTemplateId,
            workOrderNo: data.workOrderNo,
            workOrderNo2: data.workOrderNo2 || null,
            reportDate: new Date(data.reportDate),
            reportTimeStart: data.reportTimeStart,
            reportTimeEnd: data.reportTimeEnd || null,
            stationName: data.stationName,
            locationArea: data.locationArea,
            leaderName: data.leaderName,
            apostleName: data.apostleName,
            coordinatePerson: data.coordinatePerson,
            tprNo: data.tprNo || null,
            teamNameList: data.teamNameList || null,
            workDescription: data.workDescription || null,
            checklistData: data.checklistData as object,
            status: "DRAFT",
        },
    })

    revalidatePath("/pm")
    return { success: true, id: report.id }
}

// ============================================
// 6. อัปเดต PM Report
// ============================================
export async function updatePmReport(
    id: string,
    data: {
        workOrderNo?: string
        workOrderNo2?: string
        reportDate?: string
        reportTimeStart?: string
        reportTimeEnd?: string
        stationName?: string
        locationArea?: string
        leaderName?: string
        apostleName?: string
        coordinatePerson?: string
        tprNo?: string
        teamNameList?: string
        workDescription?: string
        checklistData?: unknown
        equipmentCount?: number
        equipmentCodes?: string[]
        stationCodes?: string[]
    }
) {
    const updateData: Record<string, unknown> = {}

    if (data.workOrderNo) updateData.workOrderNo = data.workOrderNo
    if (data.workOrderNo2 !== undefined) updateData.workOrderNo2 = data.workOrderNo2 || null
    if (data.reportDate) updateData.reportDate = new Date(data.reportDate)
    if (data.reportTimeStart) updateData.reportTimeStart = data.reportTimeStart
    if (data.reportTimeEnd !== undefined) updateData.reportTimeEnd = data.reportTimeEnd || null
    if (data.stationName) updateData.stationName = data.stationName
    if (data.locationArea) updateData.locationArea = data.locationArea
    if (data.leaderName) updateData.leaderName = data.leaderName
    if (data.apostleName) updateData.apostleName = data.apostleName
    if (data.coordinatePerson) updateData.coordinatePerson = data.coordinatePerson
    if (data.tprNo !== undefined) updateData.tprNo = data.tprNo || null
    if (data.teamNameList !== undefined) updateData.teamNameList = data.teamNameList || null
    if (data.workDescription !== undefined) updateData.workDescription = data.workDescription || null
    if (data.checklistData) updateData.checklistData = data.checklistData as object
    if (data.equipmentCount !== undefined) updateData.equipmentCount = data.equipmentCount
    if (data.equipmentCodes) updateData.equipmentCodes = data.equipmentCodes
    if (data.stationCodes) updateData.stationCodes = data.stationCodes

    await prisma.maintenanceReport.update({
        where: { id },
        data: updateData,
    })

    revalidatePath("/pm")
    revalidatePath(`/pm/${id}`)
    return { success: true }
}

// ============================================
// 7. Submit PM Report
// ============================================
export async function submitPmReport(id: string) {
    await prisma.maintenanceReport.update({
        where: { id },
        data: {
            status: "SUBMITTED",
            submittedAt: new Date(),
        },
    })

    revalidatePath("/pm")
    revalidatePath(`/pm/${id}`)
    return { success: true }
}