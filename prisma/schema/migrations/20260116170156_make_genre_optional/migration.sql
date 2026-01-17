-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "genre" TEXT,
    "audioAssetId" TEXT NOT NULL,
    "coverAssetId" TEXT,
    "authorId" TEXT NOT NULL,
    "tagPin" BOOLEAN NOT NULL,
    "tagWip" BOOLEAN NOT NULL,
    "tagFeedback" BOOLEAN NOT NULL,
    CONSTRAINT "Song_audioAssetId_fkey" FOREIGN KEY ("audioAssetId") REFERENCES "Asset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Song_coverAssetId_fkey" FOREIGN KEY ("coverAssetId") REFERENCES "Asset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Song_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Song" ("audioAssetId", "authorId", "coverAssetId", "date", "desc", "genre", "id", "tagFeedback", "tagPin", "tagWip", "title", "url") SELECT "audioAssetId", "authorId", "coverAssetId", "date", "desc", "genre", "id", "tagFeedback", "tagPin", "tagWip", "title", "url" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
