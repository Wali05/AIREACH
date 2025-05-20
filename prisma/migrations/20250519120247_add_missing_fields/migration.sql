/*
  Warnings:

  - You are about to drop the column `engagementScore` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `agentId` on the `Webinar` table. All the data in the column will be lost.
  - You are about to drop the column `hostId` on the `Webinar` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Webinar` table. All the data in the column will be lost.
  - You are about to drop the `AiCallLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Made the column `joinedAt` on table `Attendee` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Webinar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Webinar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Webinar` table without a default value. This is not possible if the table is not empty.
  - Made the column `scheduledAt` on table `Webinar` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AiCallLog" DROP CONSTRAINT "AiCallLog_attendeeId_fkey";

-- DropForeignKey
ALTER TABLE "AiCallLog" DROP CONSTRAINT "AiCallLog_webinarId_fkey";

-- DropForeignKey
ALTER TABLE "Attendee" DROP CONSTRAINT "Attendee_userId_fkey";

-- DropForeignKey
ALTER TABLE "Webinar" DROP CONSTRAINT "Webinar_hostId_fkey";

-- AlterTable
ALTER TABLE "Attendee" DROP COLUMN "engagementScore",
DROP COLUMN "status",
DROP COLUMN "userId",
ADD COLUMN     "email" TEXT DEFAULT 'default@example.com',
ADD COLUMN     "name" TEXT,
ALTER COLUMN "joinedAt" SET NOT NULL,
ALTER COLUMN "joinedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- Update existing email values
UPDATE "Attendee" SET "email" = 'default@example.com' WHERE "email" IS NULL;

-- Now make it required
ALTER TABLE "Attendee" ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- First get the user ID if there's one
DO $$
DECLARE
    first_user_id TEXT;
BEGIN
    SELECT id INTO first_user_id FROM "User" LIMIT 1;

    -- AlterTable
    ALTER TABLE "Webinar" DROP COLUMN "agentId",
    DROP COLUMN "hostId",
    DROP COLUMN "status",
    ADD COLUMN     "coverImage" TEXT,
    ADD COLUMN     "createdBy" TEXT,
    ADD COLUMN     "duration" INTEGER DEFAULT 60,
    ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN "scheduledAt" SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN "scheduledAt" SET NOT NULL;

    -- Update any NULL values in createdBy with the first user ID
    IF first_user_id IS NOT NULL THEN
        UPDATE "Webinar" SET "createdBy" = first_user_id WHERE "createdBy" IS NULL;
    END IF;

    -- Update any NULL values in duration
    UPDATE "Webinar" SET "duration" = 60 WHERE "duration" IS NULL;

    -- Now make them required
    ALTER TABLE "Webinar" ALTER COLUMN "createdBy" SET NOT NULL;
    ALTER TABLE "Webinar" ALTER COLUMN "duration" SET NOT NULL;
END $$;

-- DropTable
DROP TABLE "AiCallLog";

-- DropEnum
DROP TYPE "AttendeeStatus";

-- DropEnum
DROP TYPE "WebinarStatus";

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "userId" TEXT,
    "webinarId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "webinarId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "vapiAgentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileUpload" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_vapiAgentId_key" ON "Agent"("vapiAgentId");

-- AddForeignKey
ALTER TABLE "Webinar" ADD CONSTRAINT "Webinar_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
