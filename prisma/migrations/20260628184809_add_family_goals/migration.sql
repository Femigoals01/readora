-- CreateTable
CREATE TABLE "FamilyGoal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetBooks" INTEGER NOT NULL DEFAULT 1,
    "familyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyGoal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FamilyGoal" ADD CONSTRAINT "FamilyGoal_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
