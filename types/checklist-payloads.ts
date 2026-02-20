// ============================================================
// types/checklist-payloads.ts
// TypeScript Type Definitions สำหรับ JSONB Layer 2
// ใช้ร่วมกับ Prisma checklistData field
// ============================================================

// ── Shared Types ─────────────────────────────────────────────

export type CheckResult = "PASS" | "FAIL" | "NA" | "NOT_CHECKED"

export type LedColor =
    | "GREEN_ON"
    | "GREEN_BLINK"
    | "ORANGE_ON"
    | "ORANGE_BLINK"
    | "RED_ON"
    | "OFF"

// ============================================================
// POINT MACHINE (Y1)
// jobTemplateCode: "PM_Y1_POINT_MACHINE"
// ============================================================

export interface PointMachineChecklistItem {
    itemNo: number
    result: CheckResult
    remark?: string
}

export interface PowerRodAdjustment {
    plusDistance?: number   // mm
    minusDistance?: number  // mm
}

export interface DetectorRodAdjustment {
    inPlus?: number    // mm
    inMinus?: number   // mm
    outPlus?: number   // mm
    outMinus?: number  // mm
}

export interface ForceMeasurement {
    forceBeforePlus?: number   // Nm (criteria: 4000–6000)
    forceBeforeMinus?: number
    forceAfterPlus?: number
    forceAfterMinus?: number
    markCenterBeforePlus?: number   // mm
    markCenterBeforeMinus?: number
    markCenterAfterPlus?: number
    markCenterAfterMinus?: number
}

export interface ElectricalMeasurement {
    contactPlus_2_3?: number
    contactPlus_11_12?: number
    contactPlus_13_14?: number
    contactMinus_1_2?: number
    contactMinus_3_4?: number
    contactMinus_12_13?: number
    voltageL1L2?: number
    voltageL1L3?: number
    voltageL2L3?: number
    currentStart?: number
    currentRun?: number
    terminalPlus?: number
    terminalMinus?: number
}

export interface SpringForceContact {
    contactNo: number  // 1–20
    before?: number    // Nm (criteria: 3–5)
    after?: number     // Nm
}

export interface PointMachineDevice {
    pmCode: string
    columnOrder: number
    checklist: PointMachineChecklistItem[]
    powerRod3mm?: PowerRodAdjustment
    powerRod5mm?: PowerRodAdjustment
    detectorRod?: DetectorRodAdjustment
    forceMeasurement?: ForceMeasurement
    electrical?: ElectricalMeasurement
    springForce?: SpringForceContact[]
}

export interface PointMachineY1Payload {
    devices: PointMachineDevice[]
}

// ============================================================
// MOXA TAP (M3)
// jobTemplateCode: "PM_M3_MOXA_TAP"
// ============================================================

export interface MoxaTapLedStatus {
    PWR1?: LedColor
    STATUS?: LedColor
    HEAD?: LedColor
    TAIL?: LedColor
    LAN1?: LedColor
    WLAN1?: LedColor
}

export interface MoxaTapDevice {
    tapCode: string
    stationCode: string
    columnOrder: number
    checklist: {
        itemNo: number
        result: CheckResult
        remark?: string
    }[]
    ledStatus?: MoxaTapLedStatus
}

export interface MoxaTapM3Payload {
    devices: MoxaTapDevice[]
}

// ============================================================
// EMP (M2)
// jobTemplateCode: "PM_M2_EMP"
// ============================================================

export interface EmpControlBoxChecklist {
    itemNo: number
    result: CheckResult
    remark?: string
}

export interface SurgeProtectionBox {
    isPresent: boolean
    checklist?: {
        itemNo: number
        result: CheckResult
        remark?: string
    }[]
}

export interface EmpPlungerDevice {
    empNumber: number
    checklist: {
        itemNo: number
        result: CheckResult
        remark?: string
    }[]
}

export interface EmpM2Payload {
    controlBox: {
        checklist: EmpControlBoxChecklist[]
    }
    surgeProtectionBox: SurgeProtectionBox
    platform: {
        devices: EmpPlungerDevice[]
    }
}

// ============================================================
// Union Type & Template Code Map
// ============================================================
export type ChecklistPayload =
    | PointMachineY1Payload
    | MoxaTapM3Payload
    | EmpM2Payload

export type JobTemplateCode =
    | "PM_Y1_POINT_MACHINE"
    | "PM_M3_MOXA_TAP"
    | "PM_M2_EMP"

// Helper map for template code to display name
export const TEMPLATE_DISPLAY_NAMES: Record<JobTemplateCode, string> = {
    PM_Y1_POINT_MACHINE: "PM (Y1) Point Machine",
    PM_M3_MOXA_TAP: "PM (M3) MOXA TAP",
    PM_M2_EMP: "PM (M2) EMP",
}

// LED Color display labels
export const LED_COLOR_LABELS: Record<LedColor, { label: string; color: string; bgColor: string }> = {
    GREEN_ON: { label: "Green On", color: "#22c55e", bgColor: "#f0fdf4" },
    GREEN_BLINK: { label: "Green Blink", color: "#22c55e", bgColor: "#f0fdf4" },
    ORANGE_ON: { label: "Orange On", color: "#f97316", bgColor: "#fff7ed" },
    ORANGE_BLINK: { label: "Orange Blink", color: "#f97316", bgColor: "#fff7ed" },
    RED_ON: { label: "Red On", color: "#ef4444", bgColor: "#fef2f2" },
    OFF: { label: "Off", color: "#6b7280", bgColor: "#f9fafb" },
}