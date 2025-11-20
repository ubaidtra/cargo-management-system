-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Cargo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trackingNumber" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "receiverName" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "cost" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Cargo_trackingNumber_key" ON "Cargo"("trackingNumber");
