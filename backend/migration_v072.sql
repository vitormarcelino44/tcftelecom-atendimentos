-- TCFTELECOM v072
-- Executar no Supabase SQL Editor ou aplicar com Prisma db push.

ALTER TABLE "Atendimento"
ADD COLUMN IF NOT EXISTS "resolvidoInternamente" TEXT;

ALTER TABLE "Usuario"
ADD COLUMN IF NOT EXISTS "online" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Usuario"
ADD COLUMN IF NOT EXISTS "resetToken" TEXT;

ALTER TABLE "Usuario"
ADD COLUMN IF NOT EXISTS "resetExpira" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "Usuario_resetToken_key" ON "Usuario"("resetToken");

CREATE TABLE IF NOT EXISTS "Convite" (
  "id" SERIAL PRIMARY KEY,
  "token" TEXT NOT NULL UNIQUE,
  "nome" TEXT,
  "email" TEXT,
  "login" TEXT,
  "perfil" TEXT NOT NULL DEFAULT 'Atendente',
  "usado" BOOLEAN NOT NULL DEFAULT false,
  "usadoEm" TIMESTAMP(3),
  "expiraEm" TIMESTAMP(3),
  "criadoPor" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
