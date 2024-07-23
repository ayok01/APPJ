-- CreateTable
CREATE TABLE "Article" (
    "articleId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorId" INTEGER NOT NULL,
    "articleType" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "avater" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL
);
