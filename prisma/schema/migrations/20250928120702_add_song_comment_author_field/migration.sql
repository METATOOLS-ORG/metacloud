/*
  Warnings:

  - Added the required column `userId` to the `SongComment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SongComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "songTime" REAL NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "SongComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SongComment_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SongComment" ("content", "date", "id", "songId", "songTime") SELECT "content", "date", "id", "songId", "songTime" FROM "SongComment";
DROP TABLE "SongComment";
ALTER TABLE "new_SongComment" RENAME TO "SongComment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
