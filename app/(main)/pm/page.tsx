import { getPmReports, getPmStats } from "@/app/actions/pmActions"
import Link from "next/link"
import PmFilters from "./PmFilters"

// Badge สี ตาม ReportStatus
function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
        SUBMITTED: "bg-amber-100 text-amber-700 border-amber-200",
        APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
        REJECTED: "bg-red-100 text-red-700 border-red-200",
    }
    const labels: Record<string, string> = {
        DRAFT: "📝 ร่าง",
        SUBMITTED: "📤 ส่งแล้ว",
        APPROVED: "✅ อนุมัติ",
        REJECTED: "🔄 ส่งกลับ",
    }
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[status] || "bg-gray-100 text-gray-600"}`}>
            {labels[status] || status}
        </span>
    )
}

// Equipment Type Icon
function EquipmentIcon({ type }: { type: string }) {
    const icons: Record<string, string> = {
        POINT_MACHINE: "🔀",
        MOXA_TAP: "📡",
        EMP: "🛑",
    }
    return <span className="text-lg">{icons[type] || "⚙️"}</span>
}

export default async function PmListPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; template?: string; search?: string }>
}) {
    const params = await searchParams
    const [reports, stats] = await Promise.all([
        getPmReports({
            status: params.status,
            templateCode: params.template,
            search: params.search,
        }),
        getPmStats(),
    ])

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">📋 ระบบตรวจเช็กบำรุงรักษา (PM)</h1>
                    <p className="text-gray-500 mt-1">Preventive Maintenance Checklist System</p>
                </div>
                <Link
                    href="/pm/create"
                    className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all font-medium shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    สร้างใบงาน PM
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white text-lg">📋</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">ทั้งหมด</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center">
                            <span className="text-white text-lg">📝</span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">ร่าง (Draft)</p>
                            <p className="text-2xl font-bold text-slate-700">{stats.draft}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                            <span className="text-white text-lg">📤</span>
                        </div>
                        <div>
                            <p className="text-sm text-amber-600">ส่งแล้ว</p>
                            <p className="text-2xl font-bold text-amber-600">{stats.submitted}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
                            <span className="text-white text-lg">✅</span>
                        </div>
                        <div>
                            <p className="text-sm text-emerald-600">อนุมัติ</p>
                            <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <PmFilters />

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Work Order</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ประเภทงาน</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden md:table-cell">สถานี</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">หัวหน้าทีม</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">วันที่</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">สถานะ</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-20 text-gray-400">
                                        <div className="text-5xl mb-3">📋</div>
                                        <p className="text-lg font-medium">ยังไม่มีใบงาน PM</p>
                                        <p className="text-sm mt-1">กดปุ่ม &quot;สร้างใบงาน PM&quot; เพื่อเริ่มต้น</p>
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-semibold text-blue-600">{report.workOrderNo}</span>
                                            {report.workOrderNo2 && (
                                                <span className="block font-mono text-xs text-gray-400">{report.workOrderNo2}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <EquipmentIcon type={report.jobTemplate.equipmentType} />
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{report.jobTemplate.name}</p>
                                                    <p className="text-xs text-gray-400">{report.jobTemplate.code}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm text-gray-600">{report.stationName}</span>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className="text-sm text-gray-600">{report.leaderName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500">
                                                {new Date(report.reportDate).toLocaleDateString("th-TH", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={report.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/pm/${report.id}`}
                                                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline group-hover:gap-2.5 transition-all"
                                            >
                                                ดูรายละเอียด
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}