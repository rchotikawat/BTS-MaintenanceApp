import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { getJobStats, getMaintenanceJobs } from "@/app/actions/maintenanceActions"
import { getPmStats, getPmReports } from "@/app/actions/pmActions"
import Link from "next/link"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    // ── ดึงข้อมูลทั้ง CM และ PM พร้อมกัน ─────────────────
    const [cmStats, cmJobs, pmStats, pmReports] = await Promise.all([
        getJobStats(),
        getMaintenanceJobs(),
        getPmStats(),
        getPmReports(),
    ])

    // CM Analysis
    const criticalCount = cmJobs.filter((j) => j.priority === "CRITICAL").length
    const highCount = cmJobs.filter((j) => j.priority === "HIGH").length
    const latestCmJobs = cmJobs.slice(0, 5)
    const cmCompletionRate = cmStats.total > 0 ? Math.round((cmStats.completed / cmStats.total) * 100) : 0

    // PM Analysis
    const latestPmReports = pmReports.slice(0, 5)
    const pmHasIssues = pmReports.filter((r) => r.hasIssues).length
    const pmSubmittedRate = pmStats.total > 0 ? Math.round((pmStats.submitted / pmStats.total) * 100) : 0

    return (
        <div className="max-w-7xl mx-auto min-h-screen bg-gray-50 p-4 lg:p-8">
            {/* ── Welcome Header ──────────────────────────────── */}
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    สวัสดี, {session?.user?.name || "ผู้ใช้งาน"} 👋
                </h1>
                <p className="text-gray-500 mt-1">
                    ยินดีต้อนรับสู่ระบบ BTS Smart Maintenance — ภาพรวมงานซ่อมและงานตรวจเช็กวันนี้
                </p>
            </div>

            {/* ── Overview Stats (CM + PM) ────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {/* CM Stats */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-[2.5rem] -mr-1 -mt-1" />
                    <p className="text-xs font-medium text-gray-400 relative z-10">🔧 งานซ่อม (CM)</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1 relative z-10">{cmStats.total}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 relative z-10">รายการทั้งหมด</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 shadow-sm border border-amber-100">
                    <p className="text-xs font-medium text-amber-600">⏳ รอตรวจสอบ</p>
                    <p className="text-2xl font-bold text-amber-700 mt-1">{cmStats.pending}</p>
                    <p className="text-[10px] text-amber-500 mt-0.5">CM Pending</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 shadow-sm border border-green-100">
                    <p className="text-xs font-medium text-green-600">✅ ซ่อมเสร็จ</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">{cmStats.completed}</p>
                    <p className="text-[10px] text-green-500 mt-0.5">CM Completed</p>
                </div>

                {/* PM Stats */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-[2.5rem] -mr-1 -mt-1" />
                    <p className="text-xs font-medium text-gray-400 relative z-10">📋 งาน PM</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1 relative z-10">{pmStats.total}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 relative z-10">รายการทั้งหมด</p>
                </div>

                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-4 shadow-sm border border-sky-100">
                    <p className="text-xs font-medium text-sky-600">📝 ร่าง (Draft)</p>
                    <p className="text-2xl font-bold text-sky-700 mt-1">{pmStats.draft}</p>
                    <p className="text-[10px] text-sky-500 mt-0.5">PM Draft</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 shadow-sm border border-emerald-100">
                    <p className="text-xs font-medium text-emerald-600">📤 ส่งแล้ว</p>
                    <p className="text-2xl font-bold text-emerald-700 mt-1">{pmStats.submitted}</p>
                    <p className="text-[10px] text-emerald-500 mt-0.5">PM Submitted</p>
                </div>
            </div>

            {/* ── Two Module Tables ───────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* CM Recent Jobs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-transparent">
                        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-sm">🔧</span>
                            งานซ่อม (CM) ล่าสุด
                        </h2>
                        <Link href="/jobs" className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline">
                            ดูทั้งหมด →
                        </Link>
                    </div>

                    {latestCmJobs.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <div className="text-3xl mb-2">🔧</div>
                            <p className="text-sm">ยังไม่มีรายการแจ้งซ่อม</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {latestCmJobs.map((job) => {
                                const statusConfig: Record<string, { color: string; label: string }> = {
                                    PENDING: { color: "bg-amber-100 text-amber-700", label: "รอตรวจสอบ" },
                                    IN_PROGRESS: { color: "bg-blue-100 text-blue-700", label: "กำลังซ่อม" },
                                    COMPLETED: { color: "bg-green-100 text-green-700", label: "เสร็จแล้ว" },
                                    CANCELLED: { color: "bg-red-100 text-red-500", label: "ยกเลิก" },
                                }
                                const priorityIcons: Record<string, string> = {
                                    CRITICAL: "🔴", HIGH: "🟠", MEDIUM: "🟡", LOW: "🟢",
                                }
                                const cfg = statusConfig[job.status] || { color: "bg-gray-100 text-gray-600", label: job.status }

                                return (
                                    <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/80 transition">
                                        <div className="text-base flex-shrink-0">{priorityIcons[job.priority] || "⚪"}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[11px] text-blue-600 font-semibold">{job.jobNo}</span>
                                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${cfg.color}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 mt-0.5 truncate">{job.subject}</p>
                                            <p className="text-[11px] text-gray-400 truncate">{job.location}</p>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* PM Recent Reports */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-transparent">
                        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center text-sm">📋</span>
                            งานตรวจเช็ก (PM) ล่าสุด
                        </h2>
                        <Link href="/pm" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
                            ดูทั้งหมด →
                        </Link>
                    </div>

                    {latestPmReports.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <div className="text-3xl mb-2">📋</div>
                            <p className="text-sm">ยังไม่มีรายการ PM</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {latestPmReports.map((report) => {
                                const pmStatusConfig: Record<string, { color: string; label: string; icon: string }> = {
                                    DRAFT: { color: "bg-gray-100 text-gray-600", label: "ร่าง", icon: "📝" },
                                    SUBMITTED: { color: "bg-orange-100 text-orange-700", label: "ส่งแล้ว", icon: "📤" },
                                    APPROVED: { color: "bg-green-100 text-green-700", label: "อนุมัติ", icon: "✅" },
                                }
                                const cfg = pmStatusConfig[report.status] || { color: "bg-gray-100 text-gray-600", label: report.status, icon: "📄" }

                                const eqType: Record<string, string> = {
                                    POINT_MACHINE: "🔩",
                                    MOXA_TAP: "📡",
                                    EMP: "🔴",
                                }

                                return (
                                    <Link key={report.id} href={`/pm/${report.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/80 transition">
                                        <div className="text-base flex-shrink-0">
                                            {eqType[report.jobTemplate.equipmentType] || "📋"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[11px] text-indigo-600 font-semibold">{report.workOrderNo}</span>
                                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${cfg.color}`}>
                                                    {cfg.icon} {cfg.label}
                                                </span>
                                                {report.hasIssues && (
                                                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-red-100 text-red-600">⚠️ มีปัญหา</span>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 mt-0.5 truncate">{report.jobTemplate.name}</p>
                                            <p className="text-[11px] text-gray-400 truncate">
                                                สถานี {report.stationName} • {report.leaderName}
                                            </p>
                                        </div>
                                        <div className="text-[11px] text-gray-400 flex-shrink-0 hidden sm:block">
                                            {new Date(report.reportDate).toLocaleDateString("th-TH", {
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </div>
                                        <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Bottom: Charts + Alerts + Quick Actions ─────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CM Completion Rate Ring */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center text-xs">🔧</span>
                        อัตราซ่อมเสร็จ (CM)
                    </h3>
                    <div className="flex items-center justify-center">
                        <div className="relative w-28 h-28">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                                <circle
                                    cx="60" cy="60" r="52" fill="none"
                                    stroke={cmCompletionRate >= 70 ? "#10b981" : cmCompletionRate >= 40 ? "#f59e0b" : "#ef4444"}
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(cmCompletionRate / 100) * 327} 327`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-gray-900">{cmCompletionRate}%</span>
                                <span className="text-[10px] text-gray-400">สำเร็จ</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div>
                            <p className="font-bold text-amber-600">{cmStats.pending}</p>
                            <p className="text-gray-400">Pending</p>
                        </div>
                        <div>
                            <p className="font-bold text-blue-600">{cmStats.inProgress}</p>
                            <p className="text-gray-400">In Progress</p>
                        </div>
                        <div>
                            <p className="font-bold text-green-600">{cmStats.completed}</p>
                            <p className="text-gray-400">Completed</p>
                        </div>
                    </div>
                </div>

                {/* PM Status Breakdown */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-xs">📋</span>
                        สถานะงาน PM
                    </h3>
                    <div className="flex items-center justify-center">
                        <div className="relative w-28 h-28">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                                <circle
                                    cx="60" cy="60" r="52" fill="none"
                                    stroke="#6366f1"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(pmSubmittedRate / 100) * 327} 327`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-gray-900">{pmSubmittedRate}%</span>
                                <span className="text-[10px] text-gray-400">ส่งแล้ว</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div>
                            <p className="font-bold text-gray-600">{pmStats.draft}</p>
                            <p className="text-gray-400">Draft</p>
                        </div>
                        <div>
                            <p className="font-bold text-orange-600">{pmStats.submitted}</p>
                            <p className="text-gray-400">Submitted</p>
                        </div>
                        <div>
                            <p className="font-bold text-green-600">{pmStats.approved}</p>
                            <p className="text-gray-400">Approved</p>
                        </div>
                    </div>
                </div>

                {/* Alerts + Quick Actions */}
                <div className="space-y-6">
                    {/* Urgent Alerts */}
                    {(criticalCount > 0 || highCount > 0 || pmHasIssues > 0) && (
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-sm border border-red-100 p-5">
                            <h3 className="text-sm font-semibold text-red-700 mb-3">⚠️ แจ้งเตือน</h3>
                            <div className="space-y-2">
                                {criticalCount > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-red-600">🔴 CM วิกฤต</span>
                                        <span className="text-sm font-bold text-red-700">{criticalCount}</span>
                                    </div>
                                )}
                                {highCount > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-orange-600">🟠 CM เร่งด่วน</span>
                                        <span className="text-sm font-bold text-orange-700">{highCount}</span>
                                    </div>
                                )}
                                {pmHasIssues > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-red-600">📋 PM มีปัญหา</span>
                                        <span className="text-sm font-bold text-red-700">{pmHasIssues}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3">⚡ ทางลัด</h3>
                        <div className="space-y-2">
                            <Link
                                href="/jobs/create"
                                className="flex items-center gap-3 px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl transition text-sm font-medium text-blue-700"
                            >
                                <span className="text-base">📝</span>
                                แจ้งซ่อมใหม่ (CM)
                            </Link>
                            <Link
                                href="/pm/create"
                                className="flex items-center gap-3 px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition text-sm font-medium text-indigo-700"
                            >
                                <span className="text-base">📋</span>
                                สร้างใบงาน PM
                            </Link>
                            <Link
                                href="/jobs?status=PENDING"
                                className="flex items-center gap-3 px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 rounded-xl transition text-sm font-medium text-amber-700"
                            >
                                <span className="text-base">⏳</span>
                                งาน CM รอตรวจสอบ
                            </Link>
                            <Link
                                href="/pm?status=DRAFT"
                                className="flex items-center gap-3 px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition text-sm font-medium text-gray-600"
                            >
                                <span className="text-base">📄</span>
                                งาน PM ร่าง (Draft)
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}