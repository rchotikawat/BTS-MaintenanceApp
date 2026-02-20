"use client"

import dynamic from "next/dynamic"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReportData = any

const PmPdfDownloadInner = dynamic(
    () =>
        import("@react-pdf/renderer").then((pdfMod) =>
            import("@/app/components/PmReportPDF").then((pmMod) => {
                const { PDFDownloadLink } = pdfMod
                const { PmReportPDF } = pmMod

                function PmPdfDownload({ report }: { report: ReportData }) {
                    const fileName = `PM-${report.workOrderNo || report.id}.pdf`

                    return (
                        <PDFDownloadLink
                            document={<PmReportPDF report={report} />}
                            fileName={fileName}
                        >
                            {({ loading }) => (
                                <button
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-medium text-sm shadow-lg shadow-purple-600/25 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            กำลังสร้าง PDF...
                                        </>
                                    ) : (
                                        <>
                                            📄 ดาวน์โหลด PDF
                                        </>
                                    )}
                                </button>
                            )}
                        </PDFDownloadLink>
                    )
                }

                return PmPdfDownload
            })
        ),
    {
        ssr: false,
        loading: () => (
            <button
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-300 text-white rounded-xl font-medium text-sm"
                disabled
            >
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                กำลังโหลด...
            </button>
        ),
    }
)

export default function PmPdfDownloadButton({ report }: { report: ReportData }) {
    return <PmPdfDownloadInner report={report} />
}