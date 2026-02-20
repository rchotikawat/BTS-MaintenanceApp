import { getPmReportById } from "@/app/actions/pmActions"
import { notFound } from "next/navigation"
import PmReportDetail from "./PmReportDetail"

export default async function PmDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const report = await getPmReportById(id)

    if (!report) {
        notFound()
    }

    return <PmReportDetail report={report} />
}