const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// TESTE
app.get("/", (req, res) => {
  res.send("API TCFTELECOM ONLINE");
});

// LISTAR
app.get("/atendimentos", async (req, res) => {
  try {
    const dados = await prisma.atendimento.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(dados);

  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
});

// CRIAR
app.post("/atendimentos", async (req, res) => {
  try {

    const novo =
      await prisma.atendimento.create({
        data: req.body
      });

    res.json(novo);

  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
});

// EDITAR
app.put("/atendimentos/:id", async (req, res) => {
  try {

    const atualizado =
      await prisma.atendimento.update({
        where: {
          id: Number(req.params.id)
        },
        data: req.body
      });

    res.json(atualizado);

  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
});

// EXCLUIR
app.delete("/atendimentos/:id", async (req, res) => {
  try {

    await prisma.atendimento.delete({
      where: {
        id: Number(req.params.id)
      }
    });

    res.json({
      sucesso: true
    });

  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
});
const PORT = process.env.PORT || 3000;

process.on("uncaughtException", (err) => {
  console.error("ERRO GERAL:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("PROMISE ERROR:", err);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
