-- AlterEnum
ALTER TYPE "AttendeeStatus" ADD VALUE 'attended';

-- AlterTable
ALTER TABLE "Attendee" ADD COLUMN     "engagementScore" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "Webinar" ADD COLUMN     "scheduledAt" TIMESTAMP(3);
