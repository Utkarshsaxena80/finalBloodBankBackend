-- CreateTable
CREATE TABLE "public"."OTP" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OTP_identifier_key" ON "public"."OTP"("identifier");
