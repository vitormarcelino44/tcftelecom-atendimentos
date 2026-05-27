-- CreateTable
CREATE TABLE "Atendimento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cliente" TEXT NOT NULL,
    "telefone" TEXT,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "critico" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
