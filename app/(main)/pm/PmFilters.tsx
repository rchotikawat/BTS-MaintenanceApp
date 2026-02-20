"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export default function PmFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentStatus = searchParams.get("status") || "ALL"
    const currentTemplate = searchParams.get("template") || "ALL"
    const currentSearch = searchParams.get("search") || ""

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value === "ALL" || value === "") {
                params.delete(name)
            } else {
                params.set(name, value)
            }
            return params.toString()
        },
        [searchParams]
    )

    const handleFilter = (name: string, value: string) => {
        const qs = createQueryString(name, value)
        router.push(`/pm${qs ? `?${qs}` : ""}`)
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">ค้นหา</label>
                    <input
                        type="text"
                        placeholder="🔍 Work Order, สถานี, หัวหน้าทีม..."
                        defaultValue={currentSearch}
                        onChange={(e) => {
                            clearTimeout((window as unknown as Record<string, ReturnType<typeof setTimeout>>).__pmSearchTimer)
                                ; (window as unknown as Record<string, ReturnType<typeof setTimeout>>).__pmSearchTimer = setTimeout(() => {
                                    handleFilter("search", e.target.value)
                                }, 500)
                        }}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition"
                    />
                </div>

                {/* Status Filter */}
                <div className="sm:w-44">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">สถานะ</label>
                    <select
                        value={currentStatus}
                        onChange={(e) => handleFilter("status", e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition appearance-none"
                    >
                        <option value="ALL">ทั้งหมด</option>
                        <option value="DRAFT">📝 ร่าง</option>
                        <option value="SUBMITTED">📤 ส่งแล้ว</option>
                        <option value="APPROVED">✅ อนุมัติ</option>
                        <option value="REJECTED">🔄 ส่งกลับ</option>
                    </select>
                </div>

                {/* Template Filter */}
                <div className="sm:w-56">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">ประเภทงาน</label>
                    <select
                        value={currentTemplate}
                        onChange={(e) => handleFilter("template", e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition appearance-none"
                    >
                        <option value="ALL">ทุกประเภท</option>
                        <option value="PM_Y1_POINT_MACHINE">🔀 PM (Y1) Point Machine</option>
                        <option value="PM_M3_MOXA_TAP">📡 PM (M3) MOXA TAP</option>
                        <option value="PM_M2_EMP">🛑 PM (M2) EMP</option>
                    </select>
                </div>
            </div>
        </div>
    )
}