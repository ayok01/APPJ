-- CreateTable
CREATE TABLE "Article" (
    "articleId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "thumbnail" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    CONSTRAINT "Article_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "avater" TEXT NOT NULL,
    "introduction" TEXT NOT NULL
);
