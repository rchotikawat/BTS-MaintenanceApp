import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import Link from "next/link"
import UserMenu from "@/app/components/UserMenu"
import { redirect } from "next/navigation"

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as { role?: string })?.role

    // ถ้าไม่ได้ Login → Redirect ไปหน้า Login
    if (!session) {
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Top Navbar */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left: Logo + Nav */}
                        <div className="flex items-center gap-8">
                            {/* Logo */}
                            <Link href="/dashboard" className="flex items-center gap-2.5 group">
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold text-gray-900 hidden sm:block">
                                    BTS Smart<span className="text-blue-600"> Maintenance</span>
                                </span>
                            </Link>

                            {/* Navigation */}
                            <nav className="flex items-center gap-1">
                                <NavLink href="/dashboard" icon="📊">Dashboard</NavLink>
                                <NavLink href="/jobs" icon="🔧">งานซ่อม (CM)</NavLink>
                                <NavLink href="/pm" icon="📋">งานตรวจเช็ค (PM)</NavLink>
                                {userRole === "admin" && (
                                    <NavLink href="/admin/users" icon="👥">จัดการผู้ใช้</NavLink>
                                )}
                            </nav>
                        </div>

                        {/* Right: User Menu */}
                        <UserMenu />
                    </div>
                </div>
            </header>

            {/* Main Content (with top padding for fixed header) */}
            <main className="pt-16">{children}</main>
        </div>
    )
}

// Nav Link Component
function NavLink({
    href,
    icon,
    children,
}: {
    href: string
    icon: string
    children: React.ReactNode
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
        >
            <span className="text-base">{icon}</span>
            <span className="hidden sm:inline">{children}</span>
        </Link>
    )
}