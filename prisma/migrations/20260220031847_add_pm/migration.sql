-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ApprovalAction" AS ENUM ('APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('ENTRY', 'EXIT');

-- CreateEnum
CREATE TYPE "BorrowStatus" AS ENUM ('BORROWED', 'RETURNED');

-- CreateEnum
CREATE TYPE "PmCycle" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'BIANNUAL', 'YEARLY');

-- CreateTable
CREATE TABLE "JobTemplate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "equipmentType" TEXT NOT NULL,
    "pmCycle" "PmCycle" NOT NULL,
    "cycleLabel" TEXT NOT NULL,
    "intervalDays" INTEGER NOT NULL,
    "formNumber" TEXT,
    "formRevision" TEXT,
    "checklistSchema" JSONB,
    "checklistTemplate" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "JobTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceReport" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jobTemplateId" TEXT NOT NULL,
    "leaderId" TEXT,
    "apostleId" TEXT,
    "workOrderNo" TEXT NOT NULL,
    "workOrderNo2" TEXT,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "reportTimeStart" TEXT NOT NULL,
    "reportTimeEnd" TEXT,
    "stationName" TEXT NOT NULL,
    "locationArea" TEXT NOT NULL,
    "leaderName" TEXT NOT NULL,
    "apostleName" TEXT NOT NULL,
    "coordinatePerson" TEXT NOT NULL,
    "tprNo" TEXT,
    "teamNameList" TEXT,
    "workDescription" TEXT,
    "equipmentCount" INTEGER NOT NULL DEFAULT 0,
    "equipmentCodes" TEXT[],
    "stationCodes" TEXT[],
    "stationAccessStatus" "AccessStatus",
    "ccrAccessStatus" "AccessStatus",
    "hasEarthingDevice" BOOLEAN,
    "earthingDeviceStatus" "BorrowStatus",
    "hasVoltageTester" BOOLEAN,
    "voltageTesterStatus" "BorrowStatus",
    "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "totalCheckItems" INTEGER NOT NULL DEFAULT 0,
    "passCount" INTEGER NOT NULL DEFAULT 0,
    "failCount" INTEGER NOT NULL DEFAULT 0,
    "hasIssues" BOOLEAN NOT NULL DEFAULT false,
    "additionalRemarks" TEXT,
    "checklistData" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "MaintenanceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "action" "ApprovalAction" NOT NULL,
    "comment" TEXT,
    "previousStatus" "ReportStatus" NOT NULL,
    "newStatus" "ReportStatus" NOT NULL,

    CONSTRAINT "ApprovalLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportImage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ReportImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobTemplate_code_key" ON "JobTemplate"("code");

-- CreateIndex
CREATE INDEX "JobTemplate_equipmentType_idx" ON "JobTemplate"("equipmentType");

-- CreateIndex
CREATE INDEX "JobTemplate_pmCycle_idx" ON "JobTemplate"("pmCycle");

-- CreateIndex
CREATE INDEX "MaintenanceReport_jobTemplateId_idx" ON "MaintenanceReport"("jobTemplateId");

-- CreateIndex
CREATE INDEX "MaintenanceReport_reportDate_idx" ON "MaintenanceReport"("reportDate");

-- CreateIndex
CREATE INDEX "MaintenanceReport_stationName_idx" ON "MaintenanceReport"("stationName");

-- CreateIndex
CREATE INDEX "MaintenanceReport_status_idx" ON "MaintenanceReport"("status");

-- CreateIndex
CREATE INDEX "MaintenanceReport_hasIssues_idx" ON "MaintenanceReport"("hasIssues");

-- CreateIndex
CREATE INDEX "MaintenanceReport_workOrderNo_idx" ON "MaintenanceReport"("workOrderNo");

-- CreateIndex
CREATE INDEX "MaintenanceReport_equipmentCodes_idx" ON "MaintenanceReport"("equipmentCodes");

-- CreateIndex
CREATE INDEX "ApprovalLog_reportId_idx" ON "ApprovalLog"("reportId");

-- CreateIndex
CREATE INDEX "ApprovalLog_approverId_idx" ON "ApprovalLog"("approverId");

-- CreateIndex
CREATE INDEX "ReportImage_reportId_idx" ON "ReportImage"("reportId");

-- AddForeignKey
ALTER TABLE "MaintenanceReport" ADD CONSTRAINT "MaintenanceReport_jobTemplateId_fkey" FOREIGN KEY ("jobTemplateId") REFERENCES "JobTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceReport" ADD CONSTRAINT "MaintenanceReport_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceReport" ADD CONSTRAINT "MaintenanceReport_apostleId_fkey" FOREIGN KEY ("apostleId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalLog" ADD CONSTRAINT "ApprovalLog_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "MaintenanceReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalLog" ADD CONSTRAINT "ApprovalLog_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportImage" ADD CONSTRAINT "ReportImage_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "MaintenanceReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
