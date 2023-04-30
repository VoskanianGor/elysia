/*
  Warnings:

  - The `event` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Event" AS ENUM ('typing', 'new_message', 'user_joined', 'user_left', 'typing_start', 'typing_stop');

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "event",
ADD COLUMN     "event" "Event" NOT NULL DEFAULT 'new_message';
