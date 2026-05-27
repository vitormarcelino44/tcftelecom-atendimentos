-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Atendimento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" TEXT,
    "tecnico" TEXT,
    "cliente" TEXT NOT NULL,
    "contato" TEXT,
    "telefone" TEXT,
    "descricao" TEXT,
    "tipo" TEXT NOT NULL,
    "osAberta" TEXT,
    "resolvidoRemoto" TEXT,
    "critico" TEXT,
    "posSuporte" TEXT,
    "status" TEXT NOT NULL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Atendimento" ("cliente", "createdAt", "critico", "descricao", "id", "status", "telefone", "tipo") SELECT "cliente", "createdAt", "critico", "descricao", "id", "status", "telefone", "tipo" FROM "Atendimento";
DROP TABLE "Atendimento";
ALTER TABLE "new_Atendimento" RENAME TO "Atendimento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
