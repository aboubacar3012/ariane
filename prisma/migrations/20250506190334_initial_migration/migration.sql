-- CreateEnum
CREATE TYPE "ServerStatus" AS ENUM ('running', 'stopped', 'restarting', 'pending', 'error');

-- CreateTable
CREATE TABLE "VPS" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ServerStatus" NOT NULL,
    "ip" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "specsId" TEXT NOT NULL,
    "uptime" DOUBLE PRECISION NOT NULL,
    "healthScore" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VPS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerSpecs" (
    "id" TEXT NOT NULL,
    "cpu" INTEGER NOT NULL,
    "ram" INTEGER NOT NULL,
    "storage" INTEGER NOT NULL,
    "os" TEXT NOT NULL,

    CONSTRAINT "ServerSpecs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VPS_specsId_key" ON "VPS"("specsId");

-- AddForeignKey
ALTER TABLE "VPS" ADD CONSTRAINT "VPS_specsId_fkey" FOREIGN KEY ("specsId") REFERENCES "ServerSpecs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
