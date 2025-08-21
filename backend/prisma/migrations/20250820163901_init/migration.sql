/*
  Warnings:

  - You are about to drop the `Tests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Tests";

-- CreateTable
CREATE TABLE "public"."BloodBank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "contactMobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "validUpto" TIMESTAMP(3) NOT NULL,
    "gstNo" TEXT,
    "bankAccountDetails" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "ifsc" TEXT NOT NULL,
    "upiId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BloodBank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BloodBank_contactMobile_key" ON "public"."BloodBank"("contactMobile");

-- CreateIndex
CREATE UNIQUE INDEX "BloodBank_email_key" ON "public"."BloodBank"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BloodBank_registrationNo_key" ON "public"."BloodBank"("registrationNo");
