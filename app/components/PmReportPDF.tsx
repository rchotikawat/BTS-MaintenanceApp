import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image,
    Svg,
    Path,
} from "@react-pdf/renderer"

// ── SVG check / X marks (font-independent) ─────
function CheckSvg({ size = 10, color = "#374151" }: { size?: number; color?: string }) {
    return (
        <Svg viewBox="0 0 24 24" width={size} height={size}>
            <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth={3} fill="none" />
        </Svg>
    )
}

function XSvg({ size = 9, color = "#dc2626" }: { size?: number; color?: string }) {
    return (
        <Svg viewBox="0 0 24 24" width={size} height={size}>
            <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={3} fill="none" />
        </Svg>
    )
}

// ============================================
// ลงทะเบียนฟอนต์ภาษาไทย (Sarabun)
// ============================================
Font.register({
    family: "Sarabun",
    fonts: [
        { src: "/fonts/Sarabun-Regular.ttf", fontWeight: "normal" },
        { src: "/fonts/Sarabun-Bold.ttf", fontWeight: "bold" },
    ],
})

// ============================================
// Styles
// ============================================
const s = StyleSheet.create({
    page: {
        padding: 35,
        fontSize: 9,
        lineHeight: 1.5,
        fontFamily: "Sarabun",
    },
    // ── Header ──────────────────────────────
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: "#1e40af",
        paddingBottom: 12,
    },
    headerTitle: { fontSize: 16, fontWeight: "bold", color: "#1e40af" },
    headerSub: { fontSize: 9, color: "#6b7280", marginTop: 2 },
    headerRight: { textAlign: "right" },
    woLabel: { fontSize: 8, color: "#6b7280" },
    woValue: { fontSize: 12, fontWeight: "bold", color: "#1e40af" },
    // ── Status ──────────────────────────────
    statusRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        fontSize: 8,
        fontWeight: "bold",
    },
    // ── Section ─────────────────────────────
    sectionTitle: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 8,
        backgroundColor: "#f3f4f6",
        padding: 6,
        borderRadius: 3,
        marginTop: 8,
    },
    // ── Info Rows ────────────────────────────
    infoRow: { flexDirection: "row", marginBottom: 5 },
    infoLabel: { width: 110, fontWeight: "bold", color: "#374151", fontSize: 9 },
    infoValue: { flex: 1, color: "#1f2937", fontSize: 9 },
    infoGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
    infoCol: { width: "50%", flexDirection: "row", marginBottom: 5 },
    // ── Table ───────────────────────────────
    table: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 3, marginBottom: 10 },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f9fafb",
        borderBottomWidth: 1,
        borderBottomColor: "#d1d5db",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: "#e5e7eb",
    },
    tableRowAlt: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: "#e5e7eb",
        backgroundColor: "#fafafa",
    },
    thNo: { width: 30, padding: 4, fontWeight: "bold", fontSize: 8, color: "#6b7280", textAlign: "center" },
    thDesc: { flex: 1, padding: 4, fontWeight: "bold", fontSize: 8, color: "#6b7280" },
    thResult: { width: 60, padding: 4, fontWeight: "bold", fontSize: 8, color: "#6b7280", textAlign: "center" },
    tdNo: { width: 30, padding: 4, fontSize: 8, textAlign: "center", color: "#9ca3af" },
    tdDesc: { flex: 1, padding: 4, fontSize: 8, color: "#374151" },
    tdResult: { width: 60, padding: 4, fontSize: 8, textAlign: "center" },
    tdPass: { color: "#047857" },
    tdFail: { color: "#dc2626" },
    tdNA: { color: "#9ca3af" },
    tdNotChecked: { color: "#d97706" },
    // ── Measurement ─────────────────────────
    measureGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
    measureBox: {
        width: "23%",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 3,
        padding: 4,
    },
    measureLabel: { fontSize: 7, color: "#6b7280", marginBottom: 2 },
    measureValue: { fontSize: 9, fontWeight: "bold", color: "#1f2937", textAlign: "center" },
    // ── LED Grid ─────────────────────────────
    ledGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 8 },
    ledBox: {
        width: "18%",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 3,
        padding: 4,
    },
    ledLabel: { fontSize: 7, fontWeight: "bold", color: "#374151", marginBottom: 2 },
    ledValue: { fontSize: 7, color: "#6b7280" },
    // ── Signature ────────────────────────────
    signatureSection: {
        marginTop: 40,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    signatureBox: { width: 180, alignItems: "center" },
    signatureLabel: { fontSize: 9, color: "#6b7280", marginBottom: 35 },
    signatureLine: { borderBottomWidth: 1, borderBottomColor: "#000", width: "100%", marginBottom: 4 },
    signatureName: { fontSize: 8, color: "#374151", textAlign: "center" },
    // ── Footer ───────────────────────────────
    footer: {
        position: "absolute",
        bottom: 25,
        left: 35,
        right: 35,
        textAlign: "center",
        fontSize: 7,
        color: "#9ca3af",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        paddingTop: 8,
    },
    // ── Device Sub-header ────────────────────
    deviceHeader: {
        backgroundColor: "#eef2ff",
        padding: 6,
        borderRadius: 3,
        marginTop: 6,
        marginBottom: 4,
    },
    deviceTitle: { fontSize: 10, fontWeight: "bold", color: "#4338ca" },
    deviceSub: { fontSize: 7, color: "#6366f1", marginTop: 1 },
})

// ============================================
// Helpers
// ============================================
function getStatusStyle(status: string) {
    const map: Record<string, { bg: string; text: string; label: string }> = {
        DRAFT: { bg: "#f1f5f9", text: "#475569", label: "Draft (ร่าง)" },
        SUBMITTED: { bg: "#fef3c7", text: "#92400e", label: "Submitted (ส่งแล้ว)" },
        APPROVED: { bg: "#d1fae5", text: "#065f46", label: "Approved (อนุมัติ)" },
        REJECTED: { bg: "#fee2e2", text: "#991b1b", label: "Rejected (ส่งกลับ)" },
    }
    return map[status] || { bg: "#f3f4f6", text: "#374151", label: status }
}

function resultText(result: string) {
    const map: Record<string, { text: string; style: object }> = {
        PASS: { text: "PASS", style: s.tdPass },
        FAIL: { text: "FAIL", style: s.tdFail },
        NA: { text: "N/A", style: s.tdNA },
        NOT_CHECKED: { text: "-", style: s.tdNotChecked },
    }
    return map[result] || { text: result, style: s.tdNA }
}

function fmtDate(d: string | Date) {
    return new Date(d).toLocaleDateString("th-TH", {
        day: "numeric", month: "long", year: "numeric",
    })
}

// ============================================
// Checklist Items (same as form components)
// ============================================

// Point Machine — Official BTS Form Descriptions
// Page 1 items (1–14)
const PM_PAGE1_ITEMS: { no: number; desc: string; subRows?: string[] }[] = [
    { no: 1, desc: "ตรวจสอบตำแหน่งที่ทางของ Point Machine ก่อนเริ่มงาน" },
    { no: 2, desc: "Switch บวก และลบ กับ CCR เพื่อตรวจสอบสถานะ Point Machine" },
    {
        no: 3, desc: "Switch บวก และลบ กับ CCR Test 3 mm. ด้วย Steel Template",
        subRows: [
            "(สถานะปกติต้อง End Position ทั้งด้านบวกและ ด้านลบ)",
            "Power Rod: มีการปรับตั้งด้านบวก ระยะ (mm.)",
            "              มีการปรับตั้งด้านลบ ระยะ (mm.)",
        ],
    },
    {
        no: 4, desc: "Switch บวก และลบ กับ CCR Test 5 mm. ด้วย Steel Template",
        subRows: [
            "(สถานะปกติต้องไม่ End Position ทั้งด้านบวกและ ด้านลบ)",
            "Power Rod: มีการปรับตั้งด้านบวก ระยะ (mm.)",
            "              มีการปรับตั้งด้านลบ ระยะ (mm.)",
        ],
    },
    {
        no: 5, desc: "ทดสอบแรง กด (Force) ของ Point Machine โดยใช้เครื่อง Force Gauge",
        subRows: ["(บันทึกค่าในตารางด้านล่าง)"],
    },
    { no: 6, desc: "แจ้ง CCR ขอ Off Point Machine และยืนยันสถานะอีกครั้ง" },
    {
        no: 7, desc: "ตรวจสอบระยะ Center ที่ Detector Rod (2 mm. – 3 mm.)",
        subRows: [
            "Detector Rod: มีการปรับเข้า ด้านบวก ระยะ (mm.)",
            "                  มีการปรับเข้า ด้านลบ ระยะ (mm.)",
            "                  มีการปรับออก ด้านบวก ระยะ (mm.)",
            "                  มีการปรับออก ด้านลบ ระยะ (mm.)",
        ],
    },
    { no: 8, desc: "ตรวจสอบสภาพ Parallel Rod, Power Rod, Detector Rod" },
    { no: 9, desc: "ทำความสะอาดจาระบีเก่า และทาจาระบีใหม่ในตัว Point Machine" },
    { no: 10, desc: "ตรวจสอบความแน่นหนาของจุดเชื่อมต่อต่างๆ ใน Point Machine" },
    { no: 11, desc: "ตรวจสอบสภาพ Insulated Bolt และ Insulated Jaw" },
    { no: 12, desc: "ตรวจสอบ Marker ของน็อตทุกตัว และน็อต Contract Spring Set" },
    {
        no: 13, desc: "ตรวจสอบรอยแตกร้าวที่บริเวณฐานปูนของ Point Machine",
        subRows: ["(ความกว้างของรอยแตกร้าวต้องไม่เกิน 2 mm.)"],
    },
    {
        no: 14, desc: "ตรวจสอบสภาพอุปกรณ์จากการกัดกร่อนและความเสียหายอื่นๆ",
        subRows: ["พื้นภายในและภายนอก"],
    },
]

// Page 2 items (15–30)
const PM_PAGE2_ITEMS: { no: number; desc: string; subRows?: string[] }[] = [
    { no: 15, desc: "เปลี่ยนน้ำมันเกียร์" },
    { no: 16, desc: "ทำความสะอาดภายในและภายนอกของ Point Machine" },
    { no: 17, desc: "ตรวจสอบจำนวนสายไฟบริเวณจุดเชื่อมต่อต่างๆ ใน Point Machine" },
    {
        no: 18, desc: "ตรวจสอบจำนวนสายไฟบริเวณจุดเชื่อมต่อต่างๆ ใน Terminal Box และ",
        subRows: ["Diode Terminal"],
    },
    {
        no: 19, desc: "วัดค่าแรงกดสปริงที่ Contact Spring Set ของ Point Machine",
        subRows: ["(บันทึกค่าในตารางด้านล่าง)"],
    },
    {
        no: 20, desc: "วัดค่าความต้านทาน (Impedance: Ω) ที่ Contact Spring Set Point Machine",
        subRows: ["(บันทึกค่าในตารางด้านล่าง)"],
    },
    {
        no: 21, desc: "Crank Point Machine ให้อยู่ในตำแหน่งเริ่มต้นก่อนการทำงาน",
        subRows: ["และทำการ On Point Machine"],
    },
    { no: 22, desc: "วัดค่าแรงดันไฟฟ้าที่ Point Machine (บันทึกค่าในตารางด้านล่าง)" },
    { no: 23, desc: "วัดค่ากระแสไฟฟ้าที่ Point Machine (บันทึกค่าในตารางด้านล่าง)" },
    {
        no: 24, desc: "Switch บวก และลบ กับ CCR      +  →  -",
        subRows: ["เพื่อตรวจสอบสถานะ Point Machine      -  →  +"],
    },
    {
        no: 25, desc: "Switch บวก และ ลบ กับ CCR Test 3 mm. ด้วย Steel Template",
        subRows: ["(สถานะปกติต้อง End Position ทั้งด้านบวกและ ด้านลบ)"],
    },
    {
        no: 26, desc: "Switch บวก และ ลบ กับ CCR Test 5 mm. ด้วย Steel Template",
        subRows: ["(สถานะปกติต้องไม่ End Position ทั้งด้านบวกและ ด้านลบ)"],
    },
    {
        no: 27, desc: "ตรวจสอบความเป็นฉนวนระหว่าง Point Machine กับฐานของ Point",
        subRows: ["Machine โดยวิธีการ Bell Test (ต้องไม่เชื่อมต่อถึงกัน)"],
    },
    {
        no: 28, desc: "ตรวจสอบการเชื่อมต่อระหว่างฐานของ Point Machine กับ Running Rail",
        subRows: ["โดยวิธีการ Bell Test (ต้องเชื่อมต่อถึงกัน)"],
    },
    {
        no: 29, desc: "ตรวจสอบการเชื่อมต่อระหว่าง Point Machine กับ Running Rail",
        subRows: ["โดยวิธีการ Bell Test (ต้องไม่เชื่อมต่อถึงกัน)"],
    },
    {
        no: 30, desc: "Apostle ตรวจสอบอุปกรณ์ทั้งหมด ก่อนออกจากพื้นที่",
        subRows: ["และยืนยันกับ CCR ว่าปฏิบัติงานเสร็จเรียบร้อย"],
    },
]

// MOXA TAP
const MOXA_CHECKLIST = [
    { no: 1, desc: "ตรวจสอบสภาพภายนอกของตู้ MOXA TAP" },
    { no: 2, desc: "ตรวจสอบ Connector & Cable ภายนอก" },
    { no: 3, desc: "ตรวจสอบ Connector & Cable ภายใน" },
    { no: 4, desc: "ตรวจสอบ LED Status" },
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

// EMP Control Box
const EMP_CONTROL_ITEMS = [
    { no: 1, desc: "ตรวจสอบสภาพภายนอก EMP Control Box" },
    { no: 2, desc: "ตรวจสอบ Terminal & Connection" },
    { no: 3, desc: "ตรวจสอบ Circuit Breaker" },
    { no: 4, desc: "ตรวจสอบ Relay & Timer" },
    { no: 5, desc: "ตรวจสอบ LED Indicator" },
]

const EMP_SURGE_ITEMS = [
    { no: 1, desc: "ตรวจสอบ Surge Protection Device" },
    { no: 2, desc: "ตรวจสอบ Grounding" },
]

const EMP_PLATFORM_ITEMS = [
    { no: 1, desc: "ตรวจสอบปุ่มกด EMP" },
    { no: 2, desc: "ตรวจสอบ Cover / Housing" },
    { no: 3, desc: "ตรวจสอบ Spring Mechanism" },
    { no: 4, desc: "ตรวจสอบ Wiring & Connector" },
    { no: 5, desc: "ทดสอบการทำงาน (Function Test)" },
]

// ============================================
// Header Info Section (shared across types)
// ============================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HeaderSection({ report }: { report: any }) {
    const statusInfo = getStatusStyle(report.status)

    return (
        <>
            {/* Header Banner */}
            <View style={s.headerRow}>
                <View>
                    <Text style={s.headerTitle}>BTS Smart Maintenance</Text>
                    <Text style={s.headerSub}>
                        Preventive Maintenance Report — {report.jobTemplate?.name || "N/A"}
                    </Text>
                </View>
                <View style={s.headerRight}>
                    <Text style={s.woLabel}>Work Order No.</Text>
                    <Text style={s.woValue}>{report.workOrderNo}</Text>
                    {report.workOrderNo2 && (
                        <Text style={{ fontSize: 8, color: "#6b7280" }}>{report.workOrderNo2}</Text>
                    )}
                </View>
            </View>

            {/* Status */}
            <View style={s.statusRow}>
                <Text style={{
                    ...s.badge,
                    backgroundColor: statusInfo.bg,
                    color: statusInfo.text,
                }}>
                    Status: {statusInfo.label}
                </Text>
                <Text style={{
                    ...s.badge,
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                }}>
                    {report.jobTemplate?.cycleLabel || ""} — {report.jobTemplate?.equipmentType || ""}
                </Text>
            </View>

            {/* Job Info */}
            <Text style={s.sectionTitle}>ข้อมูลทั่วไป (General Information)</Text>
            <View style={s.infoGrid}>
                <View style={s.infoCol}>
                    <Text style={s.infoLabel}>วันที่:</Text>
                    <Text style={s.infoValue}>{fmtDate(report.reportDate)}</Text>
                </View>
                <View style={s.infoCol}>
                    <Text style={s.infoLabel}>เวลา:</Text>
                    <Text style={s.infoValue}>
                        {report.reportTimeStart}{report.reportTimeEnd ? ` - ${report.reportTimeEnd}` : ""}
                    </Text>
                </View>
                <View style={s.infoCol}>
                    <Text style={s.infoLabel}>สถานี:</Text>
                    <Text style={s.infoValue}>{report.stationName}</Text>
                </View>
                <View style={s.infoCol}>
                    <Text style={s.infoLabel}>พื้นที่:</Text>
                    <Text style={s.infoValue}>{report.locationArea}</Text>
                </View>
                <View style={s.infoCol}>
                    <Text style={s.infoLabel}>หัวหน้าทีม:</Text>
                    <Text style={s.infoValue}>{report.leaderName}</Text>
                </View>
                <View style={s.infoCol}>
                    <Text style={s.infoLabel}>ผู้ช่วย:</Text>
                    <Text style={s.infoValue}>{report.apostleName}</Text>
                </View>
                <View style={s.infoCol}>
                    <Text style={s.infoLabel}>ผู้ประสานงาน:</Text>
                    <Text style={s.infoValue}>{report.coordinatePerson}</Text>
                </View>
                {report.tprNo && (
                    <View style={s.infoCol}>
                        <Text style={s.infoLabel}>TPR No.:</Text>
                        <Text style={s.infoValue}>{report.tprNo}</Text>
                    </View>
                )}
            </View>
            {report.teamNameList && (
                <View style={s.infoRow}>
                    <Text style={s.infoLabel}>ทีมงาน:</Text>
                    <Text style={s.infoValue}>{report.teamNameList}</Text>
                </View>
            )}
            {report.workDescription && (
                <View style={s.infoRow}>
                    <Text style={s.infoLabel}>รายละเอียด:</Text>
                    <Text style={s.infoValue}>{report.workDescription}</Text>
                </View>
            )}
        </>
    )
}

// ============================================
// Signature & Footer
// ============================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SignatureAndFooter({ report }: { report: any }) {
    return (
        <>
            <View style={s.signatureSection}>
                <View style={s.signatureBox}>
                    <Text style={s.signatureLabel}>ผู้ตรวจ / Leader</Text>
                    <View style={s.signatureLine} />
                    <Text style={s.signatureName}>({report.leaderName})</Text>
                </View>
                <View style={s.signatureBox}>
                    <Text style={s.signatureLabel}>ผู้อนุมัติ / Supervisor</Text>
                    <View style={s.signatureLine} />
                    <Text style={s.signatureName}>(..........................................)</Text>
                </View>
            </View>
            <Text style={s.footer}>
                BTS Smart Maintenance System — PM Report generated on {fmtDate(new Date())}
                {" | "}
                {report.jobTemplate?.formNumber || ""}
                {report.jobTemplate?.formRevision ? ` (${report.jobTemplate.formRevision})` : ""}
            </Text>
        </>
    )
}

// ============================================
// Point Machine Y1 Pages — BTS Official Form Layout
// ============================================

// ── PM Form Header ──────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PmFormHeader({ report, pageNo, totalPages }: { report: any; pageNo: number; totalPages: number }) {
    // Build dynamic title from device PM codes
    const data = report.checklistData || { devices: [] }
    const devices = data.devices || []
    const pmCodes = devices.map((d: { pmCode: string }) => d.pmCode).join("&")
    return (
        <View style={{ marginBottom: 6 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Image src="/BTS-Logo.svg.png" style={{ width: 50, height: 40 }} />
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={{ fontSize: 13, fontWeight: "bold" }}>MAINTENANCE REPORT</Text>
                    <Text style={{ fontSize: 11, fontWeight: "bold", marginTop: 4 }}>
                        PM (Y1) POINT MACHINE {pmCodes || ""}
                    </Text>
                </View>
                <Text style={{ fontSize: 8, color: "#6b7280" }}>Page {pageNo} of {totalPages}</Text>
            </View>
        </View>
    )
}

// ── PM Info Fields ──────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PmInfoFields({ report }: { report: any }) {
    const lbl = { fontSize: 7.5, fontWeight: "bold" as const, color: "#374151" }
    const val = { fontSize: 7.5, color: "#1f2937", borderBottomWidth: 0.5, borderBottomColor: "#9ca3af", paddingBottom: 1 }
    const row = { flexDirection: "row" as const, marginBottom: 3, alignItems: "flex-end" as const }
    const gap = { width: 15 }

    return (
        <View style={{ marginBottom: 4 }}>
            <View style={row}>
                <Text style={{ ...lbl, width: 90 }}>LEADER WAYSIDE :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.leaderName || ""}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 38 }}>DATE :</Text>
                <Text style={{ ...val, width: 70 }}>{fmtDate(report.reportDate)}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 38 }}>TIME :</Text>
                <Text style={{ ...val, width: 80 }}>{report.reportTimeStart || ""} : {report.reportTimeEnd || ""}</Text>
            </View>
            <View style={row}>
                <Text style={{ ...lbl, width: 110 }}>COORDINATE PERSON :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.coordinatePerson || ""}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 55 }}>STATION :</Text>
                <Text style={{ ...val, width: 60 }}>{report.stationName || ""}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 90 }}>LOCATION AREA :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.locationArea || ""}</Text>
            </View>
            <View style={row}>
                <Text style={{ ...lbl, width: 90 }}>APOSTLE :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.apostleName || ""}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 55 }}>TPR NO :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.tprNo || ""}</Text>
            </View>
            <View style={row}>
                <Text style={{ ...lbl, width: 95 }}>TEAM NAME LIST :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.teamNameList || ""}</Text>
            </View>
            <View style={row}>
                <Text style={{ ...lbl, width: 105 }}>WORK ORDER NO :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.workOrderNo || ""}</Text>
            </View>
            <View style={row}>
                <Text style={{ ...lbl, width: 115 }}>WORK DESCRIPTION :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.workDescription || report.jobTemplate?.name || "PM (Y1) POINT MACHINE"}</Text>
            </View>
        </View>
    )
}

// ── PM Checkbox Row (station, equipment, track possession) ──
function PmCheckboxRow() {
    const box = { width: 9, height: 9, borderWidth: 0.8, borderColor: "#374151", marginRight: 2 }
    const txt = { fontSize: 6.5, color: "#374151", marginRight: 6 }
    return (
        <View style={{ marginBottom: 4 }}>
            {/* Row 1 */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 2, alignItems: "center" }}>
                <Text style={{ fontSize: 7, fontWeight: "bold", color: "#374151", marginRight: 4 }}>ลงชื่อเข้า / ออก พื้นที่สถานี :</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
                    <View style={box} /><Text style={txt}>เข้า</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}>
                    <View style={box} /><Text style={txt}>ออก</Text>
                </View>
                <Text style={{ fontSize: 7, fontWeight: "bold", color: "#374151", marginRight: 4 }}>ยืม / คืน อุปกรณ์ :</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginRight: 6 }}>
                    <View style={box} /><Text style={txt}>Earthing Device</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
                    <View style={box} /><Text style={txt}>Voltage Tester</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginRight: 6 }}>
                    <View style={box} /><Text style={txt}>ยืม</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={box} /><Text style={txt}>คืน</Text>
                </View>
            </View>
            {/* Row 2 */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <Text style={{ fontSize: 7, fontWeight: "bold", color: "#374151", marginRight: 4 }}>แจ้งเข้า / ออก ที่เดียว Track Possession กับ CCR :</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
                    <View style={box} /><Text style={txt}>เข้า</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={box} /><Text style={txt}>ออก</Text>
                </View>
            </View>
        </View>
    )
}

// ── PM Multi-Column Checklist Table (with sub-rows) ──
function PmMultiColTable({ items, devices }: {
    items: { no: number; desc: string; subRows?: string[] }[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    devices: any[]
}) {
    const numDev = devices.length || 1
    const noW = 20
    const descW = numDev > 3 ? 210 : numDev > 2 ? 230 : 260
    const remarkW = numDev > 3 ? 30 : 40
    const available = 525 - noW - descW - remarkW
    const devW = numDev > 0 ? Math.floor(available / numDev) : 40
    const thinB = { borderRightWidth: 0.5 as const, borderRightColor: "#374151" }

    // Build flat row list with sub-rows
    type RowDef = {
        no: string
        desc: string
        isSub?: boolean
        itemNo?: number  // only set on main rows with ✓/X
    }
    const rows: RowDef[] = []
    for (const item of items) {
        rows.push({ no: `${item.no}.`, desc: item.desc, itemNo: item.no })
        if (item.subRows) {
            for (const sub of item.subRows) {
                rows.push({ no: "", desc: `  ${sub}`, isSub: true })
            }
        }
    }

    return (
        <View style={{ borderWidth: 0.5, borderColor: "#374151", marginBottom: 4 }}>
            {/* Spanning header: Point Machine Number */}
            <View style={{ flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#374151" }}>
                <View style={{ width: noW + descW, ...thinB }} />
                <View style={{ flex: 1, padding: 2 }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold", textAlign: "center" }}>Point Machine Number</Text>
                </View>
                <View style={{ width: remarkW }} />
            </View>
            {/* Column headers */}
            <View style={{ flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#374151", backgroundColor: "#f9fafb" }}>
                <View style={{ width: noW, ...thinB, padding: 2, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold" }}>No.</Text>
                </View>
                <View style={{ width: descW, ...thinB, padding: 2, justifyContent: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold" }}>Description</Text>
                </View>
                {devices.map((d: { pmCode: string }, i: number) => (
                    <View key={i} style={{ width: devW, ...thinB, padding: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 5.5, fontWeight: "bold", textAlign: "center" }}>{d.pmCode}</Text>
                    </View>
                ))}
                <View style={{ width: remarkW, padding: 2, justifyContent: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold" }}>Remark</Text>
                </View>
            </View>
            {/* Data rows */}
            {rows.map((row, idx) => (
                <View key={idx} style={{
                    flexDirection: "row",
                    borderBottomWidth: idx < rows.length - 1 ? 0.5 : 0,
                    borderBottomColor: "#d1d5db",
                    backgroundColor: row.isSub ? "#fafafa" : "#ffffff",
                    minHeight: row.isSub ? 12 : 15,
                }}>
                    <View style={{ width: noW, ...thinB, padding: 2, justifyContent: "center" }}>
                        <Text style={{ fontSize: 7, color: "#6b7280", textAlign: "center" }}>{row.no}</Text>
                    </View>
                    <View style={{ width: descW, ...thinB, padding: 2, justifyContent: "center" }}>
                        <Text style={{ fontSize: row.isSub ? 6.5 : 7, color: row.isSub ? "#6b7280" : "#374151" }}>{row.desc}</Text>
                    </View>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {devices.map((device: any, colIdx: number) => {
                        // Only show ✓/X on main item rows (not sub-rows)
                        if (row.itemNo) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const found = device.checklist?.find((c: any) => c.itemNo === row.itemNo)
                            const result = found?.result || "NOT_CHECKED"
                            return (
                                <View key={colIdx} style={{ width: devW, ...thinB, padding: 1, justifyContent: "center", alignItems: "center" }}>
                                    {result === "PASS" ? (
                                        <CheckSvg size={10} />
                                    ) : result === "FAIL" ? (
                                        <XSvg size={9} />
                                    ) : result === "NA" ? (
                                        <Text style={{ fontSize: 8, color: "#9ca3af" }}>-</Text>
                                    ) : (
                                        <View style={{ width: 9, height: 9 }} />
                                    )}
                                </View>
                            )
                        }
                        // Sub-rows: empty cells
                        return <View key={colIdx} style={{ width: devW, ...thinB }} />
                    })}
                    <View style={{ width: remarkW, padding: 2 }} />
                </View>
            ))}
        </View>
    )
}

// ── PM Force & Mark Center Table (Page 3) ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PmForceTable({ devices }: { devices: any[] }) {
    const cellS = { fontSize: 6, color: "#374151", textAlign: "center" as const }
    const hdrS = { fontSize: 6, fontWeight: "bold" as const, color: "#374151", textAlign: "center" as const }
    const thinB = { borderRightWidth: 0.5 as const, borderRightColor: "#374151" }
    const thinBB = { borderBottomWidth: 0.5 as const, borderBottomColor: "#374151" }
    const colW = 50
    const noW = 22
    const pmW = 55

    return (
        <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 8, fontWeight: "bold", marginBottom: 3, color: "#374151" }}>
                ตารางบันทึกค่า Point Machine Force &amp; Mark Center of Detector Rod
            </Text>
            <View style={{ borderWidth: 0.5, borderColor: "#374151" }}>
                {/* Title row */}
                <View style={{ ...thinBB, padding: 2 }}>
                    <Text style={{ ...hdrS, fontSize: 7 }}>Point Machine Force &amp; Mark Center of Detector Rod Measurement</Text>
                </View>
                {/* Header row 1 */}
                <View style={{ flexDirection: "row", ...thinBB }}>
                    <View style={{ width: noW, ...thinB, padding: 2, justifyContent: "center" }}>
                        <Text style={hdrS}>No.</Text>
                    </View>
                    <View style={{ width: pmW, ...thinB, padding: 2, justifyContent: "center" }}>
                        <Text style={hdrS}>Point Machine{"\n"}Number</Text>
                    </View>
                    <View style={{ width: colW * 2, ...thinB, padding: 2, justifyContent: "center" }}>
                        <Text style={hdrS}>Force{"\n"}Before Adjustment (Nm)</Text>
                    </View>
                    <View style={{ width: colW * 2, ...thinB, padding: 2, justifyContent: "center" }}>
                        <Text style={hdrS}>Force{"\n"}After Adjustment (Nm)</Text>
                    </View>
                    <View style={{ width: colW * 2, ...thinB, padding: 2, justifyContent: "center" }}>
                        <Text style={hdrS}>Mark Center{"\n"}Before Adjustment (mm)</Text>
                    </View>
                    <View style={{ width: colW * 2, padding: 2, justifyContent: "center" }}>
                        <Text style={hdrS}>Mark Center{"\n"}After Adjustment (mm)</Text>
                    </View>
                </View>
                {/* Header row 2 - sub columns */}
                <View style={{ flexDirection: "row", ...thinBB }}>
                    <View style={{ width: noW, ...thinB }} />
                    <View style={{ width: pmW, ...thinB }} />
                    {[0, 1, 2, 3].map(g => (
                        <View key={g} style={{ flexDirection: "row" }}>
                            <View style={{ width: colW, ...thinB, padding: 1 }}>
                                <Text style={hdrS}>ด้านบวก</Text>
                            </View>
                            <View style={{ width: colW, ...(g < 3 ? thinB : {}), padding: 1 }}>
                                <Text style={hdrS}>ด้านลบ</Text>
                            </View>
                        </View>
                    ))}
                </View>
                {/* Data rows per device */}
                {devices.length > 0 ? devices.map((device: {
                    pmCode: string
                    forceMeasurement?: Record<string, number | undefined>
                }, idx: number) => {
                    const fm = device.forceMeasurement || {}
                    return (
                        <View key={idx} style={{ flexDirection: "row", ...thinBB, minHeight: 16 }}>
                            <View style={{ width: noW, ...thinB, padding: 2, justifyContent: "center" }}>
                                <Text style={cellS}>{idx + 1}.</Text>
                            </View>
                            <View style={{ width: pmW, ...thinB, padding: 2, justifyContent: "center" }}>
                                <Text style={cellS}>{device.pmCode}</Text>
                            </View>
                            {[
                                fm.forceBeforePlus, fm.forceBeforeMinus,
                                fm.forceAfterPlus, fm.forceAfterMinus,
                                fm.markCenterBeforePlus, fm.markCenterBeforeMinus,
                                fm.markCenterAfterPlus, fm.markCenterAfterMinus,
                            ].map((v, ci) => (
                                <View key={ci} style={{ width: colW, ...(ci < 7 ? thinB : {}), padding: 1, justifyContent: "center" }}>
                                    <Text style={cellS}>{v != null ? String(v) : ""}</Text>
                                </View>
                            ))}
                        </View>
                    )
                }) : [1, 2, 3, 4].map(i => (
                    <View key={i} style={{ flexDirection: "row", ...thinBB, minHeight: 16 }}>
                        <View style={{ width: noW, ...thinB, padding: 2, justifyContent: "center" }}>
                            <Text style={cellS}>{i}.</Text>
                        </View>
                        <View style={{ width: pmW, ...thinB }} />
                        {[0, 1, 2, 3, 4, 5, 6, 7].map(ci => (
                            <View key={ci} style={{ width: colW, ...(ci < 7 ? thinB : {}), padding: 1 }} />
                        ))}
                    </View>
                ))}
                {/* Remark row */}
                <View style={{ flexDirection: "row", minHeight: 14 }}>
                    <View style={{ width: noW + pmW, ...thinB, padding: 2 }}>
                        <Text style={{ ...hdrS, textAlign: "left" }}>Remark</Text>
                    </View>
                    <View style={{ flex: 1, padding: 2 }}>
                        <Text style={{ fontSize: 5.5, color: "#6b7280" }}>
                            Criteria Force = 4000-6000 Nm // บันทึกค่าใน Before และถ้ามีการปรับตั้งให้บันทึกลง After ด้วย // การปรับ Mark Center 1 ฟัน มีระยะประมาณ 1.5 mm
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

// ── PM Contact Resistance, Voltage & Current Table (Page 3) ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PmElectricalTable({ devices }: { devices: any[] }) {
    const cellS = { fontSize: 5.5, color: "#374151", textAlign: "center" as const }
    const hdrS = { fontSize: 5.5, fontWeight: "bold" as const, color: "#374151", textAlign: "center" as const }
    const thinB = { borderRightWidth: 0.5 as const, borderRightColor: "#374151" }
    const thinBB = { borderBottomWidth: 0.5 as const, borderBottomColor: "#374151" }
    const noW = 22
    const pmW = 44
    const cW = 28  // narrow column

    // Electrical field columns
    const cols = [
        { key: "contactPlus_2_3", label: "2,3" },
        { key: "contactPlus_11_12", label: "11,12" },
        { key: "contactPlus_13_14", label: "13,14" },
        { key: "contactMinus_1_2", label: "1,2" },
        { key: "contactMinus_3_4", label: "3,4" },
        { key: "contactMinus_12_13", label: "12,13" },
        { key: "voltageL1L2", label: "L1,L2" },
        { key: "voltageL1L3", label: "L1,L3" },
        { key: "voltageL2L3", label: "L2,L3" },
        { key: "currentStart", label: "Start" },
        { key: "currentRun", label: "Run" },
        { key: "terminalPlus", label: "19,25 (+)" },
        { key: "terminalMinus", label: "18,24 (-)" },
    ]

    return (
        <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 7, fontWeight: "bold", marginBottom: 3, color: "#374151" }}>
                ตารางบันทึกค่าความต้านทานหน้า Contact, แรงดันไฟฟ้า (VAC), กระแสไฟฟ้า และแรงดันไฟฟ้า (VDC)
            </Text>
            <View style={{ borderWidth: 0.5, borderColor: "#374151" }}>
                {/* Title row */}
                <View style={{ ...thinBB, padding: 2 }}>
                    <Text style={{ ...hdrS, fontSize: 6.5 }}>Contact Resistance, Voltage &amp; Current Measurement</Text>
                </View>
                {/* Group header row */}
                <View style={{ flexDirection: "row", ...thinBB }}>
                    <View style={{ width: noW + pmW, ...thinB }} />
                    <View style={{ width: cW * 3, ...thinB, padding: 1 }}>
                        <Text style={hdrS}>ความต้านทานหน้า{"\n"}Contact ด้านบวก (Ω)</Text>
                    </View>
                    <View style={{ width: cW * 3, ...thinB, padding: 1 }}>
                        <Text style={hdrS}>ความต้านทานหน้า{"\n"}Contact ด้านลบ (Ω)</Text>
                    </View>
                    <View style={{ width: cW * 3, ...thinB, padding: 1 }}>
                        <Text style={hdrS}>แรงดันไฟฟ้า{"\n"}(VAC)</Text>
                    </View>
                    <View style={{ width: cW * 2, ...thinB, padding: 1 }}>
                        <Text style={hdrS}>กระแสไฟฟ้า{"\n"}(A)</Text>
                    </View>
                    <View style={{ width: cW * 2, padding: 1 }}>
                        <Text style={hdrS}>Terminal Detect{"\n"}(VDC)</Text>
                    </View>
                </View>
                {/* Sub-column header row */}
                <View style={{ flexDirection: "row", ...thinBB }}>
                    <View style={{ width: noW, ...thinB, padding: 1, justifyContent: "center" }}>
                        <Text style={hdrS}>No.</Text>
                    </View>
                    <View style={{ width: pmW, ...thinB, padding: 1, justifyContent: "center" }}>
                        <Text style={hdrS}>Point Machine{"\n"}Number</Text>
                    </View>
                    {cols.map((col, ci) => (
                        <View key={ci} style={{ width: cW, ...(ci < cols.length - 1 ? thinB : {}), padding: 1, justifyContent: "center" }}>
                            <Text style={{ ...hdrS, fontSize: 5 }}>{col.label}</Text>
                        </View>
                    ))}
                </View>
                {/* Data rows: each device has Plus(+) and Minus(-) row */}
                {(devices.length > 0 ? devices : [null, null, null, null]).map((device: {
                    pmCode?: string
                    electrical?: Record<string, number | undefined>
                } | null, idx: number) => (
                    <View key={idx}>
                        {/* Plus row */}
                        <View style={{ flexDirection: "row", ...thinBB, minHeight: 13 }}>
                            {idx === 0 || !device ? null : null}
                            <View style={{ width: noW, ...thinB, padding: 1, justifyContent: "center" }}>
                                {/* No. only on first sub-row */}
                                <Text style={cellS}>{idx + 1}.</Text>
                            </View>
                            <View style={{ width: pmW, ...thinB, padding: 1, justifyContent: "center" }}>
                                <Text style={{ ...cellS, fontSize: 5 }}>Plus (+)</Text>
                            </View>
                            {cols.map((col, ci) => (
                                <View key={ci} style={{ width: cW, ...(ci < cols.length - 1 ? thinB : {}), padding: 1, justifyContent: "center" }}>
                                    <Text style={cellS}>
                                        {device?.electrical?.[col.key] != null ? String(device.electrical[col.key]) : ""}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        {/* Minus row */}
                        <View style={{ flexDirection: "row", ...thinBB, minHeight: 13 }}>
                            <View style={{ width: noW, ...thinB, padding: 1 }} />
                            <View style={{ width: pmW, ...thinB, padding: 1, justifyContent: "center" }}>
                                <Text style={{ ...cellS, fontSize: 5 }}>Minus (-)</Text>
                            </View>
                            {cols.map((_, ci) => (
                                <View key={ci} style={{ width: cW, ...(ci < cols.length - 1 ? thinB : {}), padding: 1 }} />
                            ))}
                        </View>
                    </View>
                ))}
                {/* Remark */}
                <View style={{ flexDirection: "row", minHeight: 12 }}>
                    <View style={{ width: noW + pmW, ...thinB, padding: 2 }}>
                        <Text style={{ ...hdrS, textAlign: "left", fontSize: 5.5 }}>Remark</Text>
                    </View>
                    <View style={{ flex: 1, padding: 2 }}>
                        <Text style={{ fontSize: 5, color: "#6b7280" }}>
                            Criteria Contact Resistance = ไม่เกิน 1 Ω
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

// ── PM Spring Force Contact Table (Page 3) ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PmSpringForceTable({ devices }: { devices: any[] }) {
    const cellS = { fontSize: 5.5, color: "#374151", textAlign: "center" as const }
    const hdrS = { fontSize: 5.5, fontWeight: "bold" as const, color: "#374151", textAlign: "center" as const }
    const thinB = { borderRightWidth: 0.5 as const, borderRightColor: "#374151" }
    const thinBB = { borderBottomWidth: 0.5 as const, borderBottomColor: "#374151" }
    const noW = 22
    const colW = 22

    // Render one half of the spring force table (contacts 1-10 or 11-20)
    const renderHalf = (startNo: number, endNo: number) => {
        const numDevices = Math.min(devices.length || 4, 4)
        return (
            <View style={{ flex: 1, borderWidth: 0.5, borderColor: "#374151" }}>
                {/* Title */}
                <View style={{ ...thinBB, padding: 2 }}>
                    <Text style={{ ...hdrS, fontSize: 6 }}>
                        ค่าแรงกดที่ Contact ลั่ง {startNo}-{endNo} (Nm)
                    </Text>
                </View>
                {/* Column headers: No. | BF AT BF AT ... per device */}
                <View style={{ flexDirection: "row", ...thinBB }}>
                    <View style={{ width: noW, ...thinB, padding: 1, justifyContent: "center" }}>
                        <Text style={hdrS}>No.</Text>
                    </View>
                    {Array.from({ length: numDevices }).map((_, di) => (
                        <View key={di} style={{ flexDirection: "row" }}>
                            <View style={{ width: colW, ...thinB, padding: 1, justifyContent: "center" }}>
                                <Text style={hdrS}>BF</Text>
                            </View>
                            <View style={{ width: colW, ...(di < numDevices - 1 ? thinB : {}), padding: 1, justifyContent: "center" }}>
                                <Text style={hdrS}>AT</Text>
                            </View>
                        </View>
                    ))}
                </View>
                {/* Data rows */}
                {Array.from({ length: endNo - startNo + 1 }, (_, i) => startNo + i).map((contactNo) => (
                    <View key={contactNo} style={{ flexDirection: "row", ...thinBB, minHeight: 12 }}>
                        <View style={{ width: noW, ...thinB, padding: 1, justifyContent: "center" }}>
                            <Text style={cellS}>{contactNo}</Text>
                        </View>
                        {Array.from({ length: numDevices }).map((_, di) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const device = devices[di] as any
                            const sf = device?.springForce?.find((s: { contactNo: number }) => s.contactNo === contactNo)
                            return (
                                <View key={di} style={{ flexDirection: "row" }}>
                                    <View style={{ width: colW, ...thinB, padding: 1, justifyContent: "center" }}>
                                        <Text style={cellS}>{sf?.before != null ? String(sf.before) : ""}</Text>
                                    </View>
                                    <View style={{ width: colW, ...(di < numDevices - 1 ? thinB : {}), padding: 1, justifyContent: "center" }}>
                                        <Text style={cellS}>{sf?.after != null ? String(sf.after) : ""}</Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                ))}
            </View>
        )
    }

    return (
        <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "center", marginBottom: 3, color: "#374151" }}>
                ค่าแรงกดที่ Contact ของ Point Machine
            </Text>
            <View style={{ flexDirection: "row", gap: 6 }}>
                {renderHalf(1, 10)}
                {renderHalf(11, 20)}
            </View>
            {/* Remark */}
            <View style={{ borderWidth: 0.5, borderColor: "#374151", borderTopWidth: 0, flexDirection: "row", padding: 2 }}>
                <Text style={{ fontSize: 5.5, fontWeight: "bold", color: "#374151", marginRight: 4 }}>Remark</Text>
                <Text style={{ fontSize: 5, color: "#6b7280" }}>
                    Criteria = 3-5 Nm // BF = Before, AT = After // บันทึกค่าของแรงกดทุกคอนแทค Before และถ้ามีการปรับตั้งให้บันทึกลง After ด้วย
                </Text>
            </View>
        </View>
    )
}

// ── PM Form Footer ──────────────────────────
function PmFormFooter() {
    return (
        <View style={{
            position: "absolute", bottom: 20, left: 35, right: 35,
            flexDirection: "row", justifyContent: "space-between",
        }}>
            <Text style={{ fontSize: 7, color: "#6b7280" }}>FM-MTD-M51000-Z-XXX Rev.00</Text>
            <Text style={{ fontSize: 7, color: "#6b7280" }}>Effective Date: X/X/2025</Text>
        </View>
    )
}

// ── Main Point Machine Y1 Pages ─────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PointMachinePages({ report }: { report: any }) {
    const data = report.checklistData || { devices: [] }
    const devices = data.devices || []
    const totalPages = 4

    return (
        <>
            {/* ── Page 1: Header + Info + Items 1–14 ── */}
            <Page size="A4" style={s.page}>
                <PmFormHeader report={report} pageNo={1} totalPages={totalPages} />
                <PmInfoFields report={report} />
                <PmCheckboxRow />

                <Text style={{ fontSize: 9, fontWeight: "bold", marginBottom: 4 }}>
                    Visual Inspection &amp; Cleaning Procedure (Y1)
                </Text>

                {devices.length === 0 ? (
                    <Text style={{ textAlign: "center", marginTop: 30, color: "#9ca3af" }}>
                        ยังไม่มีข้อมูล — กรุณาเพิ่ม Point Machine ในฟอร์ม
                    </Text>
                ) : (
                    <PmMultiColTable items={PM_PAGE1_ITEMS} devices={devices} />
                )}

                <PmFormFooter />
            </Page>

            {/* ── Page 2: Items 15–30 ── */}
            <Page size="A4" style={s.page}>
                <PmFormHeader report={report} pageNo={2} totalPages={totalPages} />

                {devices.length > 0 && (
                    <PmMultiColTable items={PM_PAGE2_ITEMS} devices={devices} />
                )}

                <PmFormFooter />
            </Page>

            {/* ── Page 3: Measurement Tables ── */}
            <Page size="A4" style={s.page}>
                <PmFormHeader report={report} pageNo={3} totalPages={totalPages} />

                <PmForceTable devices={devices} />
                <PmElectricalTable devices={devices} />
                <PmSpringForceTable devices={devices} />

                <PmFormFooter />
            </Page>

            {/* ── Page 4: Notes + Photos ── */}
            <Page size="A4" style={s.page}>
                <PmFormHeader report={report} pageNo={4} totalPages={totalPages} />

                {/* Notes */}
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 9, fontWeight: "bold", marginBottom: 8 }}>
                        รายละเอียดอื่น ๆ และปัญหาที่พบ
                    </Text>
                    {[1, 2, 3].map(i => (
                        <View key={i} style={{ borderBottomWidth: 0.5, borderBottomColor: "#9ca3af", marginBottom: 18 }} />
                    ))}
                </View>

                {/* Photos placeholder */}
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 9, fontWeight: "bold", marginBottom: 8 }}>
                        รูปภาพประกอบการทำงาน
                    </Text>
                    <View style={{
                        borderWidth: 0.5, borderColor: "#d1d5db", borderStyle: "dashed",
                        height: 300, justifyContent: "center", alignItems: "center",
                    }}>
                        <Text style={{ fontSize: 8, color: "#9ca3af" }}>(แนบรูปภาพ)</Text>
                    </View>
                </View>

                <PmFormFooter />
            </Page>
        </>
    )
}

// ============================================
// MOXA TAP M3 Pages — BTS Official Form Layout
// ============================================

const MOXA_LED_INDICATORS_PDF = ["PWR1", "STATUS", "HEAD", "TAIL", "LAN1", "WLAN1"] as const

const MOXA_LED_COLORS: Record<string, string> = {
    GREEN_ON: "#22c55e",
    GREEN_BLINK: "#86efac",
    ORANGE_ON: "#f97316",
    ORANGE_BLINK: "#fdba74",
    RED_ON: "#ef4444",
    OFF: "#e5e7eb",
}

// ── Page Header (every page) ────────────────
function MoxaFormHeader({ pageNo, totalPages }: { pageNo: number; totalPages: number }) {
    return (
        <View style={{ marginBottom: 6 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Image src="/BTS-Logo.svg.png" style={{ width: 50, height: 40 }} />
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={{ fontSize: 13, fontWeight: "bold" }}>MAINTENANCE REPORT</Text>
                    <Text style={{ fontSize: 11, fontWeight: "bold", marginTop: 4 }}>
                        PM (M3) MOXA TAP (PROJECT RESIG)
                    </Text>
                </View>
                <Text style={{ fontSize: 8, color: "#6b7280" }}>Page {pageNo} of {totalPages}</Text>
            </View>
        </View>
    )
}

// ── Info Form Fields ────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MoxaInfoFields({ report }: { report: any }) {
    const lbl = { fontSize: 7.5, fontWeight: "bold" as const, color: "#374151" }
    const val = { fontSize: 7.5, color: "#1f2937", borderBottomWidth: 0.5, borderBottomColor: "#9ca3af", paddingBottom: 1 }
    const row = { flexDirection: "row" as const, marginBottom: 3, alignItems: "flex-end" as const }
    const gap = { width: 15 }

    return (
        <View style={{ marginBottom: 8 }}>
            {/* Row 1: Leader | Date | Time */}
            <View style={row}>
                <Text style={{ ...lbl, width: 90 }}>LEADER WAYSIDE :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.leaderName || ""}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 38 }}>DATE :</Text>
                <Text style={{ ...val, width: 70 }}>{fmtDate(report.reportDate)}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 38 }}>TIME :</Text>
                <Text style={{ ...val, width: 80 }}>{report.reportTimeStart || ""} : {report.reportTimeEnd || ""}</Text>
            </View>
            {/* Row 2: Coordinate | Station | Location Area */}
            <View style={row}>
                <Text style={{ ...lbl, width: 110 }}>COORDINATE PERSON :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.coordinatePerson || ""}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 55 }}>STATION :</Text>
                <Text style={{ ...val, width: 60 }}>{report.stationName || ""}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 90 }}>LOCATION AREA :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.locationArea || ""}</Text>
            </View>
            {/* Row 3: Apostle | TPR No */}
            <View style={row}>
                <Text style={{ ...lbl, width: 90 }}>APOSTLE :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.apostleName || ""}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 55 }}>TPR NO :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.tprNo || ""}</Text>
            </View>
            {/* Row 4: Team Name List */}
            <View style={row}>
                <Text style={{ ...lbl, width: 95 }}>TEAM NAME LIST :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.teamNameList || ""}</Text>
            </View>
            {/* Row 5: Work Order No */}
            <View style={row}>
                <Text style={{ ...lbl, width: 105 }}>WORK ORDER NO :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.workOrderNo || ""}</Text>
            </View>
            {/* Row 6: Work Description */}
            <View style={row}>
                <Text style={{ ...lbl, width: 115 }}>WORK DESCRIPTION :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.workDescription || report.jobTemplate?.name || "PM (M3) MOXA TAP"}</Text>
            </View>
        </View>
    )
}

// ── LED Status Panel ────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MoxaLedPanel({ devices }: { devices: any[] }) {
    if (devices.length === 0) return null

    return (
        <View style={{ marginBottom: 6, borderWidth: 0.5, borderColor: "#374151", padding: 6 }}>
            <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "center", marginBottom: 6 }}>
                MOXA TAP LED Status & Media Converter LED Status
            </Text>
            {/* LED grid per device (show up to 8 per row) */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
                {devices.map((device: { tapCode: string; ledStatus?: Record<string, string> }, i: number) => (
                    <View key={i} style={{ width: "23%", borderWidth: 0.5, borderColor: "#d1d5db", padding: 3 }}>
                        <Text style={{ fontSize: 6.5, fontWeight: "bold", textAlign: "center", marginBottom: 3 }}>
                            MOXA TAP LED Status
                        </Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 2 }}>
                            {MOXA_LED_INDICATORS_PDF.map(ind => {
                                const v = device.ledStatus?.[ind] || "OFF"
                                return (
                                    <View key={ind} style={{ flexDirection: "row", alignItems: "center", width: "48%", marginBottom: 1 }}>
                                        <Text style={{ fontSize: 5, width: 26, color: "#374151" }}>{ind}</Text>
                                        <View style={{
                                            width: 9, height: 9,
                                            backgroundColor: MOXA_LED_COLORS[v] || "#e5e7eb",
                                            borderWidth: 0.5, borderColor: "#d1d5db",
                                        }} />
                                    </View>
                                )
                            })}
                        </View>
                        <Text style={{ fontSize: 5, textAlign: "center", marginTop: 2, color: "#6b7280" }}>
                            {device.tapCode}
                        </Text>
                    </View>
                ))}
            </View>
            {/* Legend */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 5, borderTopWidth: 0.5, borderTopColor: "#d1d5db", paddingTop: 3 }}>
                <Text style={{ fontSize: 5.5, fontWeight: "bold", color: "#374151" }}>สถานะ LED Panel :</Text>
                {[
                    { color: "#22c55e", label: "= ไฟสีเขียวติดค้าง," },
                    { color: "#86efac", label: "= ไฟสีเขียวกระพริบ," },
                    { color: "#f97316", label: "= ไฟสีส้มติดค้าง," },
                    { color: "#fdba74", label: "= ไฟสีส้มกระพริบ," },
                    { color: "#ef4444", label: "= ไฟสีแดงติดค้าง," },
                    { color: "#e5e7eb", label: "= ไฟไม่ติด" },
                ].map((item, i) => (
                    <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                        <View style={{ width: 7, height: 7, backgroundColor: item.color, borderWidth: 0.5, borderColor: "#d1d5db" }} />
                        <Text style={{ fontSize: 5, color: "#374151" }}>{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}

// ── Multi-Column Checklist Table ─────────────
function MoxaMultiColTable({ items, devices, includeSubLed = false }: {
    items: { no: number; desc: string }[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    devices: any[]
    includeSubLed?: boolean
}) {
    const numDev = devices.length
    const noW = 20
    const descW = numDev > 8 ? 100 : numDev > 5 ? 115 : 135
    const remarkW = numDev > 8 ? 28 : 35
    const available = 525 - noW - descW - remarkW
    const devW = numDev > 0 ? Math.floor(available / numDev) : 35
    const thinB = { borderRightWidth: 0.5 as const, borderRightColor: "#d1d5db" }

    // Build row data
    type RowDef = {
        no: string; desc: string; isSub?: boolean
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getResult: (device: any) => string
    }
    const rows: RowDef[] = []

    for (const item of items) {
        if (item.no === 4 && includeSubLed) {
            // Item 4 header row
            rows.push({ no: "4.", desc: item.desc, getResult: () => "" })
            // LED sub-rows
            for (const ind of MOXA_LED_INDICATORS_PDF) {
                rows.push({
                    no: "",
                    desc: `  ตรวจสอบไฟสถานะ ${ind}`,
                    isSub: true,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    getResult: (device: any) => {
                        const val = device.ledStatus?.[ind]
                        return val && val !== "OFF" ? "PASS" : "NOT_CHECKED"
                    },
                })
            }
        } else {
            rows.push({
                no: `${item.no}.`,
                desc: item.desc,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                getResult: (device: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const found = device.checklist?.find((c: any) => c.itemNo === item.no)
                    return found?.result || "NOT_CHECKED"
                },
            })
        }
    }

    return (
        <View style={{ borderWidth: 0.5, borderColor: "#374151", marginBottom: 4 }}>
            {/* Spanning header: MOXA TAP Name */}
            <View style={{ flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#374151" }}>
                <View style={{ width: noW + descW, borderRightWidth: 0.5, borderRightColor: "#374151" }} />
                <View style={{ flex: 1, padding: 2 }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold", textAlign: "center" }}>MOXA TAP Name</Text>
                </View>
                <View style={{ width: remarkW }} />
            </View>
            {/* Column headers: No. | Description | TAP1 | TAP2 | ... | Remark */}
            <View style={{ flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#374151", backgroundColor: "#f9fafb" }}>
                <View style={{ width: noW, ...thinB, padding: 2, justifyContent: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold" }}>No.</Text>
                </View>
                <View style={{ width: descW, ...thinB, padding: 2, justifyContent: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold" }}>Description</Text>
                </View>
                {devices.map((d: { tapCode: string }, i: number) => (
                    <View key={i} style={{ width: devW, ...thinB, padding: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 5, fontWeight: "bold", textAlign: "center" }}>{d.tapCode}</Text>
                    </View>
                ))}
                <View style={{ width: remarkW, padding: 2, justifyContent: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold" }}>Remark</Text>
                </View>
            </View>
            {/* Data rows */}
            {rows.map((row, idx) => (
                <View key={idx} style={{
                    flexDirection: "row",
                    borderBottomWidth: idx < rows.length - 1 ? 0.5 : 0,
                    borderBottomColor: "#d1d5db",
                    backgroundColor: row.isSub ? "#fafafa" : "#ffffff",
                    minHeight: 15,
                }}>
                    <View style={{ width: noW, ...thinB, padding: 2, justifyContent: "center" }}>
                        <Text style={{ fontSize: 7, color: "#6b7280", textAlign: "center" }}>{row.no}</Text>
                    </View>
                    <View style={{ width: descW, ...thinB, padding: 2, justifyContent: "center" }}>
                        <Text style={{ fontSize: 7, color: "#374151" }}>{row.desc}</Text>
                    </View>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {devices.map((device: any, colIdx: number) => {
                        const result = row.getResult(device)
                        // Render checkbox-style like the BTS official form
                        return (
                            <View key={colIdx} style={{ width: devW, ...thinB, padding: 1, justifyContent: "center", alignItems: "center" }}>
                                {result === "PASS" ? (
                                    <CheckSvg size={10} />
                                ) : result === "FAIL" ? (
                                    <XSvg size={9} />
                                ) : result === "NA" ? (
                                    <Text style={{ fontSize: 8, color: "#9ca3af" }}>-</Text>
                                ) : (
                                    <View style={{ width: 9, height: 9 }} />
                                )}
                            </View>
                        )
                    })}
                    <View style={{ width: remarkW, padding: 2 }} />
                </View>
            ))}
        </View>
    )
}

// ── Page Footer ─────────────────────────────
function MoxaFormFooter() {
    return (
        <View style={{
            position: "absolute", bottom: 20, left: 35, right: 35,
            flexDirection: "row", justifyContent: "space-between",
        }}>
            <Text style={{ fontSize: 7, color: "#6b7280" }}>FM-MTD-M51000-Z-021 Rev.00</Text>
            <Text style={{ fontSize: 7, color: "#6b7280" }}>Effective Date: 25/09/2025</Text>
        </View>
    )
}

// ── Main MOXA TAP Pages ─────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MoxaTapPages({ report }: { report: any }) {
    const data = report.checklistData || { devices: [] }
    const devices = data.devices || []
    const totalPages = 2

    const page1Items = MOXA_CHECKLIST.filter(i => i.no <= 10)
    const page2Items = MOXA_CHECKLIST.filter(i => i.no > 10)

    return (
        <>
            {/* ── Page 1: Header + Info + LED + Items 1–10 ── */}
            <Page size="A4" style={s.page}>
                <MoxaFormHeader pageNo={1} totalPages={totalPages} />
                <MoxaInfoFields report={report} />

                <Text style={{ fontSize: 9, fontWeight: "bold", marginBottom: 4 }}>
                    Visual Inspection & Cleaning Procedure (M3)
                </Text>

                <MoxaLedPanel devices={devices} />

                {devices.length === 0 ? (
                    <Text style={{ textAlign: "center", marginTop: 30, color: "#9ca3af" }}>
                        ยังไม่มีข้อมูล — กรุณาเพิ่ม MOXA TAP ในฟอร์ม
                    </Text>
                ) : (
                    <MoxaMultiColTable items={page1Items} devices={devices} includeSubLed={true} />
                )}

                <MoxaFormFooter />
            </Page>

            {/* ── Page 2: Items 11–19 + Notes + Signature ── */}
            <Page size="A4" style={s.page}>
                <MoxaFormHeader pageNo={2} totalPages={totalPages} />

                {devices.length > 0 && (
                    <MoxaMultiColTable items={page2Items} devices={devices} />
                )}

                {/* Notes Section */}
                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 9, fontWeight: "bold", marginBottom: 8 }}>
                        รายละเอียดอื่น ๆ และปัญหาที่พบ
                    </Text>
                    {[1, 2, 3].map(i => (
                        <View key={i} style={{ borderBottomWidth: 0.5, borderBottomColor: "#9ca3af", marginBottom: 18 }} />
                    ))}
                </View>

                {/* Signature */}
                <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ width: 180, alignItems: "center" }}>
                        <Text style={{ fontSize: 8, color: "#6b7280", marginBottom: 35 }}>ผู้ตรวจ / Leader</Text>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: "#000", width: "100%", marginBottom: 4 }} />
                        <Text style={{ fontSize: 8, color: "#374151", textAlign: "center" }}>({report.leaderName})</Text>
                    </View>
                    <View style={{ width: 180, alignItems: "center" }}>
                        <Text style={{ fontSize: 8, color: "#6b7280", marginBottom: 35 }}>ผู้อนุมัติ / Supervisor</Text>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: "#000", width: "100%", marginBottom: 4 }} />
                        <Text style={{ fontSize: 8, color: "#374151", textAlign: "center" }}>(..........................................)</Text>
                    </View>
                </View>

                <MoxaFormFooter />
            </Page>
        </>
    )
}

// ============================================
// EMP M2 Pages — BTS Official Form Layout
// ============================================

// ── EMP Page Header ─────────────────────────
function EmpFormHeader({ pageNo, totalPages }: { pageNo: number; totalPages: number }) {
    return (
        <View style={{ marginBottom: 6 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Image src="/BTS-Logo.svg.png" style={{ width: 50, height: 40 }} />
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={{ fontSize: 13, fontWeight: "bold" }}>MAINTENANCE REPORT</Text>
                    <Text style={{ fontSize: 11, fontWeight: "bold", marginTop: 4 }}>
                        PM (M2) : EMERGENCY STOP PLUNGER (EMP)
                    </Text>
                </View>
                <Text style={{ fontSize: 8, color: "#6b7280" }}>Page {pageNo} of {totalPages}</Text>
            </View>
        </View>
    )
}

// ── EMP Info Fields ─────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EmpInfoFields({ report }: { report: any }) {
    const lbl = { fontSize: 7.5, fontWeight: "bold" as const, color: "#374151" }
    const val = { fontSize: 7.5, color: "#1f2937", borderBottomWidth: 0.5, borderBottomColor: "#9ca3af", paddingBottom: 1 }
    const row = { flexDirection: "row" as const, marginBottom: 3, alignItems: "flex-end" as const }
    const gap = { width: 15 }

    return (
        <View style={{ marginBottom: 6 }}>
            {/* Row 1: Leader | Date | Time */}
            <View style={row}>
                <Text style={{ ...lbl, width: 90 }}>LEADER WAYSIDE :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.leaderName || ""}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 38 }}>DATE :</Text>
                <Text style={{ ...val, width: 70 }}>{fmtDate(report.reportDate)}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 38 }}>TIME :</Text>
                <Text style={{ ...val, width: 80 }}>{report.reportTimeStart || ""} : {report.reportTimeEnd || ""}</Text>
            </View>
            {/* Row 2: Coordinate | Station | Location Area */}
            <View style={row}>
                <Text style={{ ...lbl, width: 110 }}>COORDINATE PERSON :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.coordinatePerson || ""}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 55 }}>STATION :</Text>
                <Text style={{ ...val, width: 60 }}>{report.stationName || ""}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 90 }}>LOCATION AREA :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.locationArea || ""}</Text>
            </View>
            {/* Row 3: Apostle | TPR No */}
            <View style={row}>
                <Text style={{ ...lbl, width: 90 }}>APOSTLE :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.apostleName || ""}</Text>
                <View style={gap} />
                <Text style={{ ...lbl, width: 55 }}>TPR NO :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.tprNo || ""}</Text>
            </View>
            {/* Row 4: Team Name List */}
            <View style={row}>
                <Text style={{ ...lbl, width: 95 }}>TEAM NAME LIST :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.teamNameList || ""}</Text>
            </View>
            {/* Row 5: Work Order No */}
            <View style={row}>
                <Text style={{ ...lbl, width: 105 }}>WORK ORDER NO :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.workOrderNo || ""}</Text>
            </View>
            {/* Row 6: Work Description */}
            <View style={row}>
                <Text style={{ ...lbl, width: 115 }}>WORK DESCRIPTION :</Text>
                <Text style={{ ...val, flex: 1 }}>{report.workDescription || report.jobTemplate?.name || "PM (M2) EMERGENCY STOP PLUNGER (EMP)"}</Text>
            </View>
        </View>
    )
}

// ── EMP Checkbox Row (station sign-in, equipment borrow) ──
function EmpCheckboxRow() {
    const box = { width: 9, height: 9, borderWidth: 0.8, borderColor: "#374151", marginRight: 3 }
    const txt = { fontSize: 7, color: "#374151", marginRight: 12 }
    return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 6, gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={box} />
                <Text style={txt}>ลงชื่อเข้า/ออก พื้นที่สถานี</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={box} />
                <Text style={txt}>ยืม/คืน อุปกรณ์</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={box} />
                <Text style={txt}>แจ้งเข้า/ออก Track Possession</Text>
            </View>
        </View>
    )
}

// ── Simple Checklist Table (single result column) ──
function EmpSimpleTable({ items, checklist }: {
    items: { no: number; desc: string }[]
    checklist: { itemNo: number; result: string }[]
}) {
    const noW = 25
    const descW = 280
    const resultW = 60
    const remarkW = 160
    const thinB = { borderRightWidth: 0.5 as const, borderRightColor: "#374151" }

    return (
        <View style={{ borderWidth: 0.5, borderColor: "#374151", marginBottom: 6 }}>
            {/* Header */}
            <View style={{ flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#374151", backgroundColor: "#f9fafb" }}>
                <View style={{ width: noW, ...thinB, padding: 2, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold" }}>No.</Text>
                </View>
                <View style={{ width: descW, ...thinB, padding: 2, justifyContent: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold" }}>Description</Text>
                </View>
                <View style={{ width: resultW, ...thinB, padding: 2, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold" }}>Result</Text>
                </View>
                <View style={{ width: remarkW, padding: 2, justifyContent: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold" }}>Remark</Text>
                </View>
            </View>
            {/* Rows */}
            {items.map((item, idx) => {
                const found = checklist?.find(c => c.itemNo === item.no)
                const result = found?.result || "NOT_CHECKED"
                return (
                    <View key={item.no} style={{
                        flexDirection: "row",
                        borderBottomWidth: idx < items.length - 1 ? 0.5 : 0,
                        borderBottomColor: "#d1d5db",
                        minHeight: 16,
                    }}>
                        <View style={{ width: noW, ...thinB, padding: 2, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 7, color: "#6b7280" }}>{item.no}.</Text>
                        </View>
                        <View style={{ width: descW, ...thinB, padding: 2, justifyContent: "center" }}>
                            <Text style={{ fontSize: 7, color: "#374151" }}>{item.desc}</Text>
                        </View>
                        <View style={{ width: resultW, ...thinB, padding: 1, justifyContent: "center", alignItems: "center" }}>
                            {result === "PASS" ? (
                                <CheckSvg size={10} />
                            ) : result === "FAIL" ? (
                                <XSvg size={9} />
                            ) : result === "NA" ? (
                                <Text style={{ fontSize: 8, color: "#9ca3af" }}>-</Text>
                            ) : (
                                <View style={{ width: 9, height: 9 }} />
                            )}
                        </View>
                        <View style={{ width: remarkW, padding: 2 }} />
                    </View>
                )
            })}
        </View>
    )
}

// ── Platform EMP Multi-Column Table (EMP 1–8 columns) ──
function EmpPlatformTable({ items, devices }: {
    items: { no: number; desc: string }[]
    devices: { empNumber: number; checklist: { itemNo: number; result: string }[] }[]
}) {
    const numDev = devices.length || 8
    const noW = 22
    const descW = 155
    const remarkW = 35
    const available = 525 - noW - descW - remarkW
    const devW = Math.floor(available / numDev)
    const thinB = { borderRightWidth: 0.5 as const, borderRightColor: "#374151" }

    return (
        <View style={{ borderWidth: 0.5, borderColor: "#374151", marginBottom: 6 }}>
            {/* Spanning header: EMP Number */}
            <View style={{ flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#374151" }}>
                <View style={{ width: noW + descW, ...thinB }} />
                <View style={{ flex: 1, padding: 2 }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold", textAlign: "center" }}>EMP Number</Text>
                </View>
                <View style={{ width: remarkW }} />
            </View>
            {/* Column headers: No. | Description | 1 | 2 | ... | 8 | Remark */}
            <View style={{ flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#374151", backgroundColor: "#f9fafb" }}>
                <View style={{ width: noW, ...thinB, padding: 2, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold" }}>No.</Text>
                </View>
                <View style={{ width: descW, ...thinB, padding: 2, justifyContent: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold" }}>Description</Text>
                </View>
                {devices.map((d, i) => (
                    <View key={i} style={{ width: devW, ...thinB, padding: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 7, fontWeight: "bold", textAlign: "center" }}>{d.empNumber}</Text>
                    </View>
                ))}
                <View style={{ width: remarkW, padding: 2, justifyContent: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold" }}>Remark</Text>
                </View>
            </View>
            {/* Data rows */}
            {items.map((item, idx) => (
                <View key={item.no} style={{
                    flexDirection: "row",
                    borderBottomWidth: idx < items.length - 1 ? 0.5 : 0,
                    borderBottomColor: "#d1d5db",
                    minHeight: 16,
                }}>
                    <View style={{ width: noW, ...thinB, padding: 2, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 7, color: "#6b7280" }}>{item.no}.</Text>
                    </View>
                    <View style={{ width: descW, ...thinB, padding: 2, justifyContent: "center" }}>
                        <Text style={{ fontSize: 7, color: "#374151" }}>{item.desc}</Text>
                    </View>
                    {devices.map((device, colIdx) => {
                        const found = device.checklist?.find(c => c.itemNo === item.no)
                        const result = found?.result || "NOT_CHECKED"
                        return (
                            <View key={colIdx} style={{ width: devW, ...thinB, padding: 1, justifyContent: "center", alignItems: "center" }}>
                                {result === "PASS" ? (
                                    <CheckSvg size={10} />
                                ) : result === "FAIL" ? (
                                    <XSvg size={9} />
                                ) : result === "NA" ? (
                                    <Text style={{ fontSize: 8, color: "#9ca3af" }}>-</Text>
                                ) : (
                                    <View style={{ width: 9, height: 9 }} />
                                )}
                            </View>
                        )
                    })}
                    <View style={{ width: remarkW, padding: 2 }} />
                </View>
            ))}
        </View>
    )
}

// ── EMP Form Footer ─────────────────────────
function EmpFormFooter() {
    return (
        <View style={{
            position: "absolute", bottom: 20, left: 35, right: 35,
            flexDirection: "row", justifyContent: "space-between",
        }}>
            <Text style={{ fontSize: 7, color: "#6b7280" }}>FM-MTD-M51000-Z-018 Rev.00</Text>
            <Text style={{ fontSize: 7, color: "#6b7280" }}>Effective Date: 25/09/2025</Text>
        </View>
    )
}

// ── Main EMP M2 Pages ───────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EmpPages({ report }: { report: any }) {
    const data = report.checklistData || {
        controlBox: { checklist: [] },
        surgeProtectionBox: { isPresent: false, checklist: [] },
        platform: { devices: [] },
    }
    const controlChecklist = data.controlBox?.checklist || []
    const surgePresent = data.surgeProtectionBox?.isPresent ?? false
    const surgeChecklist = data.surgeProtectionBox?.checklist || []
    const devices: { empNumber: number; checklist: { itemNo: number; result: string }[] }[] = data.platform?.devices || []
    const totalPages = 2

    return (
        <>
            {/* ── Page 1: Header + Info + Sections 1–3 ── */}
            <Page size="A4" style={s.page}>
                <EmpFormHeader pageNo={1} totalPages={totalPages} />
                <EmpInfoFields report={report} />
                <EmpCheckboxRow />

                <Text style={{ fontSize: 9, fontWeight: "bold", marginBottom: 6 }}>
                    Visual Inspection &amp; Cleaning Procedure (M2)
                </Text>

                {/* Section 1: EMP Control Box in Station Control Room (SCR) */}
                <Text style={{ fontSize: 8, fontWeight: "bold", marginBottom: 3, color: "#374151" }}>
                    1. EMP Control Box in Station Control Room (SCR)
                </Text>
                <EmpSimpleTable items={EMP_CONTROL_ITEMS} checklist={controlChecklist} />

                {/* Section 2: Surge Protection Box in Station Control Room (SCR) */}
                <Text style={{ fontSize: 8, fontWeight: "bold", marginBottom: 3, color: "#374151" }}>
                    2. Surge Protection Box in Station Control Room (SCR)
                </Text>
                {/* Surge present checkbox */}
                <View style={{ flexDirection: "row", marginBottom: 4, gap: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{
                            width: 9, height: 9,
                            borderWidth: 0.8, borderColor: "#374151",
                            marginRight: 3,
                            justifyContent: "center", alignItems: "center",
                        }}>
                            {surgePresent && (
                                <CheckSvg size={7} />
                            )}
                        </View>
                        <Text style={{ fontSize: 7, color: "#374151" }}>มี Surge Protection Box</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{
                            width: 9, height: 9,
                            borderWidth: 0.8, borderColor: "#374151",
                            marginRight: 3,
                            justifyContent: "center", alignItems: "center",
                        }}>
                            {!surgePresent && (
                                <CheckSvg size={7} />
                            )}
                        </View>
                        <Text style={{ fontSize: 7, color: "#374151" }}>ไม่มี Surge Protection Box</Text>
                    </View>
                </View>
                {surgePresent ? (
                    <EmpSimpleTable items={EMP_SURGE_ITEMS} checklist={surgeChecklist} />
                ) : (
                    <View style={{ borderWidth: 0.5, borderColor: "#374151", padding: 6, marginBottom: 6 }}>
                        <Text style={{ fontSize: 7, color: "#9ca3af", textAlign: "center" }}>
                            สถานีนี้ไม่มี Surge Protection Box
                        </Text>
                    </View>
                )}

                {/* Section 3: Emergency Stop Plunger on Platform */}
                <Text style={{ fontSize: 8, fontWeight: "bold", marginBottom: 3, color: "#374151" }}>
                    3. Emergency Stop Plunger on Platform
                </Text>
                {devices.length > 0 ? (
                    <EmpPlatformTable items={EMP_PLATFORM_ITEMS} devices={devices} />
                ) : (
                    <View style={{ borderWidth: 0.5, borderColor: "#374151", padding: 6, marginBottom: 6 }}>
                        <Text style={{ fontSize: 7, color: "#9ca3af", textAlign: "center" }}>
                            ยังไม่มีข้อมูล Platform EMP — กรุณาเพิ่มในฟอร์ม
                        </Text>
                    </View>
                )}

                <EmpFormFooter />
            </Page>

            {/* ── Page 2: Notes + Signature ── */}
            <Page size="A4" style={s.page}>
                <EmpFormHeader pageNo={2} totalPages={totalPages} />

                {/* Notes Section */}
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 9, fontWeight: "bold", marginBottom: 8 }}>
                        รายละเอียดอื่น ๆ และปัญหาที่พบ
                    </Text>
                    {[1, 2, 3, 4, 5].map(i => (
                        <View key={i} style={{ borderBottomWidth: 0.5, borderBottomColor: "#9ca3af", marginBottom: 18 }} />
                    ))}
                </View>

                {/* Photos placeholder */}
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 9, fontWeight: "bold", marginBottom: 8 }}>
                        รูปภาพประกอบการทำงาน
                    </Text>
                    <View style={{
                        borderWidth: 0.5, borderColor: "#d1d5db", borderStyle: "dashed",
                        height: 200, justifyContent: "center", alignItems: "center",
                    }}>
                        <Text style={{ fontSize: 8, color: "#9ca3af" }}>(แนบรูปภาพ)</Text>
                    </View>
                </View>

                {/* Signature */}
                <View style={{ marginTop: 40, flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ width: 180, alignItems: "center" }}>
                        <Text style={{ fontSize: 8, color: "#6b7280", marginBottom: 35 }}>ผู้ตรวจ / Leader</Text>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: "#000", width: "100%", marginBottom: 4 }} />
                        <Text style={{ fontSize: 8, color: "#374151", textAlign: "center" }}>({report.leaderName})</Text>
                    </View>
                    <View style={{ width: 180, alignItems: "center" }}>
                        <Text style={{ fontSize: 8, color: "#6b7280", marginBottom: 35 }}>ผู้อนุมัติ / Supervisor</Text>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: "#000", width: "100%", marginBottom: 4 }} />
                        <Text style={{ fontSize: 8, color: "#374151", textAlign: "center" }}>(..........................................)</Text>
                    </View>
                </View>

                <EmpFormFooter />
            </Page>
        </>
    )
}

// ============================================
// Main PDF Component
// ============================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PmReportPDF = ({ report }: { report: any }) => {
    const templateCode = report.jobTemplate?.code || ""

    return (
        <Document>
            {templateCode === "PM_Y1_POINT_MACHINE" && <PointMachinePages report={report} />}
            {templateCode === "PM_M3_MOXA_TAP" && <MoxaTapPages report={report} />}
            {templateCode === "PM_M2_EMP" && <EmpPages report={report} />}
            {!["PM_Y1_POINT_MACHINE", "PM_M3_MOXA_TAP", "PM_M2_EMP"].includes(templateCode) && (
                <Page size="A4" style={s.page}>
                    <HeaderSection report={report} />
                    <Text style={{ textAlign: "center", marginTop: 40, color: "#9ca3af" }}>
                        ไม่พบ Template สำหรับ: {templateCode}
                    </Text>
                    <SignatureAndFooter report={report} />
                </Page>
            )}
        </Document>
    )
}