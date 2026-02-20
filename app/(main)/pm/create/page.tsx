import { getJobTemplates } from "@/app/actions/pmActions"
import CreatePmForm from "./CreatePmForm"

export default async function CreatePmPage() {
    const templates = await getJobTemplates()

    return (
        <div className="max-w-5xl mx-auto p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">📋 สร้างใบงาน PM ใหม่</h1>
                <p className="text-gray-500 mt-1">เลือกประเภทงานและกรอกข้อมูล Header</p>
            </div>

            <CreatePmForm templates={templates} />
        </div>
    )
}