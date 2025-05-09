function inicializarBarbeirosPage() {
  const modal = document.getElementById("modal");
  const abrirModal = document.getElementById("abrirModal");
  const fecharModal = document.querySelector(".close");
  const form = document.getElementById("form");
  const modalTitle = document.getElementById("modal-title");
  const formButton = form.querySelector("button");
  const lista = document.getElementById("lista-barbeiros");
  let editandoId = null;

  // Abre o modal para novo barbeiro
  abrirModal.onclick = () => {
    form.reset();
    editandoId = null;
    modalTitle.textContent = "Novo Barbeiro";
    formButton.textContent = "Salvar";
    modal.style.display = "flex";
  };

  // Fecha modal
  fecharModal.onclick = () => (modal.style.display = "none");
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  // Envia formulário
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const barbeiro = {
      nome: document.getElementById("nome").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      email: document.getElementById("email").value.trim(),
      dataContratacao: document.getElementById("dataContratacao").value,
      ativo: document.getElementById("ativo").value === "true",
      comissao: parseFloat(document.getElementById("comissao").value),
      inicioExpediente: document.getElementById("expedienteInicio").value,
      fimExpediente: document.getElementById("expedienteFim").value,
    };

    // Validação básica
    if (
      Object.values(barbeiro).some(
        (v) => v === "" || v === null || (typeof v === "number" && isNaN(v))
      )
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos obrigatórios",
        text: "Preencha todos os campos corretamente.",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    const url = editandoId
      ? `http://localhost:8080/barbeiro/${editandoId}`
      : "http://localhost:8080/barbeiro";
    const metodo = editandoId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(barbeiro),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: `Barbeiro ${
            editandoId ? "atualizado" : "cadastrado"
          } com sucesso.`,
          confirmButtonColor: "#007bff",
        });
        form.reset();
        modal.style.display = "none";
        carregarBarbeiros();
      } else throw new Error();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro na comunicação com o servidor.",
        confirmButtonColor: "#dc3545",
      });
    }
  });

  // Carrega lista de barbeiros
  async function carregarBarbeiros() {
    try {
      const resposta = await fetch("http://localhost:8080/barbeiro");
      const barbeiros = await resposta.json();
      lista.innerHTML = "";
      barbeiros.forEach(criarElementoBarbeiro);
    } catch (error) {
      console.error("Erro ao carregar barbeiros:", error);
    }
  }

  // Cria o elemento visual de cada barbeiro
  function criarElementoBarbeiro(b) {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="info">
        <strong>Nome:</strong> <span>${b.nome}</span>
        <strong>Telefone:</strong> <span>${b.telefone}</span>
        <strong>Email:</strong> <span>${b.email}</span>
        <strong>Contratação:</strong> <span>${b.dataContratacao}</span>
        <strong>Expediente:</strong> <span>${b.inicioExpediente?.substring(
          0,
          5
        )} - ${b.fimExpediente?.substring(0, 5)}</span>
        <strong>Ativo:</strong> <span>${b.ativo ? "Sim" : "Não"}</span>
        <strong>Comissão:</strong> <span>${b.comissao?.toFixed(2)}%</span>
      </div>
      <div class="botoes">
        <button class="editar" onclick="editarBarbeiro(${b.idBarbeiro}, '${
      b.nome
    }', '${b.telefone}', '${b.email}', '${b.dataContratacao}', ${b.ativo}, ${
      b.comissao
    }, '${b.inicioExpediente}', '${b.fimExpediente}')">✎</button>
        <button class="excluir" onclick="deletarBarbeiro(${
          b.idBarbeiro
        })">✕</button>
      </div>
    `;
    lista.appendChild(li);
  }

  // Função para deletar barbeiro
  async function deletarBarbeiro(id) {
    const confirmacao = await Swal.fire({
      title: "Tem certeza?",
      text: "Deseja realmente excluir este barbeiro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (confirmacao.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/barbeiro/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          Swal.fire("Excluído!", "Barbeiro excluído com sucesso.", "success");
          carregarBarbeiros();
        } else throw new Error();
      } catch (error) {
        Swal.fire("Erro!", "Erro ao se comunicar com o servidor.", "error");
      }
    }
  }

  // Função para editar barbeiro
  function editarBarbeiro(
    id,
    nome,
    telefone,
    email,
    dataContratacao,
    ativo,
    comissao,
    inicioExpediente,
    fimExpediente
  ) {
    document.getElementById("nome").value = nome;
    document.getElementById("telefone").value = telefone;
    document.getElementById("email").value = email;
    document.getElementById("dataContratacao").value = dataContratacao;
    document.getElementById("ativo").value = ativo;
    document.getElementById("comissao").value = comissao;
    document.getElementById("expedienteInicio").value =
      inicioExpediente?.substring(0, 5) || "";
    document.getElementById("expedienteFim").value =
      fimExpediente?.substring(0, 5) || "";

    modalTitle.textContent = "Atualizar Barbeiro";
    formButton.textContent = "Atualizar";
    editandoId = id;
    modal.style.display = "flex";
  }

  // Expondo globalmente para funcionar nos botões
  window.editarBarbeiro = editarBarbeiro;
  window.deletarBarbeiro = deletarBarbeiro;

  // Inicializa a lista ao carregar a página
  carregarBarbeiros();
}

inicializarBarbeirosPage();
