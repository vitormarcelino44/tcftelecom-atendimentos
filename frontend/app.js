const API_URL = "https://tcftelecom-atendimentos-production.up.railway.app";
async function carregarAtendimentos() {

  const resultado =
    document.getElementById("resultado");

  resultado.innerHTML = "Carregando...";

  try {

    const resposta =
      await fetch(`${API_URL}/atendimentos`);

    const dados = await resposta.json();

    resultado.innerHTML = "";

    dados.forEach(item => {

      resultado.innerHTML += `
        <div class="card">
          <h3>${item.cliente}</h3>
          <p>${item.descricao}</p>
        </div>
      `;

    });

  } catch (erro) {

    resultado.innerHTML =
      "Erro ao conectar API.";

    console.error(erro);
  }
}

async function criarAtendimento() {

  const cliente =
    document.getElementById("cliente").value;

  const descricao =
    document.getElementById("descricao").value;

  try {

    await fetch(`${API_URL}/atendimentos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cliente,
        descricao
      })
    });

    carregarAtendimentos();

  } catch (erro) {

    console.error(erro);

  }
}