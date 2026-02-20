"use client"

import { useState, useEffect, useMemo } from "react"
import type { EmpM2Payload, CheckResult } from "@/types/checklist-payloads"

const CONTROL_BOX_ITEMS = [
    { no: 1, desc: "ตรวจสอบสภาพภายนอก EMP Control Box" },
    { no: 2, desc: "ตรวจสอบ Terminal & Connection" },
    { no: 3, desc: "ตรวจสอบ Circuit Breaker" },
    { no: 4, desc: "ตรวจสอบ Relay & Timer" },
    { no: 5, desc: "ตรวจสอบ LED Indicator" },
]

const SURGE_BOX_ITEMS = [
    { no: 1, desc: "ตรวจสอบ Surge Protection Device" },
    { no: 2, desc: "ตรวจสอบ Grounding" },
]

const PLATFORM_ITEMS = [
    { no: 1, desc: "ตรวจสอบปุ่มกด EMP" },
    { no: 2, desc: "ตรวจสอบ Cover / Housing" },
    { no: 3, desc: "ตรวจสอบ Spring Mechanism" },
    { no: 4, desc: "ตรวจสอบ Wiring & Connector" },
    { no: 5, desc: "ทดสอบการทำงาน (Function Test)" },
]

export default function EmpM2Form({
    checklistData,
    onChange,
    isReadOnly,
}: {
    checklistData: unknown
    onChange: (data: unknown) => void
    isReadOnly: boolean
}) {
    const raw = checklistData as EmpM2Payload | undefined
    const data: EmpM2Payload = {
        controlBox: { checklist: [], ...raw?.controlBox },
        surgeProtectionBox: { isPresent: false, checklist: [], ...raw?.surgeProtectionBox },
        platform: { devices: [], ...raw?.platform },
    }
    const [activeSection, setActiveSection] = useState<"control" | "surge" | "platform">("control")
    const [expandedPlunger, setExpandedPlunger] = useState<number | null>(0)

    const updateData = (newData: EmpM2Payload) => {
        onChange(newData)
    }

    // Build default initialized data
    const defaultData = useMemo<EmpM2Payload>(() => ({
        controlBox: {
            checklist: CONTROL_BOX_ITEMS.map(item => ({
                itemNo: item.no,
                result: "NOT_CHECKED" as CheckResult,
            })),
        },
        surgeProtectionBox: {
            isPresent: false,
            checklist: [],
        },
        platform: {
            devices: Array.from({ length: 8 }, (_, i) => ({
                empNumber: i + 1,
                checklist: PLATFORM_ITEMS.map(item => ({
                    itemNo: item.no,
                    result: "NOT_CHECKED" as CheckResult,
                })),
            })),
        },
    }), [])

    const needsInit = (data.controlBox.checklist?.length ?? 0) === 0

    // Initialize in useEffect to avoid setState during render
    useEffect(() => {
        if (needsInit) {
            onChange(defaultData)
        }
    }, [needsInit, defaultData, onChange])

    const currentData = needsInit ? defaultData : data

    const updateControlBoxItem = (itemNo: number, result: CheckResult) => {
        const updated = {
            ...currentData,
            controlBox: {
                ...currentData.controlBox,
                checklist: currentData.controlBox.checklist.map(item =>
                    item.itemNo === itemNo ? { ...item, result } : item
                ),
            },
        }
        updateData(updated)
    }

    const updateSurgePresent = (isPresent: boolean) => {
        const updated = {
            ...currentData,
            surgeProtectionBox: {
                isPresent,
                checklist: isPresent
                    ? SURGE_BOX_ITEMS.map(item => ({ itemNo: item.no, result: "NOT_CHECKED" as CheckResult }))
                    : [],
            },
        }
        updateData(updated)
    }

    const updateSurgeItem = (itemNo: number, result: CheckResult) => {
        const updated = {
            ...currentData,
            surgeProtectionBox: {
                ...currentData.surgeProtectionBox,
                checklist: (currentData.surgeProtectionBox.checklist || []).map(item =>
                    item.itemNo === itemNo ? { ...item, result } : item
                ),
            },
        }
        updateData(updated)
    }

    const updatePlatformItem = (deviceIdx: number, itemNo: number, result: CheckResult) => {
        const updated = {
            ...currentData,
            platform: {
                ...currentData.platform,
                devices: currentData.platform.devices.map((device, i) =>
                    i === deviceIdx
                        ? {
                            ...device,
                            checklist: device.checklist.map(item =>
                                item.itemNo === itemNo ? { ...item, result } : item
                            ),
                        }
                        : device
                ),
            },
        }
        updateData(updated)
    }

    return (
        <div className="space-y-6">
            {/* Section Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveSection("control")}
                        className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition relative ${activeSection === "control" ? "text-red-600" : "text-gray-500"
                            }`}
                    >
                        🎛️ EMP Control Box
                        {activeSection === "control" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
                    </button>
                    <button
                        onClick={() => setActiveSection("surge")}
                        className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition relative ${activeSection === "surge" ? "text-red-600" : "text-gray-500"
                            }`}
                    >
                        ⚡ Surge Protection
                        {activeSection === "surge" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
                    </button>
                    <button
                        onClick={() => setActiveSection("platform")}
                        className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition relative ${activeSection === "platform" ? "text-red-600" : "text-gray-500"
                            }`}
                    >
                        🛑 Platform EMP 1–8
                        {activeSection === "platform" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
                    </button>
                </div>
            </div>

            {/* Section 1: Control Box */}
            {activeSection === "control" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            🎛️ Section 1: EMP Control Box
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">ตรวจสอบตู้ควบคุม EMP</p>
                    </div>
                    <div className="p-6">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="pb-3 text-xs font-semibold text-gray-500 text-left w-12">ข้อ</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-500 text-left">รายการตรวจสอบ</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-500 text-center w-28">ผลตรวจ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CONTROL_BOX_ITEMS.map(item => {
                                    const checkItem = currentData.controlBox.checklist.find(c => c.itemNo === item.no)
                                    const result = checkItem?.result || "NOT_CHECKED"

                                    return (
                                        <tr key={item.no} className="border-t border-gray-50">
                                            <td className="py-3 text-sm font-mono text-gray-400">{item.no}</td>
                                            <td className="py-3 text-sm text-gray-700">{item.desc}</td>
                                            <td className="py-3 text-center">
                                                {isReadOnly ? (
                                                    <ResultBadge result={result} />
                                                ) : (
                                                    <ResultSelect result={result} onChange={r => updateControlBoxItem(item.no, r)} />
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

            {/* Section 2: Surge Protection Box */}
            {activeSection === "surge" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-100">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            ⚡ Section 2: Surge Protection Box
                        </h3>
                    </div>
                    <div className="p-6">
                        {/* Toggle */}
                        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm font-medium text-gray-700">สถานีนี้มี Surge Protection Box?</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => !isReadOnly && updateSurgePresent(true)}
                                    disabled={isReadOnly}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${currentData.surgeProtectionBox.isPresent
                                            ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200"
                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        } disabled:opacity-60`}
                                >
                                    ✅ มี
                                </button>
                                <button
                                    onClick={() => !isReadOnly && updateSurgePresent(false)}
                                    disabled={isReadOnly}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${!currentData.surgeProtectionBox.isPresent
                                            ? "bg-slate-200 text-slate-700 ring-2 ring-slate-300"
                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        } disabled:opacity-60`}
                                >
                                    ❌ ไม่มี
                                </button>
                            </div>
                        </div>

                        {currentData.surgeProtectionBox.isPresent ? (
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="pb-3 text-xs font-semibold text-gray-500 text-left w-12">ข้อ</th>
                                        <th className="pb-3 text-xs font-semibold text-gray-500 text-left">รายการ</th>
                                        <th className="pb-3 text-xs font-semibold text-gray-500 text-center w-28">ผลตรวจ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {SURGE_BOX_ITEMS.map(item => {
                                        const checkItem = (currentData.surgeProtectionBox.checklist || []).find(c => c.itemNo === item.no)
                                        const result = checkItem?.result || "NOT_CHECKED"

                                        return (
                                            <tr key={item.no} className="border-t border-gray-50">
                                                <td className="py-3 text-sm font-mono text-gray-400">{item.no}</td>
                                                <td className="py-3 text-sm text-gray-700">{item.desc}</td>
                                                <td className="py-3 text-center">
                                                    {isReadOnly ? (
                                                        <ResultBadge result={result} />
                                                    ) : (
                                                        <ResultSelect result={result} onChange={r => updateSurgeItem(item.no, r)} />
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <p className="text-3xl mb-2">❌</p>
                                <p className="text-sm">สถานีนี้ไม่มี Surge Protection Box</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Section 3: Platform EMP 1–8 */}
            {activeSection === "platform" && (
                <div className="space-y-4">
                    {currentData.platform.devices.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border p-12 text-center text-gray-400">
                            <p className="text-4xl mb-2">🛑</p>
                            <p>ยังไม่มีข้อมูล Platform EMP</p>
                        </div>
                    ) : (
                        currentData.platform.devices.map((device, deviceIdx) => {
                            const passCount = device.checklist.filter(c => c.result === "PASS").length
                            const failCount = device.checklist.filter(c => c.result === "FAIL").length
                            const checkedCount = passCount + failCount
                            const totalCount = device.checklist.length

                            return (
                                <div key={deviceIdx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => setExpandedPlunger(expandedPlunger === deviceIdx ? null : deviceIdx)}
                                        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow ${failCount > 0 ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-red-400 to-orange-500"
                                                }`}>
                                                {device.empNumber}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-gray-900">EMP #{device.empNumber}</p>
                                                <p className="text-xs text-gray-500">Platform Plunger</p>
                                            </div>
                                            <div className="ml-4 flex items-center gap-2">
                                                <span className="text-xs text-gray-500 font-medium">{checkedCount}/{totalCount}</span>
                                                <span className="text-xs text-green-600">{passCount}✓</span>
                                                {failCount > 0 && <span className="text-xs text-red-600">{failCount}✗</span>}
                                            </div>
                                        </div>
                                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedPlunger === deviceIdx ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {expandedPlunger === deviceIdx && (
                                        <div className="p-6">
                                            <table className="w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="pb-3 text-xs font-semibold text-gray-500 text-left w-12">ข้อ</th>
                                                        <th className="pb-3 text-xs font-semibold text-gray-500 text-left">รายการ</th>
                                                        <th className="pb-3 text-xs font-semibold text-gray-500 text-center w-28">ผลตรวจ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {PLATFORM_ITEMS.map(item => {
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
                                                                        <ResultSelect result={result} onChange={r => updatePlatformItem(deviceIdx, item.no, r)} />
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )
                        })
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

function ResultSelect({ result, onChange }: { result: CheckResult; onChange: (r: CheckResult) => void }) {
    return (
        <select
            value={result}
            onChange={e => onChange(e.target.value as CheckResult)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border outline-none transition ${result === "PASS" ? "bg-green-50 border-green-200 text-green-700" :
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
    )
}