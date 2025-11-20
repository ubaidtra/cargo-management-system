-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cargo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trackingNumber" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderContact" TEXT,
    "receiverName" TEXT NOT NULL,
    "receiverContact" TEXT,
    "destination" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "numberOfItems" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "cost" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "sendingDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Cargo" ("cost", "createdAt", "destination", "id", "paymentStatus", "receiverContact", "receiverName", "senderContact", "senderName", "sendingDate", "status", "trackingNumber", "weight") SELECT "cost", "createdAt", "destination", "id", "paymentStatus", "receiverContact", "receiverName", "senderContact", "senderName", "sendingDate", "status", "trackingNumber", "weight" FROM "Cargo";
DROP TABLE "Cargo";
ALTER TABLE "new_Cargo" RENAME TO "Cargo";
CREATE UNIQUE INDEX "Cargo_trackingNumber_key" ON "Cargo"("trackingNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
