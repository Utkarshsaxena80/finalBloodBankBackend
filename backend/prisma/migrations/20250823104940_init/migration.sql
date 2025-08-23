-- CreateTable
CREATE TABLE "public"."GroupJoinRequest" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "requesterId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "GroupJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupJoinRequest_requesterId_groupId_key" ON "public"."GroupJoinRequest"("requesterId", "groupId");

-- AddForeignKey
ALTER TABLE "public"."GroupJoinRequest" ADD CONSTRAINT "GroupJoinRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "public"."BloodBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupJoinRequest" ADD CONSTRAINT "GroupJoinRequest_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."BloodBankGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
