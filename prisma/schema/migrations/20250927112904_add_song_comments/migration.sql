-- CreateTable
CREATE TABLE "SongComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "songId" TEXT NOT NULL,
    "songTime" REAL NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "SongComment_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
