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

// ===============================
// ATENDIMENTOS
// ===============================

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
    console.error("ERRO AO LISTAR ATENDIMENTOS:", erro);
    res.status(500).json({ erro: erro.message });
  }
});

// CRIAR
app.post("/atendimentos", async (req, res) => {
  try {
    console.log("DADOS RECEBIDOS NO POST:", req.body);

    const novo = await prisma.atendimento.create({
      data: {
        data: req.body.data || null,
        tecnico: req.body.tecnico || null,
        cliente: req.body.cliente || null,
        contato: req.body.contato || null,
        telefone: req.body.telefone || null,
        descricao: req.body.descricao || null,
        tipo: req.body.tipo || null,
        osAberta: req.body.osAberta || null,
        resolvidoRemoto: req.body.resolvidoRemoto || null,
        critico: req.body.critico || null,
        posSuporte: req.body.posSuporte || null,
        status: req.body.status || null,
        observacoes: req.body.observacoes || null
      }
    });

    res.status(201).json(novo);
  } catch (erro) {
    console.error("ERRO AO CRIAR ATENDIMENTO:", erro);
    res.status(500).json({ erro: erro.message, code: erro.code, meta: erro.meta });
  }
});

// EDITAR
app.put("/atendimentos/:id", async (req, res) => {
  try {
    const atualizado = await prisma.atendimento.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        data: req.body.data || null,
        tecnico: req.body.tecnico || null,
        cliente: req.body.cliente || null,
        contato: req.body.contato || null,
        telefone: req.body.telefone || null,
        descricao: req.body.descricao || null,
        tipo: req.body.tipo || null,
        osAberta: req.body.osAberta || null,
        resolvidoRemoto: req.body.resolvidoRemoto || null,
        critico: req.body.critico || null,
        posSuporte: req.body.posSuporte || null,
        status: req.body.status || null,
        observacoes: req.body.observacoes || null
      }
    });

    res.json(atualizado);
  } catch (erro) {
    console.error("ERRO AO EDITAR ATENDIMENTO:", erro);
    res.status(500).json({ erro: erro.message, code: erro.code, meta: erro.meta });
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

    res.json({ sucesso: true });
  } catch (erro) {
    console.error("ERRO AO EXCLUIR ATENDIMENTO:", erro);
    res.status(500).json({ erro: erro.message, code: erro.code, meta: erro.meta });
  }
});

// ===============================
// USUÁRIOS
// ===============================

// LISTAR USUÁRIOS
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(usuarios);
  } catch (erro) {
    console.error("ERRO AO LISTAR USUÁRIOS:", erro);
    res.status(500).json({ erro: erro.message, code: erro.code, meta: erro.meta });
  }
});

// CRIAR USUÁRIO
app.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, login, senha, perfil } = req.body;

    if (!nome || !email || !login || !senha) {
      return res.status(400).json({ erro: "Nome, e-mail, login e senha são obrigatórios." });
    }

    const existente = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email },
          { login }
        ]
      }
    });

    if (existente) {
      return res.status(409).json({ erro: "Já existe usuário com este login ou e-mail." });
    }

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        login,
        senha,
        perfil: perfil || "atendente",
        ativo: true
      }
    });

    res.status(201).json(usuario);
  } catch (erro) {
    console.error("ERRO AO CRIAR USUÁRIO:", erro);
    res.status(500).json({ erro: erro.message, code: erro.code, meta: erro.meta });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { login, senha } = req.body;

    if (!login || !senha) {
      return res.status(400).json({ erro: "Login e senha são obrigatórios." });
    }

    const usuario = await prisma.usuario.findFirst({
      where: {
        login,
        senha
      }
    });

    if (!usuario) {
      return res.status(401).json({ erro: "Usuário ou senha incorretos." });
    }

    if (!usuario.ativo) {
      return res.status(403).json({ erro: "Usuário bloqueado pelo administrador." });
    }

    const atualizado = await prisma.usuario.update({
      where: {
        id: usuario.id
      },
      data: {
        ultimoLogin: new Date()
      }
    });

    res.json({ sucesso: true, usuario: atualizado });
  } catch (erro) {
    console.error("ERRO AO FAZER LOGIN:", erro);
    res.status(500).json({ erro: erro.message, code: erro.code, meta: erro.meta });
  }
});

// EDITAR USUÁRIO
app.put("/usuarios/:id", async (req, res) => {
  try {
    const dadosAtualizacao = {};
    ["nome", "email", "login", "senha", "perfil", "ativo"].forEach((campo) => {
      if (req.body[campo] !== undefined) dadosAtualizacao[campo] = req.body[campo];
    });

    const atualizado = await prisma.usuario.update({
      where: {
        id: Number(req.params.id)
      },
      data: dadosAtualizacao
    });

    res.json(atualizado);
  } catch (erro) {
    console.error("ERRO AO EDITAR USUÁRIO:", erro);
    res.status(500).json({ erro: erro.message, code: erro.code, meta: erro.meta });
  }
});

// EXCLUIR USUÁRIO
app.delete("/usuarios/:id", async (req, res) => {
  try {
    await prisma.usuario.delete({
      where: {
        id: Number(req.params.id)
      }
    });

    res.json({ sucesso: true });
  } catch (erro) {
    console.error("ERRO AO EXCLUIR USUÁRIO:", erro);
    res.status(500).json({ erro: erro.message, code: erro.code, meta: erro.meta });
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
