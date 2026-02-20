"use client"

import { useState } from "react"
import type { MoxaTapM3Payload, MoxaTapDevice, CheckResult, LedColor } from "@/types/checklist-payloads"

const LED_INDICATORS = ["PWR1", "STATUS", "HEAD", "TAIL", "LAN1", "WLAN1"] as const

const LED_OPTIONS: { value: LedColor; label: string; dotColor: string; bgColor: string; ring: string }[] = [
    { value: "GREEN_ON", label: "Green On", dotColor: "bg-green-500", bgColor: "bg-green-50", ring: "ring-green-300" },
    { value: "GREEN_BLINK", label: "Green Blink", dotColor: "bg-green-400", bgColor: "bg-green-50", ring: "ring-green-200" },
    { value: "ORANGE_ON", label: "Orange On", dotColor: "bg-orange-500", bgColor: "bg-orange-50", ring: "ring-orange-300" },
    { value: "ORANGE_BLINK", label: "Orange Blink", dotColor: "bg-orange-400", bgColor: "bg-orange-50", ring: "ring-orange-200" },
    { value: "RED_ON", label: "Red On", dotColor: "bg-red-500", bgColor: "bg-red-50", ring: "ring-red-300" },
    { value: "OFF", label: "Off", dotColor: "bg-gray-400", bgColor: "bg-gray-100", ring: "ring-gray-300" },
]

const CHECKLIST_ITEMS = [
    { no: 1, desc: "ตรวจสอบสภาพภายนอกของตู้ MOXA TAP" },
    { no: 2, desc: "ตรวจสอบ Connector & Cable ภายนอก" },
    { no: 3, desc: "ตรวจสอบ Connector & Cable ภายใน" },
    { no: 4, desc: "ตรวจสอบ LED Status (ดู Tab LED Status)" },
    { no: 5, desc: "ตรวจสอบ Antenna" },
    { no: 6, desc: "ตรวจสอบ Grounding" },
    { no: 7, desc: "ตรวจสอบ Power Supply" },
    { no: 8, desc: "ตรวจสอบ Surge Protection" },
    { no: 9, desc: "ตรวจสอบ Temperature" },
    { no: 10, desc: "ตรวจสอบ Firmware Version" },
    { no: 11, desc: "ตรวจสอบ Configuration" },
    { no: 12, desc: "ตรวจสอบ Network Connection" },
    { no: 13, desc: "ตรวจสอบ Signal Strength" },
    { no: 14, desc: "ตรวจสอบ Link Status" },
    { no: 15, desc: "ตรวจสอบ Error Log" },
    { no: 16, desc: "ทำความสะอาดภายนอก" },
    { no: 17, desc: "ทำความสะอาดภายใน" },
    { no: 18, desc: "ตรวจสอบระบบระบายอากาศ" },
    { no: 19, desc: "สรุปผลการตรวจสอบ" },
]

export default function MoxaM3Form({
    checklistData,
    onChange,
    isReadOnly,
}: {
    checklistData: unknown
    onChange: (data: unknown) => void
    isReadOnly: boolean
}) {
    const data: MoxaTapM3Payload = {
        ...((checklistData as MoxaTapM3Payload) || {}),
        devices: (checklistData as MoxaTapM3Payload)?.devices ?? [],
    }
    const [activeSection, setActiveSection] = useState<"devices" | "led">("devices")
    const [expandedDevice, setExpandedDevice] = useState<number | null>(0)
    const [showAddDevice, setShowAddDevice] = useState(false)
    const [newTapCode, setNewTapCode] = useState("")
    const [newStationCode, setNewStationCode] = useState("")

    const updateDevices = (devices: MoxaTapDevice[]) => {
        onChange({ ...data, devices })
    }

    const addDevice = () => {
        if (!newTapCode || !newStationCode) return
        const newDevice: MoxaTapDevice = {
            tapCode: newTapCode,
            stationCode: newStationCode,
            columnOrder: data.devices.length + 1,
            checklist: CHECKLIST_ITEMS.filter(i => i.no !== 4).map(item => ({
                itemNo: item.no,
                result: "NOT_CHECKED" as CheckResult,
            })),
            ledStatus: {
                PWR1: "GREEN_ON",
                STATUS: "GREEN_ON",
                HEAD: "GREEN_ON",
                TAIL: "GREEN_ON",
                LAN1: "GREEN_ON",
                WLAN1: "GREEN_ON",
            },
        }
        updateDevices([...data.devices, newDevice])
        setNewTapCode("")
        setNewStationCode("")
        setShowAddDevice(false)
        setExpandedDevice(data.devices.length)
    }

    const removeDevice = (index: number) => {
        if (!confirm(`ลบ ${data.devices[index].tapCode}?`)) return
        const updated = data.devices.filter((_, i) => i !== index)
        updateDevices(updated)
        if (expandedDevice === index) setExpandedDevice(null)
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

    const updateLedStatus = (deviceIdx: number, indicator: string, value: LedColor) => {
        const devices = [...data.devices]
        const device = { ...devices[deviceIdx] }
        device.ledStatus = { ...device.ledStatus, [indicator]: value }
        devices[deviceIdx] = device
        updateDevices(devices)
    }

    return (
        <div className="space-y-6">
            {/* Section Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveSection("devices")}
                        className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition relative ${activeSection === "devices" ? "text-cyan-600" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        📡 รายการ MOXA TAP ({data.devices.length})
                        {activeSection === "devices" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveSection("led")}
                        className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition relative ${activeSection === "led" ? "text-cyan-600" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        💡 LED Status Grid
                        {activeSection === "led" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full" />
                        )}
                    </button>
                </div>
            </div>

            {/* Devices Checklist Section */}
            {activeSection === "devices" && (
                <div className="space-y-4">
                    {/* Add Device Button */}
                    {!isReadOnly && (
                        <div>
                            {!showAddDevice ? (
                                <button
                                    onClick={() => setShowAddDevice(true)}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 bg-cyan-50 px-4 py-2 rounded-xl hover:bg-cyan-100 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    เพิ่ม MOXA TAP
                                </button>
                            ) : (
                                <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                                    <div className="flex items-end gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">TAP Code</label>
                                            <input
                                                value={newTapCode}
                                                onChange={e => setNewTapCode(e.target.value)}
                                                placeholder="เช่น E3TAP1"
                                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Station</label>
                                            <input
                                                value={newStationCode}
                                                onChange={e => setNewStationCode(e.target.value)}
                                                placeholder="เช่น E3"
                                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                            />
                                        </div>
                                        <button
                                            onClick={addDevice}
                                            className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition"
                                        >
                                            เพิ่ม
                                        </button>
                                        <button
                                            onClick={() => setShowAddDevice(false)}
                                            className="px-4 py-2 text-gray-500 rounded-lg text-sm hover:bg-gray-100 transition"
                                        >
                                            ยกเลิก
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Device Cards (Accordion) */}
                    {data.devices.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="text-4xl mb-3">📡</div>
                            <p className="text-gray-500">ยังไม่มี MOXA TAP</p>
                            <p className="text-sm text-gray-400">กดปุ่ม &quot;เพิ่ม MOXA TAP&quot; เพื่อเริ่มกรอกข้อมูล</p>
                        </div>
                    ) : (
                        data.devices.map((device, deviceIdx) => (
                            <div key={deviceIdx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Accordion Header */}
                                <button
                                    onClick={() => setExpandedDevice(expandedDevice === deviceIdx ? null : deviceIdx)}
                                    className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow">
                                            {deviceIdx + 1}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-900">{device.tapCode}</p>
                                            <p className="text-xs text-gray-500">Station: {device.stationCode}</p>
                                        </div>
                                        {/* Progress indicator */}
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
                                            <span
                                                onClick={(e) => { e.stopPropagation(); removeDevice(deviceIdx) }}
                                                className="text-red-400 hover:text-red-600 text-sm px-2 cursor-pointer"
                                            >
                                                🗑️
                                            </span>
                                        )}
                                        <svg
                                            className={`w-5 h-5 text-gray-400 transition-transform ${expandedDevice === deviceIdx ? "rotate-180" : ""}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Accordion Content */}
                                {expandedDevice === deviceIdx && (
                                    <div className="p-6">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left">
                                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase w-12">ข้อ</th>
                                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase">รายการตรวจสอบ</th>
                                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase text-center w-28">ผลการตรวจ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {CHECKLIST_ITEMS.map((item) => {
                                                    if (item.no === 4) {
                                                        return (
                                                            <tr key={item.no} className="border-t border-gray-50">
                                                                <td className="py-3 text-sm font-mono text-gray-400">{item.no}</td>
                                                                <td className="py-3 text-sm text-gray-700">{item.desc}</td>
                                                                <td className="py-3 text-center">
                                                                    <button
                                                                        onClick={() => setActiveSection("led")}
                                                                        className="text-xs text-cyan-600 bg-cyan-50 px-3 py-1 rounded-lg hover:bg-cyan-100 transition"
                                                                    >
                                                                        → ดู LED Grid
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }

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
                        ))
                    )}
                </div>
            )}

            {/* LED Status Grid Section */}
            {activeSection === "led" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            💡 LED Status — ข้อ 4
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">เลือกสถานะ LED ของแต่ละ MOXA TAP</p>
                    </div>

                    {data.devices.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <p>กรุณาเพิ่ม MOXA TAP ก่อน</p>
                        </div>
                    ) : (
                        <div className="p-6 overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr>
                                        <th className="text-left pb-4 text-xs font-semibold text-gray-500 uppercase sticky left-0 bg-white">
                                            LED
                                        </th>
                                        {data.devices.map((device, i) => (
                                            <th key={i} className="text-center pb-4 text-xs font-semibold text-gray-700 px-3">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-base">📡</span>
                                                    <span>{device.tapCode}</span>
                                                    <span className="text-[10px] text-gray-400">{device.stationCode}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {LED_INDICATORS.map((indicator) => (
                                        <tr key={indicator} className="border-t border-gray-100">
                                            <td className="py-4 pr-4 sticky left-0 bg-white">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                        {indicator.charAt(0)}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-700">{indicator}</span>
                                                </div>
                                            </td>
                                            {data.devices.map((device, deviceIdx) => {
                                                const currentValue = device.ledStatus?.[indicator as keyof typeof device.ledStatus] || "OFF"
                                                const currentOption = LED_OPTIONS.find(o => o.value === currentValue)

                                                return (
                                                    <td key={deviceIdx} className="py-4 px-3 text-center">
                                                        {isReadOnly ? (
                                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${currentOption?.bgColor}`}>
                                                                <div className={`w-3 h-3 rounded-full ${currentOption?.dotColor} ${currentValue.includes("BLINK") ? "animate-pulse" : ""}`} />
                                                                <span className="text-xs font-medium text-gray-700">{currentOption?.label}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex flex-wrap gap-1 justify-center">
                                                                {LED_OPTIONS.map(option => (
                                                                    <button
                                                                        key={option.value}
                                                                        onClick={() => updateLedStatus(deviceIdx, indicator, option.value)}
                                                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${currentValue === option.value
                                                                                ? `${option.bgColor} ring-2 ${option.ring} shadow-sm`
                                                                                : "bg-gray-50 hover:bg-gray-100 text-gray-500"
                                                                            }`}
                                                                        title={option.label}
                                                                    >
                                                                        <div className={`w-2.5 h-2.5 rounded-full ${option.dotColor} ${option.value.includes("BLINK") ? "animate-pulse" : ""}`} />
                                                                        <span className="hidden xl:inline">{option.label.split(" ")[0]}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* LED Legend */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 mb-2">LED Color Legend:</p>
                                <div className="flex flex-wrap gap-3">
                                    {LED_OPTIONS.map(option => (
                                        <div key={option.value} className="flex items-center gap-1.5">
                                            <div className={`w-3 h-3 rounded-full ${option.dotColor} ${option.value.includes("BLINK") ? "animate-pulse" : ""}`} />
                                            <span className="text-xs text-gray-600">{option.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
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