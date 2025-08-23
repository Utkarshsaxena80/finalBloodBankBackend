-- CreateTable
CREATE TABLE "public"."BloodBankGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "BloodBankGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GroupMember" (
    "id" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bloodBankId" TEXT NOT NULL,
    "bloodBankGroupId" TEXT NOT NULL,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_bloodBankId_bloodBankGroupId_key" ON "public"."GroupMember"("bloodBankId", "bloodBankGroupId");

-- AddForeignKey
ALTER TABLE "public"."BloodBankGroup" ADD CONSTRAINT "BloodBankGroup_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."BloodBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMember" ADD CONSTRAINT "GroupMember_bloodBankId_fkey" FOREIGN KEY ("bloodBankId") REFERENCES "public"."BloodBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMember" ADD CONSTRAINT "GroupMember_bloodBankGroupId_fkey" FOREIGN KEY ("bloodBankGroupId") REFERENCES "public"."BloodBankGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
