"use client"

import { useState } from "react"
import type { PointMachineY1Payload, PointMachineDevice, CheckResult } from "@/types/checklist-payloads"

const CHECKLIST_SECTIONS = [
    {
        title: "ขั้นตอนที่ 1: ตรวจสอบทั่วไป (Visual Inspection)",
        icon: "👁️",
        items: [
            { no: 1, desc: "ตรวจสอบสภาพภายนอก Point Machine" },
            { no: 2, desc: "ตรวจสอบ Housing / Cover" },
            { no: 3, desc: "ตรวจสอบ Power Rod Adjustment (3mm)" },
            { no: 4, desc: "ตรวจสอบ Power Rod Adjustment (5mm)" },
            { no: 5, desc: "ตรวจสอบ Lock Mechanism" },
            { no: 6, desc: "ตรวจสอบ Motor & Gear" },
            { no: 7, desc: "ตรวจสอบ Detector Rod" },
            { no: 8, desc: "ตรวจสอบ Crank Mechanism" },
            { no: 9, desc: "ตรวจสอบ Slide Chair" },
            { no: 10, desc: "ตรวจสอบ Switch Rail" },
        ],
    },
    {
        title: "ขั้นตอนที่ 2: การหล่อลื่น (Lubrication)",
        icon: "🛢️",
        items: [
            { no: 11, desc: "หล่อลื่น Motor Bearing" },
            { no: 12, desc: "หล่อลื่น Gear Mechanism" },
            { no: 13, desc: "หล่อลื่น Lock Mechanism" },
            { no: 14, desc: "หล่อลื่น Slide Chair" },
            { no: 15, desc: "หล่อลื่น Crank Pin" },
        ],
    },
    {
        title: "ขั้นตอนที่ 3: การวัดค่า (Measurements)",
        icon: "📏",
        items: [
            { no: 16, desc: "วัดค่า Force" },
            { no: 17, desc: "วัดค่า Mark Center" },
            { no: 18, desc: "วัดค่า Contact Resistance" },
            { no: 19, desc: "วัดค่า Voltage" },
            { no: 20, desc: "วัดค่า Current" },
        ],
    },
    {
        title: "ขั้นตอนที่ 4: ทดสอบการทำงาน (Functional Test)",
        icon: "⚡",
        items: [
            { no: 21, desc: "ทดสอบ Normal Operation" },
            { no: 22, desc: "ทดสอบ Reverse Operation" },
            { no: 23, desc: "ทดสอบ Detection" },
            { no: 24, desc: "ทดสอบ Lock Check" },
            { no: 25, desc: "ทดสอบ Manual Release" },
        ],
    },
    {
        title: "ขั้นตอนที่ 5: สรุปผล (Summary)",
        icon: "📝",
        items: [
            { no: 26, desc: "ตรวจสอบ Terminal Box" },
            { no: 27, desc: "ตรวจสอบ Spring Force Contact" },
            { no: 28, desc: "ทำความสะอาด" },
            { no: 29, desc: "ปิดฝา Cover" },
            { no: 30, desc: "สรุปผลการตรวจสอบ" },
        ],
    },
]

export default function PointMachineY1Form({
    checklistData,
    onChange,
    isReadOnly,
}: {
    checklistData: unknown
    onChange: (data: unknown) => void
    isReadOnly: boolean
}) {
    const data: PointMachineY1Payload = {
        ...((checklistData as PointMachineY1Payload) || {}),
        devices: (checklistData as PointMachineY1Payload)?.devices ?? [],
    }
    const [activeSection, setActiveSection] = useState(0)
    const [expandedDevice, setExpandedDevice] = useState<number | null>(0)
    const [activeTab, setActiveTab] = useState<"checklist" | "measurements">("checklist")
    const [showAddDevice, setShowAddDevice] = useState(false)
    const [newPmCode, setNewPmCode] = useState("")

    const updateDevices = (devices: PointMachineDevice[]) => {
        onChange({ ...data, devices })
    }

    const addDevice = () => {
        if (!newPmCode) return
        const newDevice: PointMachineDevice = {
            pmCode: newPmCode,
            columnOrder: data.devices.length + 1,
            checklist: CHECKLIST_SECTIONS.flatMap(s => s.items).map(item => ({
                itemNo: item.no,
                result: "NOT_CHECKED" as CheckResult,
            })),
            powerRod3mm: { plusDistance: undefined, minusDistance: undefined },
            powerRod5mm: { plusDistance: undefined, minusDistance: undefined },
            detectorRod: { inPlus: undefined, inMinus: undefined, outPlus: undefined, outMinus: undefined },
            forceMeasurement: {},
            electrical: {},
            springForce: Array.from({ length: 20 }, (_, i) => ({ contactNo: i + 1 })),
        }
        updateDevices([...data.devices, newDevice])
        setNewPmCode("")
        setShowAddDevice(false)
        setExpandedDevice(data.devices.length)
    }

    const removeDevice = (index: number) => {
        if (!confirm(`ลบ ${data.devices[index].pmCode}?`)) return
        const updated = data.devices.filter((_, i) => i !== index)
        updateDevices(updated)
    }

    const updateChecklistItem = (deviceIdx: number, itemNo: number, result: CheckResult) => {
        const devices = [...data.devices]
        const device = { ...devices[deviceIdx] }
        device.checklist = device.checklist.map(item =>
            item.itemNo === itemNo ? { ...item, result } : item
        )
        devices[deviceIdx] = device
        updateDevices(devices)
    }

    const updateMeasurement = (deviceIdx: number, section: string, field: string, value: string) => {
        const devices = [...data.devices]
        const device = { ...devices[deviceIdx] }
        const numVal = value === "" ? undefined : parseFloat(value)

        if (section === "forceMeasurement") {
            device.forceMeasurement = { ...device.forceMeasurement, [field]: numVal }
        } else if (section === "electrical") {
            device.electrical = { ...device.electrical, [field]: numVal }
        } else if (section === "powerRod3mm") {
            device.powerRod3mm = { ...device.powerRod3mm, [field]: numVal }
        } else if (section === "powerRod5mm") {
            device.powerRod5mm = { ...device.powerRod5mm, [field]: numVal }
        } else if (section === "detectorRod") {
            device.detectorRod = { ...device.detectorRod, [field]: numVal }
        }

        devices[deviceIdx] = device
        updateDevices(devices)
    }

    return (
        <div className="space-y-6">
            {/* Main Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab("checklist")}
                        className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition relative ${activeTab === "checklist" ? "text-purple-600" : "text-gray-500"
                            }`}
                    >
                        📋 Checklist ({data.devices.length} ตัว)
                        {activeTab === "checklist" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("measurements")}
                        className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition relative ${activeTab === "measurements" ? "text-purple-600" : "text-gray-500"
                            }`}
                    >
                        📏 ค่าวัด (Measurements)
                        {activeTab === "measurements" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />}
                    </button>
                </div>
            </div>

            {/* Add Device */}
            {!isReadOnly && (
                <div>
                    {!showAddDevice ? (
                        <button
                            onClick={() => setShowAddDevice(true)}
                            className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 px-4 py-2 rounded-xl hover:bg-purple-100 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            เพิ่ม Point Machine
                        </button>
                    ) : (
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-end gap-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">PM Code</label>
                                <input
                                    value={newPmCode}
                                    onChange={e => setNewPmCode(e.target.value)}
                                    placeholder="เช่น JEA72-1"
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                />
                            </div>
                            <button onClick={addDevice} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">เพิ่ม</button>
                            <button onClick={() => setShowAddDevice(false)} className="px-4 py-2 text-gray-500 rounded-lg text-sm hover:bg-gray-100">ยกเลิก</button>
                        </div>
                    )}
                </div>
            )}

            {/* Checklist Tab */}
            {activeTab === "checklist" && (
                <div className="space-y-4">
                    {data.devices.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="text-4xl mb-3">🔀</div>
                            <p className="text-gray-500">ยังไม่มี Point Machine</p>
                        </div>
                    ) : (
                        data.devices.map((device, deviceIdx) => (
                            <div key={deviceIdx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <button
                                    onClick={() => setExpandedDevice(expandedDevice === deviceIdx ? null : deviceIdx)}
                                    className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow">
                                            {deviceIdx + 1}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-900">{device.pmCode}</p>
                                            <p className="text-xs text-gray-500">Col: {device.columnOrder}</p>
                                        </div>
                                        {(() => {
                                            const passCount = device.checklist.filter(c => c.result === "PASS").length
                                            const failCount = device.checklist.filter(c => c.result === "FAIL").length
                                            const checkedCount = passCount + failCount
                                            return (
                                                <div className="ml-4 flex items-center gap-2">
                                                    <span className="text-xs text-gray-500 font-medium">{checkedCount}/{device.checklist.length}</span>
                                                    <span className="text-xs text-green-600">{passCount}✓</span>
                                                    {failCount > 0 && <span className="text-xs text-red-600">{failCount}✗</span>}
                                                </div>
                                            )
                                        })()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!isReadOnly && (
                                            <span onClick={(e) => { e.stopPropagation(); removeDevice(deviceIdx) }} className="text-red-400 hover:text-red-600 text-sm px-2 cursor-pointer">🗑️</span>
                                        )}
                                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedDevice === deviceIdx ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                {expandedDevice === deviceIdx && (
                                    <div className="p-6">
                                        {/* Section Pills */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {CHECKLIST_SECTIONS.map((section, sIdx) => (
                                                <button
                                                    key={sIdx}
                                                    onClick={() => setActiveSection(sIdx)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeSection === sIdx
                                                            ? "bg-purple-100 text-purple-700 ring-2 ring-purple-200"
                                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {section.icon} {section.title.split(":")[0]}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Current Section */}
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-800 mb-3">
                                                {CHECKLIST_SECTIONS[activeSection].icon} {CHECKLIST_SECTIONS[activeSection].title}
                                            </h4>
                                            <table className="w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="pb-2 text-xs font-semibold text-gray-500 text-left w-12">ข้อ</th>
                                                        <th className="pb-2 text-xs font-semibold text-gray-500 text-left">รายการ</th>
                                                        <th className="pb-2 text-xs font-semibold text-gray-500 text-center w-28">ผลตรวจ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {CHECKLIST_SECTIONS[activeSection].items.map(item => {
                                                        const checkItem = device.checklist.find(c => c.itemNo === item.no)
                                                        const result = checkItem?.result || "NOT_CHECKED"

                                                        return (
                                                            <tr key={item.no} className="border-t border-gray-50">
                                                                <td className="py-3 text-sm font-mono text-gray-400">{item.no}</td>
                                                                <td className="py-3 text-sm text-gray-700">{item.desc}</td>
                                                                <td className="py-3 text-center">
                                                                    {isReadOnly ? (
                                                                        <ResultBadge result={result} />
                                                                    ) : (
                                                                        <select
                                                                            value={result}
                                                                            onChange={e => updateChecklistItem(deviceIdx, item.no, e.target.value as CheckResult)}
                                                                            className={`text-xs font-medium px-3 py-1.5 rounded-lg border outline-none ${result === "PASS" ? "bg-green-50 border-green-200 text-green-700" :
                                                                                    result === "FAIL" ? "bg-red-50 border-red-200 text-red-700" :
                                                                                        result === "NA" ? "bg-gray-50 border-gray-200 text-gray-500" :
                                                                                            "bg-yellow-50 border-yellow-200 text-yellow-700"
                                                                                }`}
                                                                        >
                                                                            <option value="NOT_CHECKED">⬜ ยังไม่ตรวจ</option>
                                                                            <option value="PASS">✅ PASS</option>
                                                                            <option value="FAIL">❌ FAIL</option>
                                                                            <option value="NA">➖ N/A</option>
                                                                        </select>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Measurements Tab */}
            {activeTab === "measurements" && (
                <div className="space-y-6">
                    {data.devices.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border p-12 text-center text-gray-400">
                            กรุณาเพิ่ม Point Machine ก่อน
                        </div>
                    ) : (
                        data.devices.map((device, deviceIdx) => (
                            <div key={deviceIdx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                                    <h3 className="font-bold text-gray-900">📏 {device.pmCode} — ค่าวัด</h3>
                                </div>
                                <div className="p-6 space-y-8">
                                    {/* Force Measurement */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded flex items-center justify-center text-xs">F</span>
                                            Force Measurement (Nm) — Criteria: 4,000–6,000
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { field: "forceBeforePlus", label: "Before (+)" },
                                                { field: "forceBeforeMinus", label: "Before (-)" },
                                                { field: "forceAfterPlus", label: "After (+)" },
                                                { field: "forceAfterMinus", label: "After (-)" },
                                            ].map(m => (
                                                <div key={m.field}>
                                                    <label className="text-xs text-gray-500 mb-1 block">{m.label}</label>
                                                    <input
                                                        type="number"
                                                        value={device.forceMeasurement?.[m.field as keyof typeof device.forceMeasurement] ?? ""}
                                                        onChange={e => updateMeasurement(deviceIdx, "forceMeasurement", m.field, e.target.value)}
                                                        disabled={isReadOnly}
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center disabled:opacity-60"
                                                        placeholder="—"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Electrical */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-xs">⚡</span>
                                            Electrical — Contact Resistance (Ω), Voltage (VAC), Current (A)
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { field: "contactPlus_2_3", label: "Contact+ 2-3 (Ω)" },
                                                { field: "contactPlus_11_12", label: "Contact+ 11-12 (Ω)" },
                                                { field: "contactPlus_13_14", label: "Contact+ 13-14 (Ω)" },
                                                { field: "contactMinus_1_2", label: "Contact- 1-2 (Ω)" },
                                                { field: "voltageL1L2", label: "V L1-L2 (VAC)" },
                                                { field: "voltageL1L3", label: "V L1-L3 (VAC)" },
                                                { field: "voltageL2L3", label: "V L2-L3 (VAC)" },
                                                { field: "currentStart", label: "I Start (A)" },
                                                { field: "currentRun", label: "I Run (A)" },
                                                { field: "terminalPlus", label: "Terminal+ (VDC)" },
                                                { field: "terminalMinus", label: "Terminal- (VDC)" },
                                            ].map(m => (
                                                <div key={m.field}>
                                                    <label className="text-xs text-gray-500 mb-1 block">{m.label}</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={device.electrical?.[m.field as keyof typeof device.electrical] ?? ""}
                                                        onChange={e => updateMeasurement(deviceIdx, "electrical", m.field, e.target.value)}
                                                        disabled={isReadOnly}
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center disabled:opacity-60"
                                                        placeholder="—"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Power Rod */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center text-xs">📐</span>
                                            Power Rod & Detector Rod (mm)
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { section: "powerRod3mm", field: "plusDistance", label: "PR 3mm (+)" },
                                                { section: "powerRod3mm", field: "minusDistance", label: "PR 3mm (-)" },
                                                { section: "powerRod5mm", field: "plusDistance", label: "PR 5mm (+)" },
                                                { section: "powerRod5mm", field: "minusDistance", label: "PR 5mm (-)" },
                                                { section: "detectorRod", field: "inPlus", label: "DR In (+)" },
                                                { section: "detectorRod", field: "inMinus", label: "DR In (-)" },
                                                { section: "detectorRod", field: "outPlus", label: "DR Out (+)" },
                                                { section: "detectorRod", field: "outMinus", label: "DR Out (-)" },
                                            ].map(m => (
                                                <div key={`${m.section}-${m.field}`}>
                                                    <label className="text-xs text-gray-500 mb-1 block">{m.label}</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={(device[m.section as keyof PointMachineDevice] as Record<string, number | undefined>)?.[m.field] ?? ""}
                                                        onChange={e => updateMeasurement(deviceIdx, m.section, m.field, e.target.value)}
                                                        disabled={isReadOnly}
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center disabled:opacity-60"
                                                        placeholder="—"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

function ResultBadge({ result }: { result: CheckResult }) {
    const colors: Record<string, string> = {
        PASS: "bg-green-100 text-green-700",
        FAIL: "bg-red-100 text-red-700",
        NA: "bg-gray-100 text-gray-500",
        NOT_CHECKED: "bg-yellow-100 text-yellow-700",
    }
    const labels: Record<string, string> = {
        PASS: "✅ PASS",
        FAIL: "❌ FAIL",
        NA: "➖ N/A",
        NOT_CHECKED: "⬜ ยังไม่ตรวจ",
    }
    return (
        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${colors[result]}`}>
            {labels[result]}
        </span>
    )
}