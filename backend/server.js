const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

function normalizarPerfil(perfil) {
  const valor = String(perfil || "Atendente").trim().toLowerCase();
  if (valor.includes("admin")) return "Administrador";
  if (valor.includes("supervisor")) return "Supervisor";
  if (valor.includes("suporte")) return "Suporte";
  if (valor.includes("tecnico") || valor.includes("técnico")) return "Técnico";
  return "Atendente";
}

function limparUsuario(usuario) {
  if (!usuario) return usuario;
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    login: usuario.login,
    perfil: usuario.perfil,
    ativo: usuario.ativo,
    online: usuario.online,
    ultimoLogin: usuario.ultimoLogin,
    createdAt: usuario.createdAt
  };
}

function erroServidor(res, contexto, erro) {
  console.error(contexto, erro);
  return res.status(500).json({ erro: erro.message, code: erro.code, meta: erro.meta });
}

app.get("/", (req, res) => {
  res.send("API TCFTELECOM ONLINE");
});

// ===============================
// ATENDIMENTOS
// ===============================

app.get("/atendimentos", async (req, res) => {
  try {
    const dados = await prisma.atendimento.findMany({ orderBy: { createdAt: "desc" } });
    res.json(dados);
  } catch (erro) {
    erroServidor(res, "ERRO AO LISTAR ATENDIMENTOS:", erro);
  }
});

app.post("/atendimentos", async (req, res) => {
  try {
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
        resolvidoInternamente: req.body.resolvidoInternamente || null,
        critico: req.body.critico || null,
        posSuporte: req.body.posSuporte || null,
        status: req.body.status || null,
        observacoes: req.body.observacoes || null
      }
    });

    res.status(201).json(novo);
  } catch (erro) {
    erroServidor(res, "ERRO AO CRIAR ATENDIMENTO:", erro);
  }
});

app.put("/atendimentos/:id", async (req, res) => {
  try {
    const atualizado = await prisma.atendimento.update({
      where: { id: Number(req.params.id) },
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
        resolvidoInternamente: req.body.resolvidoInternamente || null,
        critico: req.body.critico || null,
        posSuporte: req.body.posSuporte || null,
        status: req.body.status || null,
        observacoes: req.body.observacoes || null
      }
    });

    res.json(atualizado);
  } catch (erro) {
    erroServidor(res, "ERRO AO EDITAR ATENDIMENTO:", erro);
  }
});

app.delete("/atendimentos/:id", async (req, res) => {
  try {
    await prisma.atendimento.delete({ where: { id: Number(req.params.id) } });
    res.json({ sucesso: true });
  } catch (erro) {
    erroServidor(res, "ERRO AO EXCLUIR ATENDIMENTO:", erro);
  }
});

// ===============================
// USUÁRIOS
// ===============================

app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({ orderBy: { createdAt: "desc" } });
    res.json(usuarios.map(limparUsuario));
  } catch (erro) {
    erroServidor(res, "ERRO AO LISTAR USUÁRIOS:", erro);
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, login, senha, perfil } = req.body;

    if (!nome || !email || !login || !senha) {
      return res.status(400).json({ erro: "Nome, e-mail, login e senha são obrigatórios." });
    }

    const existente = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { login }] }
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
        perfil: normalizarPerfil(perfil),
        ativo: true,
        online: false
      }
    });

    res.status(201).json(limparUsuario(usuario));
  } catch (erro) {
    erroServidor(res, "ERRO AO CRIAR USUÁRIO:", erro);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { login, senha } = req.body;

    if (!login || !senha) {
      return res.status(400).json({ erro: "Login e senha são obrigatórios." });
    }

    const usuario = await prisma.usuario.findFirst({ where: { login, senha } });

    if (!usuario) {
      return res.status(401).json({ erro: "Usuário ou senha incorretos." });
    }

    if (!usuario.ativo) {
      return res.status(403).json({ erro: "Usuário bloqueado pelo administrador." });
    }

    const atualizado = await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoLogin: new Date(), online: true }
    });

    res.json({ sucesso: true, usuario: limparUsuario(atualizado) });
  } catch (erro) {
    erroServidor(res, "ERRO AO FAZER LOGIN:", erro);
  }
});

app.post("/logout", async (req, res) => {
  try {
    const { id, login } = req.body;
    const where = id ? { id: Number(id) } : login ? { login } : null;
    if (!where) return res.status(400).json({ erro: "Informe id ou login do usuário." });

    const atualizado = await prisma.usuario.update({ where, data: { online: false } });
    res.json({ sucesso: true, usuario: limparUsuario(atualizado) });
  } catch (erro) {
    erroServidor(res, "ERRO AO SAIR DO SISTEMA:", erro);
  }
});

app.put("/usuarios/:id", async (req, res) => {
  try {
    const dadosAtualizacao = {};
    ["nome", "email", "login", "senha", "ativo", "online"].forEach((campo) => {
      if (req.body[campo] !== undefined) dadosAtualizacao[campo] = req.body[campo];
    });
    if (req.body.perfil !== undefined) dadosAtualizacao.perfil = normalizarPerfil(req.body.perfil);

    const atualizado = await prisma.usuario.update({
      where: { id: Number(req.params.id) },
      data: dadosAtualizacao
    });

    res.json(limparUsuario(atualizado));
  } catch (erro) {
    erroServidor(res, "ERRO AO EDITAR USUÁRIO:", erro);
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  try {
    await prisma.usuario.delete({ where: { id: Number(req.params.id) } });
    res.json({ sucesso: true });
  } catch (erro) {
    erroServidor(res, "ERRO AO EXCLUIR USUÁRIO:", erro);
  }
});

// ===============================
// RECUPERAÇÃO DE SENHA
// ===============================

app.post("/recuperar-senha", async (req, res) => {
  try {
    const { login, email } = req.body;
    if (!login && !email) {
      return res.status(400).json({ erro: "Informe login ou e-mail." });
    }

    const usuario = await prisma.usuario.findFirst({
      where: { OR: [{ login: login || "" }, { email: email || "" }] }
    });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const token = crypto.randomBytes(24).toString("hex");
    const resetExpira = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { resetToken: token, resetExpira }
    });

    // Sem serviço de e-mail configurado ainda: o token volta na resposta para uso interno/teste.
    res.json({ sucesso: true, token, expiraEm: resetExpira });
  } catch (erro) {
    erroServidor(res, "ERRO AO GERAR RECUPERAÇÃO DE SENHA:", erro);
  }
});

app.post("/redefinir-senha", async (req, res) => {
  try {
    const { token, senha } = req.body;
    if (!token || !senha) return res.status(400).json({ erro: "Token e nova senha são obrigatórios." });
    if (String(senha).length < 4) return res.status(400).json({ erro: "A senha precisa ter pelo menos 4 caracteres." });

    const usuario = await prisma.usuario.findFirst({ where: { resetToken: token } });
    if (!usuario) return res.status(404).json({ erro: "Token inválido." });
    if (usuario.resetExpira && usuario.resetExpira < new Date()) {
      return res.status(410).json({ erro: "Token expirado." });
    }

    const atualizado = await prisma.usuario.update({
      where: { id: usuario.id },
      data: { senha, resetToken: null, resetExpira: null }
    });

    res.json({ sucesso: true, usuario: limparUsuario(atualizado) });
  } catch (erro) {
    erroServidor(res, "ERRO AO REDEFINIR SENHA:", erro);
  }
});

// ===============================
// CONVITES POR LINK
// ===============================

app.get("/convites", async (req, res) => {
  try {
    const convites = await prisma.convite.findMany({ orderBy: { createdAt: "desc" } });
    res.json(convites);
  } catch (erro) {
    erroServidor(res, "ERRO AO LISTAR CONVITES:", erro);
  }
});

app.post("/convites", async (req, res) => {
  try {
    const token = crypto.randomBytes(24).toString("hex");
    const dias = Number(req.body.diasValidade || 7);
    const expiraEm = new Date(Date.now() + 1000 * 60 * 60 * 24 * dias);

    const convite = await prisma.convite.create({
      data: {
        token,
        nome: req.body.nome || null,
        email: req.body.email || null,
        login: req.body.login || null,
        perfil: normalizarPerfil(req.body.perfil),
        criadoPor: req.body.criadoPor || null,
        expiraEm
      }
    });

    res.status(201).json(convite);
  } catch (erro) {
    erroServidor(res, "ERRO AO GERAR CONVITE:", erro);
  }
});

app.get("/convites/:token", async (req, res) => {
  try {
    const convite = await prisma.convite.findUnique({ where: { token: req.params.token } });
    if (!convite) return res.status(404).json({ erro: "Convite não encontrado." });
    res.json(convite);
  } catch (erro) {
    erroServidor(res, "ERRO AO CONSULTAR CONVITE:", erro);
  }
});

app.post("/convites/usar", async (req, res) => {
  try {
    const { token, nome, email, login, senha } = req.body;
    if (!token || !nome || !email || !login || !senha) {
      return res.status(400).json({ erro: "Token, nome, e-mail, login e senha são obrigatórios." });
    }

    const convite = await prisma.convite.findUnique({ where: { token } });
    if (!convite) return res.status(404).json({ erro: "Convite não encontrado." });
    if (convite.usado) return res.status(409).json({ erro: "Este convite já foi usado." });
    if (convite.expiraEm && convite.expiraEm < new Date()) return res.status(410).json({ erro: "Este convite expirou." });

    const existente = await prisma.usuario.findFirst({ where: { OR: [{ email }, { login }] } });
    if (existente) return res.status(409).json({ erro: "Já existe usuário com este login ou e-mail." });

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        login,
        senha,
        perfil: normalizarPerfil(convite.perfil),
        ativo: true,
        online: false
      }
    });

    await prisma.convite.update({ where: { id: convite.id }, data: { usado: true, usadoEm: new Date() } });

    res.status(201).json({ sucesso: true, usuario: limparUsuario(usuario) });
  } catch (erro) {
    erroServidor(res, "ERRO AO USAR CONVITE:", erro);
  }
});

app.delete("/convites/:id", async (req, res) => {
  try {
    await prisma.convite.delete({ where: { id: Number(req.params.id) } });
    res.json({ sucesso: true });
  } catch (erro) {
    erroServidor(res, "ERRO AO EXCLUIR CONVITE:", erro);
  }
});

const PORT = process.env.PORT || 3000;

process.on("uncaughtException", (err) => console.error("ERRO GERAL:", err));
process.on("unhandledRejection", (err) => console.error("PROMISE ERROR:", err));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
