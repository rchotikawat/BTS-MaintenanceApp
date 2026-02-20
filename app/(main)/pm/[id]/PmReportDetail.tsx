"use client"

import { useState } from "react"
import { updatePmReport, submitPmReport } from "@/app/actions/pmActions"
import { useRouter } from "next/navigation"
import type { JobTemplateCode } from "@/types/checklist-payloads"
import Link from "next/link"
import PmPdfDownloadButton from "./PmPdfDownloadButton"

// Dynamic Form Components - Component Registry Pattern
import PointMachineY1Form from "./forms/PointMachineY1Form"
import MoxaM3Form from "./forms/MoxaM3Form"
import EmpM2Form from "./forms/EmpM2Form"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReportData = any

const EQUIPMENT_ICONS: Record<string, string> = {
    POINT_MACHINE: "🔀",
    MOXA_TAP: "📡",
    EMP: "🛑",
}

// ── Component Registry ──────────────────────────────────────
const FORM_REGISTRY: Record<string, React.ComponentType<{
    checklistData: unknown
    onChange: (data: unknown) => void
    isReadOnly: boolean
}>> = {
    PM_Y1_POINT_MACHINE: PointMachineY1Form,
    PM_M3_MOXA_TAP: MoxaM3Form,
    PM_M2_EMP: EmpM2Form,
}

export default function PmReportDetail({ report }: { report: ReportData }) {
    const router = useRouter()
    const [checklistData, setChecklistData] = useState(report.checklistData || {})
    const [isSaving, setIsSaving] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [saveMessage, setSaveMessage] = useState("")
    const [activeTab, setActiveTab] = useState<"header" | "checklist">("checklist")

    const isReadOnly = report.status !== "DRAFT"
    const templateCode = report.jobTemplate.code as JobTemplateCode
    const FormComponent = FORM_REGISTRY[templateCode]

    const handleSave = async () => {
        setIsSaving(true)
        setSaveMessage("")
        try {
            await updatePmReport(report.id, { checklistData })
            setSaveMessage("✅ บันทึกสำเร็จ")
            setTimeout(() => setSaveMessage(""), 3000)
        } catch {
            setSaveMessage("❌ เกิดข้อผิดพลาด")
        } finally {
            setIsSaving(false)
        }
    }

    const handleSubmit = async () => {
        if (!confirm("ยืนยันส่งใบงานนี้? เมื่อส่งแล้วจะไม่สามารถแก้ไขได้")) return

        setIsSubmitting(true)
        try {
            // Save latest data first
            await updatePmReport(report.id, { checklistData })
            // Then submit
            await submitPmReport(report.id)
            router.refresh()
        } catch {
            setSaveMessage("❌ เกิดข้อผิดพลาดในการส่งงาน")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/pm"
                        className="text-sm text-gray-500 hover:text-blue-600 transition flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        กลับ
                    </Link>
                    <span className="text-gray-300">|</span>
                    <span className="text-2xl">{EQUIPMENT_ICONS[report.jobTemplate.equipmentType]}</span>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{report.jobTemplate.name}</h1>
                        <p className="text-sm text-gray-500">WO: {report.workOrderNo} • {report.stationName}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    {/* Status Badge */}
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${report.status === "DRAFT" ? "bg-slate-100 text-slate-700 border-slate-200" :
                        report.status === "SUBMITTED" ? "bg-amber-100 text-amber-700 border-amber-200" :
                            report.status === "APPROVED" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                "bg-red-100 text-red-700 border-red-200"
                        }`}>
                        {report.status === "DRAFT" ? "📝 ร่าง" :
                            report.status === "SUBMITTED" ? "📤 ส่งแล้ว" :
                                report.status === "APPROVED" ? "✅ อนุมัติ" : "🔄 ส่งกลับ"}
                    </span>
                    {/* PDF Download*/}
                    <PmPdfDownloadButton report={report} />

                    {!isReadOnly && (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                {isSaving ? "กำลังบันทึก..." : "💾 บันทึก"}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-5 py-2 text-sm font-medium text-white bg-linear-to-r from-emerald-500 to-green-600 rounded-xl hover:from-emerald-600 hover:to-green-700 transition shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                            >
                                {isSubmitting ? "กำลังส่ง..." : "📤 ส่งงาน"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Save message */}
            {saveMessage && (
                <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${saveMessage.includes("✅") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                    {saveMessage}
                </div>
            )}

            {/* Tab Switcher */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab("header")}
                        className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === "header"
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        📄 ข้อมูลทั่วไป (Header)
                        {activeTab === "header" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("checklist")}
                        className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === "checklist"
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        📋 Checklist ({report.jobTemplate.name})
                        {activeTab === "checklist" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                        )}
                    </button>
                </div>
            </div>

            {/* Header Info (read-only summary) */}
            {activeTab === "header" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                        <h2 className="text-lg font-semibold text-gray-800">📄 ข้อมูลทั่วไป</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoField label="Work Order No." value={report.workOrderNo} />
                            {report.workOrderNo2 && <InfoField label="Work Order No. 2" value={report.workOrderNo2} />}
                            <InfoField label="วันที่" value={new Date(report.reportDate).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })} />
                            <InfoField label="เวลาเริ่ม" value={report.reportTimeStart} />
                            <InfoField label="เวลาสิ้นสุด" value={report.reportTimeEnd || "-"} />
                            <InfoField label="สถานี" value={report.stationName} />
                            <InfoField label="พื้นที่" value={report.locationArea} />
                            <InfoField label="หัวหน้าทีม" value={report.leaderName} />
                            <InfoField label="ผู้ร่วมงาน" value={report.apostleName} />
                            <InfoField label="ผู้ประสานงาน" value={report.coordinatePerson} />
                            <InfoField label="TPR No." value={report.tprNo || "-"} />
                            <InfoField label="ทีมงาน" value={report.teamNameList || "-"} />
                        </div>
                        {report.workDescription && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <InfoField label="รายละเอียดงาน" value={report.workDescription} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Dynamic Checklist Form */}
            {activeTab === "checklist" && (
                <div>
                    {FormComponent ? (
                        <FormComponent
                            checklistData={checklistData}
                            onChange={setChecklistData}
                            isReadOnly={isReadOnly}
                        />
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="text-5xl mb-4">🚧</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">ยังไม่รองรับประเภทงานนี้</h3>
                            <p className="text-gray-500 text-sm">Template: {templateCode}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-sm text-gray-800 font-medium">{value}</p>
        </div>
    )
}