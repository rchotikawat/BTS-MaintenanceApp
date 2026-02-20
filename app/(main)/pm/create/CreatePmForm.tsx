"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPmReport } from "@/app/actions/pmActions"

type Template = {
    id: string
    code: string
    name: string
    equipmentType: string
    cycleLabel: string
    formNumber: string | null
}

const EQUIPMENT_ICONS: Record<string, string> = {
    POINT_MACHINE: "🔀",
    MOXA_TAP: "📡",
    EMP: "🛑",
}

const EQUIPMENT_COLORS: Record<string, string> = {
    POINT_MACHINE: "from-purple-500 to-indigo-600",
    MOXA_TAP: "from-cyan-500 to-blue-600",
    EMP: "from-red-500 to-orange-600",
}

export default function CreatePmForm({ templates }: { templates: Template[] }) {
    const router = useRouter()
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedTemplate) return

        setIsSubmitting(true)
        setError("")

        const formData = new FormData(e.currentTarget)

        try {
            const result = await createPmReport({
                jobTemplateId: selectedTemplate.id,
                workOrderNo: formData.get("workOrderNo") as string,
                workOrderNo2: (formData.get("workOrderNo2") as string) || undefined,
                reportDate: formData.get("reportDate") as string,
                reportTimeStart: formData.get("reportTimeStart") as string,
                reportTimeEnd: (formData.get("reportTimeEnd") as string) || undefined,
                stationName: formData.get("stationName") as string,
                locationArea: formData.get("locationArea") as string,
                leaderName: formData.get("leaderName") as string,
                apostleName: formData.get("apostleName") as string,
                coordinatePerson: formData.get("coordinatePerson") as string,
                tprNo: (formData.get("tprNo") as string) || undefined,
                teamNameList: (formData.get("teamNameList") as string) || undefined,
                workDescription: (formData.get("workDescription") as string) || undefined,
                checklistData: {},
            })

            if (result.success && result.id) {
                router.push(`/pm/${result.id}`)
            }
        } catch {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            {/* Step 1: Template Selection */}
            {!selectedTemplate && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 1: เลือกประเภทงาน</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => setSelectedTemplate(template)}
                                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all text-left overflow-hidden"
                            >
                                {/* Gradient accent bar */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${EQUIPMENT_COLORS[template.equipmentType] || "from-gray-400 to-gray-500"}`} />

                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${EQUIPMENT_COLORS[template.equipmentType] || "from-gray-400 to-gray-500"} flex items-center justify-center shadow-lg`}>
                                        <span className="text-2xl">{EQUIPMENT_ICONS[template.equipmentType] || "⚙️"}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{template.name}</h3>
                                        <p className="text-xs text-gray-400 mt-0.5 font-mono">{template.code}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                รอบ: {template.cycleLabel}
                                            </span>
                                            {template.formNumber && (
                                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                                    {template.formNumber}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Header Form */}
            {selectedTemplate && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => setSelectedTemplate(null)}
                            className="text-sm text-gray-500 hover:text-blue-600 transition flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            เปลี่ยนประเภท
                        </button>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{EQUIPMENT_ICONS[selectedTemplate.equipmentType]}</span>
                            <span className="font-semibold text-gray-800">{selectedTemplate.name}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Common Header Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">📝</span>
                                    ข้อมูลทั่วไป (Header)
                                </h2>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Row 1: Work Orders */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Work Order No. <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="workOrderNo"
                                            type="text"
                                            required
                                            placeholder="เช่น 601478658"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Work Order No. 2 (ถ้ามี)
                                        </label>
                                        <input
                                            name="workOrderNo2"
                                            type="text"
                                            placeholder="กรณีมีหลาย WO"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition"
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Date / Time */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            วันที่ <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="reportDate"
                                            type="date"
                                            required
                                            defaultValue={new Date().toISOString().split("T")[0]}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            เวลาเริ่ม <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="reportTimeStart"
                                            type="time"
                                            required
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            เวลาสิ้นสุด
                                        </label>
                                        <input
                                            name="reportTimeEnd"
                                            type="time"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition"
                                        />
                                    </div>
                                </div>

                                {/* Row 3: Station / Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            สถานี <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="stationName"
                                            type="text"
                                            required
                                            placeholder="เช่น E3-E5 หรือ E22 E23"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            พื้นที่ <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="locationArea"
                                            type="text"
                                            required
                                            placeholder="เช่น E3-E5"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition"
                                        />
                                    </div>
                                </div>

                                {/* Row 4: Leader / Apostle */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            หัวหน้าทีม <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="leaderName"
                                            type="text"
                                            required
                                            placeholder="ชื่อหัวหน้าทีม"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            ผู้ร่วมงาน <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="apostleName"
                                            type="text"
                                            required
                                            placeholder="ชื่อผู้ร่วมงาน"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition"
                                        />
                                    </div>
                                </div>

                                {/* Row 5: Coordinate / TPR */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            ผู้ประสานงาน <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="coordinatePerson"
                                            type="text"
                                            required
                                            placeholder="เช่น SKT1-LC"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            TPR No.
                                        </label>
                                        <input
                                            name="tprNo"
                                            type="text"
                                            placeholder="เช่น P/081"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            ทีมงาน
                                        </label>
                                        <input
                                            name="teamNameList"
                                            type="text"
                                            placeholder="ชื่อสมาชิก คั่นด้วย ,"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition"
                                        />
                                    </div>
                                </div>

                                {/* Row 6: Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        รายละเอียดงาน
                                    </label>
                                    <textarea
                                        name="workDescription"
                                        rows={2}
                                        placeholder="รายละเอียดเพิ่มเติม..."
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => router.push("/pm")}
                                className="px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50"
                            >
                                {isSubmitting ? "กำลังสร้าง..." : "สร้างใบงาน → ไปกรอก Checklist"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}