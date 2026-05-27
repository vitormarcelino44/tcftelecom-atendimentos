const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API TCFTELECOM ONLINE");
});

// LISTAR
app.get("/atendimentos", async (req, res) => {
  const dados = await prisma.atendimento.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(dados);
});

// CRIAR
app.post("/atendimentos", async (req, res) => {
  const atendimento =
    await prisma.atendimento.create({
      data: req.body
    });

  res.json(atendimento);
});

// EDITAR
app.put("/atendimentos/:id", async (req, res) => {
  const id = Number(req.params.id);

  const atualizado =
    await prisma.atendimento.update({
      where: { id },
      data: req.body
    });

  res.json(atualizado);
});

// EXCLUIR
app.delete("/atendimentos/:id", async (req, res) => {
  const id = Number(req.params.id);

  await prisma.atendimento.delete({
    where: { id }
  });

  res.json({
    sucesso: true
  });
});

app.listen(3000, () => {
  console.log(
    "Servidor rodando → http://localhost:3000"
  );
});