import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../lib/generated/prisma/client"
import bcrypt from "bcryptjs"

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// ============================================================
// SEED: Users (Auth + PM Team)
// ============================================================
async function seedUsers() {
    console.log("👥 Seeding Users...")

    // ── Existing Auth Users ──────────────────────────────────
    await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            name: "Admin User",
            email: "admin@example.com",
            password: await bcrypt.hash("password123", 10),
            role: "admin",
        },
    })

    await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: {},
        create: {
            name: "Normal User",
            email: "user@example.com",
            password: await bcrypt.hash("password123", 10),
            role: "user",
        },
    })

    // ── PM Team Users (จากต้นแบบ) ────────────────────────────
    const pmUsers = [
        { email: "taweesak@bts.co.th", name: "Taweesak T.", role: "user" },
        { email: "phobsuk@bts.co.th", name: "Phobsuk P.", role: "user" },
        { email: "saknarin@bts.co.th", name: "Saknarin S.", role: "user" },
        { email: "phanuwat@bts.co.th", name: "Phanuwat T.", role: "user" },
        { email: "woraphop@bts.co.th", name: "Woraphop K.", role: "user" },
        { email: "wudtipong@bts.co.th", name: "Wudtipong S.", role: "user" },
    ]

    for (const user of pmUsers) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                ...user,
                password: await bcrypt.hash("password123", 10),
            },
        })
    }

    console.log("✅ Users seeded")
}

// ============================================================
// SEED: Job Templates (Master data สำหรับ 3 อุปกรณ์)
// พร้อม checklistSchema (JSON Schema) + checklistTemplate
// ============================================================
async function seedJobTemplates() {
    console.log("📋 Seeding Job Templates...")

    // ── 1. Point Machine Y1 ───────────────────────────────────
    await prisma.jobTemplate.upsert({
        where: { code: "PM_Y1_POINT_MACHINE" },
        update: {
            name: "PM (Y1) Point Machine JEA",
            checklistSchema: pointMachineSchema(),
            checklistTemplate: { devices: [] },
        },
        create: {
            code: "PM_Y1_POINT_MACHINE",
            name: "PM (Y1) Point Machine JEA",
            equipmentType: "POINT_MACHINE",
            pmCycle: "YEARLY",
            cycleLabel: "Y1",
            intervalDays: 365,
            formNumber: "FM-MTD-M51000-Z-XXX",
            formRevision: "Rev.00",
            checklistSchema: pointMachineSchema(),
            checklistTemplate: { devices: [] },
            isActive: true,
        },
    })

    // ── 2. MOXA TAP M3 ────────────────────────────────────────
    await prisma.jobTemplate.upsert({
        where: { code: "PM_M3_MOXA_TAP" },
        update: {
            name: "PM (M3) MOXA TAP (Project Resig)",
            checklistSchema: moxaTapSchema(),
            checklistTemplate: { devices: [] },
        },
        create: {
            code: "PM_M3_MOXA_TAP",
            name: "PM (M3) MOXA TAP (Project Resig)",
            equipmentType: "MOXA_TAP",
            pmCycle: "MONTHLY",
            cycleLabel: "M3",
            intervalDays: 90,
            formNumber: "FM-MTD-M51000-Z-021",
            formRevision: "Rev.00",
            checklistSchema: moxaTapSchema(),
            checklistTemplate: { devices: [] },
            isActive: true,
        },
    })

    // ── 3. EMP M2 ─────────────────────────────────────────────
    await prisma.jobTemplate.upsert({
        where: { code: "PM_M2_EMP" },
        update: {
            name: "PM (M2) Emergency Stop Plunger (EMP)",
            checklistSchema: empSchema(),
            checklistTemplate: empTemplate(),
        },
        create: {
            code: "PM_M2_EMP",
            name: "PM (M2) Emergency Stop Plunger (EMP)",
            equipmentType: "EMP",
            pmCycle: "MONTHLY",
            cycleLabel: "M2",
            intervalDays: 60,
            formNumber: "FM-MTD-M51000-Z-xxx",
            formRevision: "Rev.00",
            checklistSchema: empSchema(),
            checklistTemplate: empTemplate(),
            isActive: true,
        },
    })

    console.log("✅ Job Templates seeded")
}

// ============================================================
// SEED: Sample Reports (ตัวอย่างใบงานจริงจาก PDF)
// ============================================================
async function seedSampleReports() {
    console.log("📝 Seeding Sample Reports...")

    const moxaTemplate = await prisma.jobTemplate.findUnique({ where: { code: "PM_M3_MOXA_TAP" } })
    const empTemplate = await prisma.jobTemplate.findUnique({ where: { code: "PM_M2_EMP" } })
    const leader1 = await prisma.user.findUnique({ where: { email: "taweesak@bts.co.th" } })
    const leader2 = await prisma.user.findUnique({ where: { email: "phobsuk@bts.co.th" } })

    if (!moxaTemplate || !empTemplate || !leader1 || !leader2) {
        console.warn("⚠️  Skip sample reports — templates or users not found")
        return
    }

    // ── Sample: MOXA TAP M3 (จาก PDF MC-2026-02-19) ──────────
    await prisma.maintenanceReport.upsert({
        where: { id: "sample-moxa-20260219" },
        update: {},
        create: {
            id: "sample-moxa-20260219",
            jobTemplateId: moxaTemplate.id,
            leaderId: leader1.id,
            workOrderNo: "601478658",
            reportDate: new Date("2026-02-19"),
            reportTimeStart: "01:30",
            reportTimeEnd: "03:30",
            stationName: "E3-E5",
            locationArea: "E3-E5",
            leaderName: "Taweesak T.",
            apostleName: "Saknarin S.",
            coordinatePerson: "SKT1-LC",
            tprNo: "P/081",
            teamNameList: "Phanuwat T., Wudtipong S.",
            workDescription: "PM (M3) MOXA TAP",
            equipmentCount: 12,
            equipmentCodes: ["E3TAP1", "E3TAP9", "E4TAP6", "E4TAP2", "E4TAP1", "E4TAP5", "E4TAP11", "E4TAP17", "E5TAP18", "E5TA12", "E5TAP6", "E5TAP2"],
            stationCodes: ["E3", "E4", "E5"],
            stationAccessStatus: "ENTRY",
            ccrAccessStatus: "ENTRY",
            hasEarthingDevice: true,
            earthingDeviceStatus: "RETURNED",
            hasVoltageTester: true,
            voltageTesterStatus: "RETURNED",
            status: "SUBMITTED",
            submittedAt: new Date("2026-02-19T04:00:00Z"),
            totalCheckItems: 228,  // 19 items × 12 taps
            passCount: 228,
            failCount: 0,
            hasIssues: false,

            // Layer 2: JSONB Checklist (ตัวอย่าง 12 ตัว)
            checklistData: {
                devices: [
                    moxaDevice("E3TAP1", "E3", 1, "GREEN_ON", "GREEN_BLINK"),
                    moxaDevice("E3TAP9", "E3", 2, "GREEN_ON", "GREEN_ON"),
                    moxaDevice("E4TAP6", "E4", 3, "GREEN_ON", "GREEN_BLINK"),
                    moxaDevice("E4TAP2", "E4", 4, "GREEN_ON", "GREEN_ON"),
                    moxaDevice("E4TAP1", "E4", 5, "GREEN_ON", "GREEN_ON"),
                    moxaDevice("E4TAP5", "E4", 6, "GREEN_ON", "GREEN_BLINK"),
                    moxaDevice("E4TAP11", "E4", 7, "GREEN_ON", "GREEN_ON"),
                    moxaDevice("E4TAP17", "E4", 8, "GREEN_ON", "GREEN_ON"),
                    moxaDevice("E5TAP18", "E5", 9, "GREEN_ON", "GREEN_BLINK"),
                    moxaDevice("E5TA12", "E5", 10, "GREEN_ON", "GREEN_ON"),
                    moxaDevice("E5TAP6", "E5", 11, "GREEN_ON", "GREEN_ON"),
                    moxaDevice("E5TAP2", "E5", 12, "GREEN_ON", "GREEN_BLINK"),
                ],
            },
        },
    })

    // ── Sample: EMP M2 (จาก PDF BP-2026-02-16) ────────────────
    await prisma.maintenanceReport.upsert({
        where: { id: "sample-emp-20260216" },
        update: {},
        create: {
            id: "sample-emp-20260216",
            jobTemplateId: empTemplate.id,
            leaderId: leader2.id,
            workOrderNo: "601478697",
            workOrderNo2: "601478698",
            reportDate: new Date("2026-02-16"),
            reportTimeStart: "11:00",
            reportTimeEnd: "13:00",
            stationName: "E22 E23",
            locationArea: "E22 E23",
            leaderName: "Phobsuk P.",
            apostleName: "Phobsuk P.",
            coordinatePerson: "SS. E22 E23",
            workDescription: "PM (M2) EMP",
            equipmentCount: 8,
            equipmentCodes: ["EMP-E22-1", "EMP-E22-2", "EMP-E22-3", "EMP-E22-4", "EMP-E22-5", "EMP-E22-6", "EMP-E22-7", "EMP-E22-8"],
            stationCodes: ["E22", "E23"],
            stationAccessStatus: "ENTRY",
            hasEarthingDevice: false,
            hasVoltageTester: false,
            status: "SUBMITTED",
            submittedAt: new Date("2026-02-16T13:30:00Z"),
            totalCheckItems: 45,  // 5 (controlBox) + 0 (no surge) + 8×5 (platform)
            passCount: 44,
            failCount: 1,
            hasIssues: true,

            // Layer 2: JSONB — EMP#2 ข้อ 1 = FAIL
            checklistData: {
                controlBox: {
                    checklist: Array.from({ length: 5 }, (_, i) => ({
                        itemNo: i + 1,
                        result: "PASS",
                    })),
                },
                surgeProtectionBox: {
                    isPresent: false,
                },
                platform: {
                    devices: Array.from({ length: 8 }, (_, i) => ({
                        empNumber: i + 1,
                        checklist: Array.from({ length: 5 }, (_, j) => ({
                            itemNo: j + 1,
                            // EMP 2 ข้อ 1 FAIL
                            result: i === 1 && j === 0 ? "FAIL" : "PASS",
                            remark: i === 1 && j === 0 ? "ปุ่มกดฝืด ต้องแจ้งซ่อม" : "",
                        })),
                    })),
                },
            },
        },
    })

    console.log("✅ Sample Reports seeded")
}

// ============================================================
// SEED: CM Maintenance Job Orders (งานซ่อม)
// ============================================================
async function seedMaintenanceJobs() {
    console.log("🔧 Seeding CM Maintenance Jobs...")

    const maintenanceJobs = [
        {
            jobNo: "JOB-202602-001",
            location: "สถานีสยาม (CEN)",
            subject: "แอร์ไม่เย็น ตู้ 2",
            description: "เครื่องปรับอากาศตู้ที่ 2 ของสถานีสยาม ไม่ทำงาน ผู้โดยสารร้องเรียนว่าอากาศร้อนมาก ต้องการให้ตรวจสอบและซ่อมแซมโดยด่วน",
            reportedBy: "EMP-001",
            status: "PENDING" as const,
            priority: "HIGH" as const,
        },
        {
            jobNo: "JOB-202602-002",
            location: "สถานีหมอชิต (N8)",
            subject: "ไฟสถานีดับบางจุด",
            description: "ไฟส่องสว่างบริเวณชานชาลาฝั่งทิศเหนือไม่ทำงาน จำนวน 3 ดวง ส่งผลกระทบต่อความปลอดภัยในช่วงกลางคืน",
            reportedBy: "EMP-003",
            status: "IN_PROGRESS" as const,
            priority: "MEDIUM" as const,
        },
        {
            jobNo: "JOB-202602-003",
            location: "Train No. 104",
            subject: "ประตูรถไม่ปิดสนิท",
            description: "ประตูตู้โดยสารหมายเลข 3 ของขบวนรถ 104 ปิดไม่สนิท มีเสียงดังผิดปกติระหว่างเปิด-ปิด",
            reportedBy: "EMP-005",
            status: "COMPLETED" as const,
            priority: "CRITICAL" as const,
            completedAt: new Date("2026-02-18T14:30:00"),
        },
        {
            jobNo: "JOB-202602-004",
            location: "สถานีอโศก (E4)",
            subject: "ลิฟต์ชั้น 2 หยุดทำงาน",
            description: "ลิฟต์โดยสารชั้น 2 ไม่สามารถใช้งานได้ แสดงข้อความ Error บนจอแสดงผล ต้องการช่างผู้เชี่ยวชาญมาตรวจสอบ",
            reportedBy: "EMP-002",
            status: "PENDING" as const,
            priority: "HIGH" as const,
        },
        {
            jobNo: "JOB-202602-005",
            location: "สถานีพร้อมพงษ์ (E5)",
            subject: "ป้ายข้อมูลชำรุด",
            description: "ป้ายแสดงข้อมูลขบวนรถ LED บริเวณชานชาลาแสดงผลไม่ถูกต้อง บางครั้งเป็นสัญญาณรบกวน",
            reportedBy: "EMP-004",
            status: "IN_PROGRESS" as const,
            priority: "LOW" as const,
        },
    ]

    for (const job of maintenanceJobs) {
        await prisma.maintenanceLog.upsert({
            where: { jobNo: job.jobNo },
            update: {},
            create: job,
        })
    }

    console.log("✅ CM Maintenance Jobs seeded")
}

// ============================================================
// HELPER: MOXA TAP Device builder (สร้าง device พร้อม checklist)
// ============================================================
function moxaDevice(
    tapCode: string,
    stationCode: string,
    columnOrder: number,
    statusLed: string,
    lan1Led: string,
) {
    return {
        tapCode,
        stationCode,
        columnOrder,
        checklist: Array.from({ length: 19 }, (_, i) => ({
            itemNo: i + 1,
            result: "PASS",
        })),
        ledStatus: {
            PWR1: "GREEN_ON",
            STATUS: statusLed,
            HEAD: "GREEN_ON",
            TAIL: "GREEN_ON",
            LAN1: lan1Led,
            WLAN1: "GREEN_ON",
        },
    }
}

// ============================================================
// HELPER: JSON Schema Definitions
// ============================================================
function pointMachineSchema() {
    return {
        type: "object",
        required: ["devices"],
        properties: {
            devices: {
                type: "array",
                minItems: 1,
                maxItems: 4,
                items: {
                    type: "object",
                    required: ["pmCode", "columnOrder", "checklist"],
                    properties: {
                        pmCode: { type: "string" },
                        columnOrder: { type: "integer", minimum: 1, maximum: 4 },
                        checklist: {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["itemNo", "result"],
                                properties: {
                                    itemNo: { type: "integer" },
                                    result: { type: "string", enum: ["PASS", "FAIL", "NA", "NOT_CHECKED"] },
                                    remark: { type: "string" },
                                },
                            },
                        },
                        powerRod3mm: {
                            type: "object",
                            properties: {
                                plusDistance: { type: "number" },
                                minusDistance: { type: "number" },
                            },
                        },
                        powerRod5mm: {
                            type: "object",
                            properties: {
                                plusDistance: { type: "number" },
                                minusDistance: { type: "number" },
                            },
                        },
                        detectorRod: {
                            type: "object",
                            properties: {
                                inPlus: { type: "number" },
                                inMinus: { type: "number" },
                                outPlus: { type: "number" },
                                outMinus: { type: "number" },
                            },
                        },
                        forceMeasurement: {
                            type: "object",
                            properties: {
                                forceBeforePlus: { type: "number", minimum: 0 },
                                forceBeforeMinus: { type: "number", minimum: 0 },
                                forceAfterPlus: { type: "number", minimum: 0 },
                                forceAfterMinus: { type: "number", minimum: 0 },
                                markCenterBeforePlus: { type: "number" },
                                markCenterBeforeMinus: { type: "number" },
                                markCenterAfterPlus: { type: "number" },
                                markCenterAfterMinus: { type: "number" },
                            },
                        },
                        electrical: {
                            type: "object",
                            properties: {
                                contactPlus_2_3: { type: "number", minimum: 0, maximum: 10 },
                                contactPlus_11_12: { type: "number", minimum: 0, maximum: 10 },
                                contactPlus_13_14: { type: "number", minimum: 0, maximum: 10 },
                                contactMinus_1_2: { type: "number", minimum: 0, maximum: 10 },
                                contactMinus_3_4: { type: "number", minimum: 0, maximum: 10 },
                                contactMinus_12_13: { type: "number", minimum: 0, maximum: 10 },
                                voltageL1L2: { type: "number" },
                                voltageL1L3: { type: "number" },
                                voltageL2L3: { type: "number" },
                                currentStart: { type: "number" },
                                currentRun: { type: "number" },
                                terminalPlus: { type: "number" },
                                terminalMinus: { type: "number" },
                            },
                        },
                        springForce: {
                            type: "array",
                            maxItems: 20,
                            items: {
                                type: "object",
                                required: ["contactNo"],
                                properties: {
                                    contactNo: { type: "integer", minimum: 1, maximum: 20 },
                                    before: { type: "number", minimum: 0 },
                                    after: { type: "number", minimum: 0 },
                                },
                            },
                        },
                    },
                },
            },
        },
    }
}

function moxaTapSchema() {
    const ledEnum = ["GREEN_ON", "GREEN_BLINK", "ORANGE_ON", "ORANGE_BLINK", "RED_ON", "OFF"]
    return {
        type: "object",
        required: ["devices"],
        properties: {
            devices: {
                type: "array",
                minItems: 1,
                items: {
                    type: "object",
                    required: ["tapCode", "stationCode", "columnOrder", "checklist"],
                    properties: {
                        tapCode: { type: "string" },
                        stationCode: { type: "string" },
                        columnOrder: { type: "integer", minimum: 1 },
                        checklist: {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["itemNo", "result"],
                                properties: {
                                    itemNo: { type: "integer", minimum: 1, maximum: 19 },
                                    result: { type: "string", enum: ["PASS", "FAIL", "NA", "NOT_CHECKED"] },
                                    remark: { type: "string" },
                                },
                            },
                        },
                        ledStatus: {
                            type: "object",
                            properties: {
                                PWR1: { type: "string", enum: ledEnum },
                                STATUS: { type: "string", enum: ledEnum },
                                HEAD: { type: "string", enum: ledEnum },
                                TAIL: { type: "string", enum: ledEnum },
                                LAN1: { type: "string", enum: ledEnum },
                                WLAN1: { type: "string", enum: ledEnum },
                            },
                        },
                    },
                },
            },
        },
    }
}

function empSchema() {
    const resultEnum = ["PASS", "FAIL", "NA", "NOT_CHECKED"]
    return {
        type: "object",
        required: ["controlBox", "surgeProtectionBox", "platform"],
        properties: {
            controlBox: {
                type: "object",
                required: ["checklist"],
                properties: {
                    checklist: {
                        type: "array",
                        minItems: 5,
                        maxItems: 5,
                        items: {
                            type: "object",
                            required: ["itemNo", "result"],
                            properties: {
                                itemNo: { type: "integer", minimum: 1, maximum: 5 },
                                result: { type: "string", enum: resultEnum },
                                remark: { type: "string" },
                            },
                        },
                    },
                },
            },
            surgeProtectionBox: {
                type: "object",
                required: ["isPresent"],
                properties: {
                    isPresent: { type: "boolean" },
                    checklist: {
                        type: "array",
                        items: {
                            type: "object",
                            required: ["itemNo", "result"],
                            properties: {
                                itemNo: { type: "integer", minimum: 1, maximum: 2 },
                                result: { type: "string", enum: resultEnum },
                                remark: { type: "string" },
                            },
                        },
                    },
                },
            },
            platform: {
                type: "object",
                required: ["devices"],
                properties: {
                    devices: {
                        type: "array",
                        minItems: 1,
                        maxItems: 8,
                        items: {
                            type: "object",
                            required: ["empNumber", "checklist"],
                            properties: {
                                empNumber: { type: "integer", minimum: 1, maximum: 8 },
                                checklist: {
                                    type: "array",
                                    minItems: 5,
                                    maxItems: 5,
                                    items: {
                                        type: "object",
                                        required: ["itemNo", "result"],
                                        properties: {
                                            itemNo: { type: "integer", minimum: 1, maximum: 5 },
                                            result: { type: "string", enum: resultEnum },
                                            remark: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }
}

function empTemplate() {
    return {
        controlBox: {
            checklist: [
                { itemNo: 1, result: "NOT_CHECKED", remark: "" },
                { itemNo: 2, result: "NOT_CHECKED", remark: "" },
                { itemNo: 3, result: "NOT_CHECKED", remark: "" },
                { itemNo: 4, result: "NOT_CHECKED", remark: "" },
                { itemNo: 5, result: "NOT_CHECKED", remark: "" },
            ],
        },
        surgeProtectionBox: {
            isPresent: false,
            checklist: [],
        },
        platform: {
            devices: Array.from({ length: 8 }, (_, i) => ({
                empNumber: i + 1,
                checklist: [
                    { itemNo: 1, result: "NOT_CHECKED", remark: "" },
                    { itemNo: 2, result: "NOT_CHECKED", remark: "" },
                    { itemNo: 3, result: "NOT_CHECKED", remark: "" },
                    { itemNo: 4, result: "NOT_CHECKED", remark: "" },
                    { itemNo: 5, result: "NOT_CHECKED", remark: "" },
                ],
            })),
        },
    }
}

// ============================================================
// SEED: Point Machine Y1 — Sample Reports (จาก PDF)
// FM-MTD-M51000-Z-XXX Rev.00
// ใบงาน: PM (Y1) POINT MACHINE JEA72 & JEA73
// สร้าง 2 ใบงาน:
//   1. DRAFT  — ฟอร์มเปล่าพร้อมกรอก
//   2. SUBMITTED — กรอกข้อมูลครบ (สมมติข้อมูลสมจริง)
// ============================================================
async function seedPointMachineReport() {
    console.log("🔧 Seeding Point Machine Y1 Sample Reports...")

    const pmTemplate = await prisma.jobTemplate.findUnique({
        where: { code: "PM_Y1_POINT_MACHINE" },
    })
    const leader = await prisma.user.findUnique({ where: { email: "taweesak@bts.co.th" } })

    if (!pmTemplate || !leader) {
        console.warn("⚠️  Skip PM report — template or user not found")
        return
    }

    // ── Helpers ──────────────────────────────────────────────
    const pmDevicesDraft = [
        { pmCode: "JEA72-1", stationCode: "JEA72", columnOrder: 1 },
        { pmCode: "JEA72-2", stationCode: "JEA72", columnOrder: 2 },
        { pmCode: "JEA73-1", stationCode: "JEA73", columnOrder: 3 },
        { pmCode: "JEA73-2", stationCode: "JEA73", columnOrder: 4 },
    ]

    const makeEmptyChecklist = () =>
        Array.from({ length: 30 }, (_, i) => ({
            itemNo: i + 1,
            result: "NOT_CHECKED",
            remark: "",
        }))

    const makeEmptySpringForce = () =>
        Array.from({ length: 20 }, (_, i) => ({
            contactNo: i + 1,
            before: null,
            after: null,
        }))

    // ──────────────────────────────────────────────────────────
    // Report 1: DRAFT — ฟอร์มเปล่าพร้อมกรอก
    // ──────────────────────────────────────────────────────────
    await prisma.maintenanceReport.upsert({
        where: { id: "sample-pm-draft" },
        update: {},
        create: {
            id: "sample-pm-draft",
            jobTemplateId: pmTemplate.id,
            leaderId: leader.id,
            workOrderNo: "DRAFT-PM-Y1-001",
            reportDate: new Date("2026-03-01"),
            reportTimeStart: "01:00",
            reportTimeEnd: "",
            stationName: "JEA72 & JEA73",
            locationArea: "Wayside JEA",
            leaderName: "",
            apostleName: "",
            coordinatePerson: "",
            tprNo: "",
            teamNameList: "",
            workDescription: "PM (Y1) Point Machine JEA72 & JEA73",
            equipmentCount: 4,
            equipmentCodes: ["JEA72-1", "JEA72-2", "JEA73-1", "JEA73-2"],
            stationCodes: ["JEA72", "JEA73"],
            status: "DRAFT",
            totalCheckItems: 0,
            passCount: 0,
            failCount: 0,
            hasIssues: false,

            // Layer 2: โครงสร้างเปล่า ครบทุก field รอช่างกรอก
            checklistData: {
                devices: pmDevicesDraft.map((dev) => ({
                    pmCode: dev.pmCode,
                    stationCode: dev.stationCode,
                    columnOrder: dev.columnOrder,
                    checklist: makeEmptyChecklist(),
                    powerRod3mm: { plusDistance: null, minusDistance: null },
                    powerRod5mm: { plusDistance: null, minusDistance: null },
                    detectorRod: { inPlus: null, inMinus: null, outPlus: null, outMinus: null },
                    forceMeasurement: {
                        forceBeforePlus: null, forceBeforeMinus: null,
                        forceAfterPlus: null, forceAfterMinus: null,
                        markCenterBeforePlus: null, markCenterBeforeMinus: null,
                        markCenterAfterPlus: null, markCenterAfterMinus: null,
                    },
                    electrical: {
                        plus: {
                            contactPlus_2_3: null, contactPlus_11_12: null, contactPlus_13_14: null,
                            voltageL1L2: null, voltageL1L3: null, voltageL2L3: null,
                            currentStart: null, currentRun: null, terminalDetect: null,
                        },
                        minus: {
                            contactMinus_1_2: null, contactMinus_3_4: null, contactMinus_12_13: null,
                            voltageL1L2: null, voltageL1L3: null, voltageL2L3: null,
                            currentStart: null, currentRun: null, terminalDetect: null,
                        },
                    },
                    springForce: makeEmptySpringForce(),
                })),
            },
        },
    })

    console.log("  ✓ Draft report (blank form) created")

    // ──────────────────────────────────────────────────────────
    // Report 2: SUBMITTED — กรอกข้อมูลครบ (สมมติข้อมูลสมจริง)
    // ──────────────────────────────────────────────────────────

    // Helper: Checklist ที่กรอกแล้ว — JEA72-2 ข้อ 13 = FAIL
    const makeFilledChecklist = (pmCode: string) =>
        Array.from({ length: 30 }, (_, i) => {
            const itemNo = i + 1
            if (pmCode === "JEA72-2" && itemNo === 13) {
                return { itemNo, result: "FAIL", remark: "พบรอยแตกร้าวกว้าง 2.5 mm ที่ฐานปูน" }
            }
            return { itemNo, result: "PASS", remark: "" }
        })

    // Helper: Spring Force — JEA73-1 Contact 7 ต่ำกว่า Criteria
    const makeFilledSpringForce = (pmCode: string) =>
        Array.from({ length: 20 }, (_, i) => {
            const contactNo = i + 1
            if (pmCode === "JEA73-1" && contactNo === 7) {
                return { contactNo, before: 2.8, after: 3.5 }
            }
            const base = 3.2 + ((contactNo * 17) % 16) / 10
            return { contactNo, before: parseFloat(base.toFixed(1)), after: null }
        })

    const pmDevicesFilled = [
        {
            pmCode: "JEA72-1", stationCode: "JEA72", columnOrder: 1,
            forcePlus: 4850, forceMinus: 5100,
            markCenterPlus: 2.5, markCenterMinus: 2.5,
            forceAfterPlus: null, forceAfterMinus: null,
            markAfterPlus: null, markAfterMinus: null,
            powerRod3mmPlus: null, powerRod3mmMinus: null,
            powerRod5mmPlus: null, powerRod5mmMinus: null,
            detectorIn: 2.5, detectorInMinus: 2.5,
            detectorOut: null, detectorOutMinus: null,
        },
        {
            pmCode: "JEA72-2", stationCode: "JEA72", columnOrder: 2,
            forcePlus: 3750, forceMinus: 4100,
            markCenterPlus: 1.5, markCenterMinus: 2.0,
            forceAfterPlus: 4200, forceAfterMinus: 4300,
            markAfterPlus: 2.5, markAfterMinus: 2.5,
            powerRod3mmPlus: 0.5, powerRod3mmMinus: 0,
            powerRod5mmPlus: null, powerRod5mmMinus: null,
            detectorIn: 3.0, detectorInMinus: 2.8,
            detectorOut: null, detectorOutMinus: null,
        },
        {
            pmCode: "JEA73-1", stationCode: "JEA73", columnOrder: 3,
            forcePlus: 5200, forceMinus: 4900,
            markCenterPlus: 2.5, markCenterMinus: 2.5,
            forceAfterPlus: null, forceAfterMinus: null,
            markAfterPlus: null, markAfterMinus: null,
            powerRod3mmPlus: null, powerRod3mmMinus: null,
            powerRod5mmPlus: null, powerRod5mmMinus: null,
            detectorIn: 2.5, detectorInMinus: 2.5,
            detectorOut: null, detectorOutMinus: null,
        },
        {
            pmCode: "JEA73-2", stationCode: "JEA73", columnOrder: 4,
            forcePlus: 4600, forceMinus: 4700,
            markCenterPlus: 2.5, markCenterMinus: 2.5,
            forceAfterPlus: null, forceAfterMinus: null,
            markAfterPlus: null, markAfterMinus: null,
            powerRod3mmPlus: null, powerRod3mmMinus: null,
            powerRod5mmPlus: null, powerRod5mmMinus: null,
            detectorIn: 2.5, detectorInMinus: 2.5,
            detectorOut: null, detectorOutMinus: null,
        },
    ]

    const totalCheckItems = 30 * 4  // 30 ข้อ × 4 PM = 120
    const failCount = 1       // JEA72-2 ข้อ 13

    await prisma.maintenanceReport.upsert({
        where: { id: "sample-pm-submitted" },
        update: {},
        create: {
            id: "sample-pm-submitted",
            jobTemplateId: pmTemplate.id,
            leaderId: leader.id,
            workOrderNo: "601479001",
            reportDate: new Date("2026-01-15"),
            reportTimeStart: "01:00",
            reportTimeEnd: "05:30",
            stationName: "JEA72 & JEA73",
            locationArea: "Wayside JEA — Between Station E14-E15",
            leaderName: "Taweesak T.",
            apostleName: "Saknarin S.",
            coordinatePerson: "SKT1-LC",
            tprNo: "P/055",
            teamNameList: "Phanuwat T., Wudtipong S., Nattapong K.",
            workDescription: "PM (Y1) Point Machine JEA72 & JEA73",
            equipmentCount: 4,
            equipmentCodes: ["JEA72-1", "JEA72-2", "JEA73-1", "JEA73-2"],
            stationCodes: ["JEA72", "JEA73"],
            stationAccessStatus: "ENTRY",
            ccrAccessStatus: "ENTRY",
            hasEarthingDevice: true,
            earthingDeviceStatus: "RETURNED",
            hasVoltageTester: true,
            voltageTesterStatus: "RETURNED",
            status: "SUBMITTED",
            submittedAt: new Date("2026-01-15T06:00:00Z"),
            totalCheckItems,
            passCount: totalCheckItems - failCount,
            failCount,
            hasIssues: true,
            additionalRemarks: "JEA72-2: พบรอยแตกร้าวที่ฐานปูน กว้าง 2.5mm เกิน Criteria 2mm — แจ้งทีมโยธาเพื่อซ่อมแซม\nJEA72-2: Force ต่ำกว่า Criteria ปรับตั้งเรียบร้อยแล้ว\nJEA73-1: Contact 7 Spring Force ต่ำกว่า Criteria ปรับตั้งเรียบร้อยแล้ว",

            // ── Layer 2: JSONB ครบทุก field ──────────────────────────
            checklistData: {
                devices: pmDevicesFilled.map((dev) => ({
                    pmCode: dev.pmCode,
                    stationCode: dev.stationCode,
                    columnOrder: dev.columnOrder,
                    checklist: makeFilledChecklist(dev.pmCode),
                    powerRod3mm: {
                        plusDistance: dev.powerRod3mmPlus,
                        minusDistance: dev.powerRod3mmMinus,
                    },
                    powerRod5mm: {
                        plusDistance: dev.powerRod5mmPlus,
                        minusDistance: dev.powerRod5mmMinus,
                    },
                    detectorRod: {
                        inPlus: dev.detectorIn,
                        inMinus: dev.detectorInMinus,
                        outPlus: dev.detectorOut,
                        outMinus: dev.detectorOutMinus,
                    },
                    forceMeasurement: {
                        forceBeforePlus: dev.forcePlus,
                        forceBeforeMinus: dev.forceMinus,
                        forceAfterPlus: dev.forceAfterPlus,
                        forceAfterMinus: dev.forceAfterMinus,
                        markCenterBeforePlus: dev.markCenterPlus,
                        markCenterBeforeMinus: dev.markCenterMinus,
                        markCenterAfterPlus: dev.markAfterPlus,
                        markCenterAfterMinus: dev.markAfterMinus,
                    },
                    electrical: {
                        plus: {
                            contactPlus_2_3: 0.3,
                            contactPlus_11_12: 0.4,
                            contactPlus_13_14: 0.3,
                            voltageL1L2: 220,
                            voltageL1L3: 220,
                            voltageL2L3: 220,
                            currentStart: 12.5,
                            currentRun: 8.2,
                            terminalDetect: 24.0,
                        },
                        minus: {
                            contactMinus_1_2: 0.3,
                            contactMinus_3_4: 0.4,
                            contactMinus_12_13: 0.3,
                            voltageL1L2: 220,
                            voltageL1L3: 220,
                            voltageL2L3: 220,
                            currentStart: 12.3,
                            currentRun: 8.0,
                            terminalDetect: 24.0,
                        },
                    },
                    springForce: makeFilledSpringForce(dev.pmCode),
                })),
            },
        },
    })

    console.log("  ✓ Submitted report (filled data) created")
    console.log("✅ Point Machine Y1 Reports seeded")
}

// ============================================================
// MAIN
// ============================================================
async function main() {
    console.log("🌱 Starting BTS Smart Maintenance seed...\n")

    await seedUsers()
    await seedJobTemplates()
    await seedSampleReports()
    await seedMaintenanceJobs()
    await seedPointMachineReport()

    console.log("\n🎉 All seeds completed!")
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })