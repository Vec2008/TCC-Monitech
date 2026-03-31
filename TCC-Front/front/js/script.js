// ===================================================
// ESTADO GLOBAL DA APLICAÇÃO
// Pronto para integração com banco de dados.
// Substitua as chamadas localStorage por requisições fetch() à API.
// ===================================================
let appState = {
  usuario: null,
  residencia: null,
  comodos: [],
  dispositivos: [],
  leituras: [],
  alertas: [],
  dadosAoVivo: { volts: 0, amps: 0, watts: 0, pf: 0, freq: 0, kwh: 0 }
};

const CHAVE_TEMA_SITE = 'tema-site';

// ===================================================
// SISTEMA DE ALERTAS CUSTOMIZADOS
// ===================================================

let alertContainer = null;

/** Inicializa o container de alertas */
function inicializarContainerAlertas() {
  if (!alertContainer) {
    alertContainer = document.createElement('div');
    alertContainer.id = 'alerts-container';
    alertContainer.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
      pointer-events: none;
    `;
    document.body.appendChild(alertContainer);
  }
}

/**
 * Exibe um alerta customizado
 * @param {string} tipo - 'success', 'error', 'warning', 'info'
 * @param {string} titulo - Título do alerta
 * @param {string} mensagem - Mensagem do alerta
 * @param {number} duracao - Duração em ms (0 = não fecha automaticamente)
 */
function mostrarAlerta(tipo = 'info', titulo = '', mensagem = '', duracao = 5000) {
  inicializarContainerAlertas();

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const colors = {
    success: 'var(--success)',
    error: 'var(--danger)',
    warning: 'var(--warn)',
    info: 'var(--cyan)'
  };

  const alerta = document.createElement('div');
  alerta.className = `alert alert-${tipo}`;
  alerta.innerHTML = `
    <div class="alert-icon">${icons[tipo] || icons.info}</div>
    <div class="alert-content">
      ${titulo ? `<div class="alert-title">${titulo}</div>` : ''}
      ${mensagem ? `<div class="alert-message">${mensagem}</div>` : ''}
    </div>
    <button class="alert-close" onclick="this.parentElement.remove()">×</button>
  `;

  alerta.style.cssText = `
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: var(--bg-card);
    border: 1px solid ${colors[tipo]};
    border-left: 4px solid ${colors[tipo]};
    border-radius: 8px;
    padding: 16px;
    font-size: 13px;
    color: var(--text-primary);
    animation: slideInRight 0.3s ease-out;
    pointer-events: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;

  // Estilo do ícone
  const iconEl = alerta.querySelector('.alert-icon');
  iconEl.style.cssText = `
    font-size: 20px;
    color: ${colors[tipo]};
    font-weight: bold;
    flex-shrink: 0;
    min-width: 24px;
    text-align: center;
  `;

  // Estilo do conteúdo
  const contentEl = alerta.querySelector('.alert-content');
  contentEl.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `;

  // Estilo do título
  const titleEl = alerta.querySelector('.alert-title');
  if (titleEl) {
    titleEl.style.cssText = `
      font-weight: 600;
      color: ${colors[tipo]};
    `;
  }

  // Estilo da mensagem
  const msgEl = alerta.querySelector('.alert-message');
  if (msgEl) {
    msgEl.style.cssText = `
      color: var(--text-secondary);
      font-size: 12px;
    `;
  }

  // Estilo do botão fechar
  const closeBtn = alerta.querySelector('.alert-close');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: ${colors[tipo]};
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    margin: -4px -8px -4px 0;
    opacity: 0.7;
    transition: opacity 0.2s;
    flex-shrink: 0;
  `;
  closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
  closeBtn.onmouseout = () => closeBtn.style.opacity = '0.7';

  alertContainer.appendChild(alerta);

  // Auto-remover após duracao
  if (duracao > 0) {
    setTimeout(() => {
      alerta.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => alerta.remove(), 300);
    }, duracao);
  }

  return alerta;
}

/** Exibe alerta de sucesso */
function alertaSucesso(titulo, mensagem = '', duracao = 4000) {
  return mostrarAlerta('success', titulo, mensagem, duracao);
}

/** Exibe alerta de erro */
function alertaErro(titulo, mensagem = '', duracao = 5000) {
  return mostrarAlerta('error', titulo, mensagem, duracao);
}

/** Exibe alerta de aviso */
function alertaAviso(titulo, mensagem = '', duracao = 5000) {
  return mostrarAlerta('warning', titulo, mensagem, duracao);
}

/** Exibe alerta informativo */
function alertaInfo(titulo, mensagem = '', duracao = 4000) {
  return mostrarAlerta('info', titulo, mensagem, duracao);
}


// ===================================================
// STUBS DE API — Substitua por chamadas fetch() reais
// ===================================================
const API = {
  // POST /api/auth/cadastro
  cadastrar: async (dados) => {
    return { sucesso: true, usuario: { id: 'u1', ...dados } };
  },

  // POST /api/auth/login
  login: async (email, senha) => {
    return { sucesso: true, usuario: { id: 'u1', nome: 'Usuário Demo', email } };
  },

  // POST /api/residencia
  salvarResidencia: async (dados) => {
    return { sucesso: true, residencia: { id: 'r1', ...dados } };
  },

  // GET /api/comodos/:idResidencia
  obterComodos: async () => {
    return { comodos: appState.comodos };
  },

  // POST /api/comodos
  adicionarComodo: async (dados) => {
    return { sucesso: true, comodo: { id: 'c' + Date.now(), ...dados } };
  },

  // GET /api/dispositivos/:idResidencia
  obterDispositivos: async () => {
    return { dispositivos: appState.dispositivos };
  },

  // POST /api/dispositivos
  adicionarDispositivo: async (dados) => {
    return { sucesso: true, dispositivo: { id: 'd' + Date.now(), ...dados } };
  },

  // GET /api/leituras/aovivo/:idDispositivo
  obterLeituraAoVivo: async () => {
    return { dados: appState.dadosAoVivo };
  },

  // GET /api/leituras/historico?periodo=dia
  obterHistorico: async (periodo) => {
    return { dados: gerarHistoricoSimulado(periodo) };
  },

  // POST /api/alertas/config
  salvarConfiguracaoAlertas: async (config) => {
    return { sucesso: true };
  }
};


// ===================================================
// GERADORES DE DADOS SIMULADOS
// Estes dados serão substituídos pelas leituras reais do dispositivo
// ===================================================

/**
 * Gera histórico simulado de leituras para um dado período.
 * @param {string} periodo - 'day', 'week' ou 'month'
 * @returns {Array} Array de objetos com dados simulados zerados (aguardando dispositivo real)
 */
function gerarHistoricoSimulado(periodo = 'day') {
  const totalPontos = periodo === 'day' ? 24 : periodo === 'week' ? 7 : 30;

  return Array.from({ length: totalPontos }, (_, i) => ({
    label: periodo === 'day'
      ? `${i}h`
      : periodo === 'week'
        ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i % 7]
        : `${i + 1}`,
    kwh: 0,
    custo: 0,
    volts: 0,
    amps: 0,
    watts: 0
  }));
}

/** Retorna mapa de ícones por tipo de cômodo */
function obterIconesComodos() {
  return {
    sala: '🛋️',
    quarto: '🛏️',
    cozinha: '🍳',
    banheiro: '🚿',
    garagem: '🚗',
    escritorio: '💻',
    lavanderia: '👕',
    varanda: '🌿',
    outro: '📦'
  };
}

/** Retorna mapa de ícones por tipo de dispositivo */
function obterIconesDispositivos() {
  return {
    ar: '❄️',
    geladeira: '🧊',
    tv: '📺',
    maquina: '👕',
    chuveiro: '🚿',
    computador: '💻',
    microondas: '📡',
    iluminacao: '💡',
    bomba: '💧',
    outro: '🔌'
  };
}


// ===================================================
// ROTEAMENTO DE PÁGINAS E ABAS
// ===================================================

/**
 * Exibe a página solicitada e oculta todas as demais.
 * @param {string} idPagina - ID da div de página a exibir
 */
function mostrarPagina(idPagina) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pagina = document.getElementById(idPagina);
  if (pagina) {
    pagina.classList.add('active');
    corrigirTextosCorrompidosNaPagina(pagina);
  }
}

/**
 * Exibe a aba de conteúdo da aplicação solicitada.
 * @param {string} nomeAba - Nome da aba (dashboard, planta, rooms, devices, reports, alerts, esp32, settings)
 */
function exibirAba(nomeAba) {
  // Oculta todas as views e remove destaque dos tabs
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  // Ativa a view e o tab selecionados
  const viewEl = document.getElementById('view-' + nomeAba);
  const tabEl = document.getElementById('tab-' + nomeAba);
  if (viewEl) viewEl.classList.add('active');
  if (tabEl) tabEl.classList.add('active');

  // Inicializa os componentes específicos de cada aba
  switch (nomeAba) {
    case 'dashboard': inicializarGraficos(); break;
    case 'planta': renderizarPlanta(); break;
    case 'rooms': renderizarComodos(); break;
    case 'devices': renderizarDispositivos(); break;
    case 'reports': inicializarGraficosRelatorio(); break;
    case 'alerts': renderizarAlertas(); break;
    case 'account': carregarDadosConta(); break;
    case 'settings': carregarDadosConfiguracoes(); break;
    case 'esp32':
      if (!window.esp32TabAberta) inicializarAbaEsp32();
      break;
  }

  corrigirTextosCorrompidosNaPagina(viewEl || document.body);
}


// ===================================================
// AUTENTICAÇÃO
// ===================================================

/** Realiza o login do usuário com as credenciais informadas */
async function fazerLogin() {
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-pass').value;

  if (!email || !senha) {
    alert('Por favor, preencha o e-mail e a senha para continuar.');
    return;
  }

  const resposta = await API.login(email, senha);

  if (resposta.sucesso) {
    appState.usuario = resposta.usuario;
    carregarDadosDemo();
    entrarNoApp();
    atualizarIndicadorUsuario();
  } else {
    alert('E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.');
  }
}

/** Realiza o cadastro de um novo usuário */
async function cadastrarUsuario() {
  const nome = document.getElementById('reg-name').value.trim();
  const sobrenome = document.getElementById('reg-lastname').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const senha = document.getElementById('reg-pass').value;
  const confirmar = document.getElementById('reg-pass2').value;

  if (!nome || !email || !senha) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  if (senha !== confirmar) {
    alert('As senhas informadas não coincidem. Verifique e tente novamente.');
    return;
  }

  if (senha.length < 8) {
    alert('A senha deve ter no mínimo 8 caracteres.');
    return;
  }

  const nomeCompleto = [nome, sobrenome].filter(Boolean).join(' ');
  const resposta = await API.cadastrar({ nome: nomeCompleto, email, senha });

  if (resposta.sucesso) {
    appState.usuario = resposta.usuario;
    mostrarPagina('page-onboard');
    atualizarPassosOnboarding(0);
  }
}


// ===================================================
// MENU SUSPENSO DO USUÁRIO
// ===================================================

/** Alterna a visibilidade do menu suspenso do usuário */
function alternarMenuUsuario() {
  const botao = document.querySelector('.user-menu-btn');
  const menu = document.getElementById('user-dropdown');
  const ativo = menu.classList.toggle('active');
  botao.classList.toggle('active', ativo);
}

/** Fecha o menu suspenso do usuário */
function fecharMenuUsuario() {
  const botao = document.querySelector('.user-menu-btn');
  const menu = document.getElementById('user-dropdown');
  menu.classList.remove('active');
  botao.classList.remove('active');
}

/** Navega para a página de conta do usuário */
function irParaConta() {
  fecharMenuUsuario();
  exibirAba('account');
  carregarDadosConta();
}


// ===================================================
// ABA: MINHA CONTA
// ===================================================

/** Carrega os dados da conta do usuário nos campos do formulário */
function carregarDadosConta() {
  if (appState.usuario) {
    document.getElementById('account-name').value = appState.usuario.nome || '';
    document.getElementById('account-email').value = appState.usuario.email || '';
    document.getElementById('account-phone').value = appState.usuario.telefone || '';
    document.getElementById('account-birth').value = appState.usuario.dataNascimento || '';
    document.getElementById('account-gender').value = appState.usuario.genero || '';
    document.getElementById('account-name-display').textContent = appState.usuario.nome || 'Usuário';
    document.getElementById('account-email-display').textContent = appState.usuario.email || '---';

    // Carrega estatísticas da conta\n    document.getElementById('account-residences-count').textContent = appState.residencia ? '1' : '0';
    document.getElementById('account-devices-count').textContent = appState.dispositivos.length;
  }

  // Carrega as preferências de notificações
  const notificacoes = JSON.parse(localStorage.getItem('notificacoes') || '{}');
  document.getElementById('notify-email-alerts').checked = notificacoes.email_alertas !== false;
  document.getElementById('notify-email-summary').checked = notificacoes.email_summary !== false;
  document.getElementById('notify-browser').checked = notificacoes.browser_alertas !== false;
  document.getElementById('notify-sound').checked = notificacoes.browser_som === true;
  document.getElementById('account-summary-frequency').value = notificacoes.frequencia || 'weekly';
}

/** Salva as alterações das informações pessoais da conta */
function salvarAlteracoesConta() {
  const nome = document.getElementById('account-name').value.trim();
  const telefone = document.getElementById('account-phone').value.trim();
  const dataNascimento = document.getElementById('account-birth').value;
  const genero = document.getElementById('account-gender').value;

  if (!nome) {
    alert('Por favor, informe seu nome completo.');
    return;
  }

  // Atualiza o estado da aplicação
  appState.usuario.nome = nome;
  appState.usuario.telefone = telefone;
  appState.usuario.dataNascimento = dataNascimento;
  appState.usuario.genero = genero;

  // Atualiza os displays na aba
  document.getElementById('account-name-display').textContent = nome;

  // Atualiza o indicador na barra superior
  atualizarIndicadorUsuario();

  alert('✓ Informações pessoais atualizadas com sucesso!');
}

/** Altera a senha do usuário */
function alterarSenhaConta() {
  const senhaAtual = document.getElementById('account-pass-current').value;
  const novaSenha = document.getElementById('account-pass-new').value;
  const confirmarSenha = document.getElementById('account-pass-confirm').value;

  if (!senhaAtual || !novaSenha || !confirmarSenha) {
    alert('Por favor, preencha todos os campos para alterar a senha.');
    return;
  }

  if (novaSenha !== confirmarSenha) {
    alert('A nova senha e a confirmação não coincidem. Tente novamente.');
    return;
  }

  if (novaSenha.length < 8) {
    alert('A nova senha deve ter no mínimo 8 caracteres.');
    return;
  }

  // TODO: Validar senha atual e atualizar via API
  // POST /api/auth/alterarSenha

  alert('✓ Senha alterada com sucesso! Faça login novamente na próxima vez.');

  // Limpa os campos após a alteração
  document.getElementById('account-pass-current').value = '';
  document.getElementById('account-pass-new').value = '';
  document.getElementById('account-pass-confirm').value = '';
}

/** Salva as preferências de notificação do usuário */
function salvarNotificacoesConta() {
  const configuracao = {
    email_alertas: document.getElementById('notify-email-alerts').checked,
    email_summary: document.getElementById('notify-email-summary').checked,
    browser_alertas: document.getElementById('notify-browser').checked,
    browser_som: document.getElementById('notify-sound').checked,
    frequencia: document.getElementById('account-summary-frequency').value
  };

  localStorage.setItem('notificacoes', JSON.stringify(configuracao));
  alert('✓ Preferências de notificação salvas com sucesso!');
}

/** Ativa a autenticação de dois fatores */
function ativar2FA() {
  alert('🔐 Autenticação de Dois Fatores\n\nA ativação de 2FA ainda não está disponível nesta versão.\nAcompanhe as atualizações do sistema para maior segurança!');
}

/** Exporta os dados da conta do usuário */
function exportarMeusDados() {
  const dados = {
    usuario: appState.usuario,
    residencia: appState.residencia,
    comodos: appState.comodos,
    dispositivos: appState.dispositivos,
    dataExportacao: new Date().toISOString()
  };

  const json = JSON.stringify(dados, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `monitech-conta-${Date.now()}.json`;
  link.click();

  alert('✓ Dados exportados com sucesso! O arquivo foi salvo em seus downloads.');
}

/** Inicia o processo de exclusão da conta */
function iniciarExclusaoConta() {
  const confirmacao1 = confirm(
    '⚠️ ATENÇÃO: Deletar conta\n\n' +
    'Tem certeza que deseja excluir sua conta permanentemente?\n\n' +
    'Esta ação é IRREVERSÍVEL e apagará:\n' +
    '• Todas as suas informações pessoais\n' +
    '• Todas as residências configuradas\n' +
    '• Histórico completo de consumo\n\n' +
    'Deseja continuar?'
  );

  if (confirmacao1) {
    const confirmacao2 = confirm(
      '🔴 CONFIRMAÇÃO FINAL\n\n' +
      'Esta é sua última chance para cancelar.\n\n' +
      'Clique \"OK\" para excluir permanentemente sua conta e todos os dados associados.'
    );

    if (confirmacao2) {
      // TODO: DELETE /api/usuarios/:id
      alert('✓ Sua conta foi excluída com sucesso.\n\nObrigado por usar o MONITECH! Você será desconectado agora.');
      sair();
    }
  }
}

/** Atualiza o avatar de perfil ao selecionar uma imagem */
function atualizarAvatarConta() {
  const arquivo = document.getElementById('account-avatar-input').files[0];

  if (arquivo) {
    // Valida o tamanho (máximo 5MB)
    if (arquivo.size > 5 * 1024 * 1024) {
      alert('⚠️ Arquivo muito grande! O tamanho máximo é 5MB.');
      return;
    }

    const leitor = new FileReader();
    leitor.onload = (e) => {
      const avatar = document.getElementById('account-avatar');
      avatar.style.backgroundImage = `url('${e.target.result}')`;
      avatar.style.backgroundSize = 'cover';
      avatar.style.backgroundPosition = 'center';
      avatar.textContent = '';
      alert('✓ Foto de perfil atualizada com sucesso!');
    };
    leitor.readAsDataURL(arquivo);
  }
}

/** Navega para a aba de configurações */
function irParaConfiguracoes() {
  fecharMenuUsuario();
  exibirAba('settings');
  carregarDadosConfiguracoes();
}

/** Atualiza o badge de nome do usuário logado na barra superior */
function atualizarIndicadorUsuario() {
  const elementoNome = document.getElementById('user-badge-text');

  if (appState.usuario && appState.usuario.nome) {
    const primeiroNome = appState.usuario.nome.split(' ')[0];
    elementoNome.textContent = '👤 ' + primeiroNome;
  } else {
    elementoNome.textContent = '👤 Usuário';
  }
}

/** Encerra a sessão do usuário e retorna à tela de login */
function sair() {
  appState = {
    usuario: null,
    residencia: null,
    comodos: [],
    dispositivos: [],
    leituras: [],
    alertas: [],
    dadosAoVivo: { volts: 0, amps: 0, watts: 0, pf: 0, freq: 0, kwh: 0 }
  };

  fecharMenuUsuario();
  destruirGraficos();
  mostrarPagina('page-login');
}


// ===================================================
// ABA DE CONFIGURAÇÕES
// ===================================================

/**
 * Exibe o painel de configurações da aba selecionada.
 * @param {string} nomeAba - Nome do painel (profile, house, notifications, personalization, security, billing, about)
 */
function exibirAbaConfiguracoes(nomeAba) {
  document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));

  const painel = document.getElementById('panel-' + nomeAba);
  const aba = document.getElementById('tab-' + nomeAba);
  if (painel) painel.classList.add('active');
  if (aba) aba.classList.add('active');
}

/** Retorna o tema salvo no navegador */
function obterTemaSalvo() {
  const tema = localStorage.getItem(CHAVE_TEMA_SITE);
  return tema === 'light' ? 'light' : 'dark';
}

/** Atualiza os controles visuais da aba de personalização */
function atualizarControlesTema(tema) {
  const opcaoSelecionada = document.querySelector(`input[name="theme-preference"][value="${tema}"]`);
  if (opcaoSelecionada) opcaoSelecionada.checked = true;

  const indicadorTema = document.getElementById('theme-current-label');
  if (indicadorTema) indicadorTema.textContent = tema === 'light' ? 'Claro' : 'Escuro';
}

/** Aplica o tema escolhido em toda a interface */
function aplicarTema(tema, persistir = true) {
  const temaNormalizado = tema === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', temaNormalizado);

  if (persistir) {
    localStorage.setItem(CHAVE_TEMA_SITE, temaNormalizado);
  }

  atualizarControlesTema(temaNormalizado);
}

/** Salva a personalização do tema */
function salvarPersonalizacao() {
  const temaSelecionado = document.querySelector('input[name="theme-preference"]:checked')?.value || 'dark';
  aplicarTema(temaSelecionado, true);
}

/** Preenche os campos de configurações com os dados do estado atual */
function carregarDadosConfiguracoes() {
  if (appState.usuario) {
    document.getElementById('set-name').value = appState.usuario.nome || '';
    document.getElementById('set-email').value = appState.usuario.email || '';
    document.getElementById('set-phone').value = appState.usuario.telefone || '';
    document.getElementById('set-language').value = localStorage.getItem('idioma') || 'pt-BR';
  }

  if (appState.residencia) {
    document.getElementById('set-house-name').value = appState.residencia.nome || '';
    document.getElementById('set-house-cep').value = appState.residencia.cep || '';
    document.getElementById('set-house-area').value = appState.residencia.area || '';
    document.getElementById('set-house-dist').value = appState.residencia.distribuidora || '';
    document.getElementById('set-house-rate').value = appState.residencia.tarifa || '0.85';
    document.getElementById('set-house-type').value = appState.residencia.tipo || 'house';
  }

  atualizarControlesTema(obterTemaSalvo());
}

/** Salva as alterações de perfil do usuário */
function salvarPerfil() {
  const nome = document.getElementById('set-name').value.trim();
  const telefone = document.getElementById('set-phone').value.trim();
  const idioma = document.getElementById('set-language').value;

  if (!nome) {
    alert('Por favor, informe seu nome completo.');
    return;
  }

  appState.usuario.nome = nome;
  appState.usuario.telefone = telefone;
  localStorage.setItem('idioma', idioma);

  atualizarIndicadorUsuario();
  alert('Perfil atualizado com sucesso!');
}

/** Salva as configurações da residência */
function salvarConfiguracoesCasa() {
  const nome = document.getElementById('set-house-name').value.trim();
  const cep = document.getElementById('set-house-cep').value.trim();
  const area = document.getElementById('set-house-area').value;
  const distribuidora = document.getElementById('set-house-dist').value;
  const tarifa = document.getElementById('set-house-rate').value;
  const tipo = document.getElementById('set-house-type').value;

  if (!nome) {
    alert('Por favor, informe o nome da residência.');
    return;
  }

  // Atualiza o estado da residência com os novos valores
  appState.residencia.nome = nome;
  appState.residencia.cep = cep;
  appState.residencia.area = parseFloat(area) || 0;
  appState.residencia.distribuidora = distribuidora;
  appState.residencia.tarifa = parseFloat(tarifa) || 0.85;
  appState.residencia.tipo = tipo;

  // Atualiza o label da planta baixa
  document.getElementById('house-label').textContent = nome;

  alert('Configurações da residência atualizadas com sucesso!');
}

/** Salva as preferências de notificações no localStorage */
function salvarNotificacoes() {
  const configuracao = {
    email_alertas: document.getElementById('not-email-alerts').checked,
    email_custo: document.getElementById('not-email-cost').checked,
    email_anomalia: document.getElementById('not-email-anomaly').checked,
    email_dispositivo: document.getElementById('not-email-device').checked,
    browser_alertas: document.getElementById('not-browser-alerts').checked,
    browser_som: document.getElementById('not-browser-sound').checked,
    frequencia: document.getElementById('not-frequency').value
  };

  localStorage.setItem('notificacoes', JSON.stringify(configuracao));
  console.log('Configurações de notificação salvas:', configuracao);
}

/** Processa a alteração de senha do usuário */
function alterarSenha() {
  const senhaAtual = document.getElementById('set-pass-current').value;
  const novaSenha = document.getElementById('set-pass-new').value;
  const confirmarSenha = document.getElementById('set-pass-confirm').value;

  if (!senhaAtual || !novaSenha || !confirmarSenha) {
    alert('Por favor, preencha todos os campos para alterar a senha.');
    return;
  }

  if (novaSenha !== confirmarSenha) {
    alert('A nova senha e a confirmação não coincidem. Tente novamente.');
    return;
  }

  if (novaSenha.length < 8) {
    alert('A nova senha deve ter no mínimo 8 caracteres.');
    return;
  }

  // TODO: Validar senha atual e atualizar via API
  // POST /api/auth/alterarSenha

  alert('✓ Senha alterada com sucesso! Faça login novamente na próxima vez.');

  // Limpa os campos após a alteração
  document.getElementById('set-pass-current').value = '';
  document.getElementById('set-pass-new').value = '';
  document.getElementById('set-pass-confirm').value = '';
}

/** Ativa a autenticação de dois fatores (2FA) */
function habilitarAutenticacao2FA() {
  alert('A autenticação de dois fatores (2FA) ainda não está disponível nesta versão.\nAcompanhe as atualizações do sistema!');
}

/** Visualiza o avatar selecionado antes de salvar */
function visualizarAvatar() {
  const arquivo = document.getElementById('set-avatar').files[0];

  if (arquivo) {
    const leitor = new FileReader();
    leitor.onload = (e) => {
      const avatar = document.getElementById('profile-avatar');
      avatar.style.backgroundImage = `url('${e.target.result}')`;
      avatar.style.backgroundSize = 'cover';
      avatar.textContent = '';
    };
    leitor.readAsDataURL(arquivo);
  }
}

/** Exibe mensagem de upgrade de plano */
function atualizarPlano() {
  alert('Nenhum plano premium disponível no momento.\nObrigado pelo seu interesse — fique de olho nas novidades!');
}

/** Verifica se há atualizações disponíveis para o sistema */
function verificarAtualizacoes() {
  alert('Você está usando a versão mais recente do MONITECH (v2.1.0).\nNenhuma atualização disponível no momento.');
}

/** Exporta todos os dados do usuário em formato JSON */
function exportarDados() {
  const dados = {
    usuario: appState.usuario,
    residencia: appState.residencia,
    comodos: appState.comodos,
    dispositivos: appState.dispositivos,
    dataExportacao: new Date().toISOString()
  };

  const json = JSON.stringify(dados, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `monitech-dados-${Date.now()}.json`;
  link.click();

  alert('Dados exportados com sucesso! O arquivo foi salvo na sua pasta de downloads.');
}

/** Exclui permanentemente a conta do usuário após confirmação dupla */
function deletarConta() {
  const confirmacao1 = confirm(
    'Tem certeza que deseja excluir sua conta?\n\nEsta ação é IRREVERSÍVEL e apagará todos os seus dados, residências e histórico de consumo.'
  );

  if (confirmacao1) {
    const confirmacao2 = confirm(
      'Confirme a exclusão permanente da conta.\n\nApós confirmar, você será desconectado e não poderá recuperar os dados.'
    );

    if (confirmacao2) {
      // TODO: DELETE /api/usuarios/:id
      alert('Sua conta foi excluída com sucesso. Obrigado por usar o MONITECH!');
      sair();
    }
  }
}


// ===================================================
// MODAIS
// ===================================================

/** Abre um modal pelo seu ID */
function abrirModal(idModal) {
  document.getElementById(idModal).classList.add('open');
}

/** Fecha um modal pelo seu ID */
function fecharModal(idModal) {
  document.getElementById(idModal).classList.remove('open');
}


// ===================================================
// ONBOARDING — CONFIGURAÇÃO INICIAL
// ===================================================
let comodosConfigurados = [];
let dispositivosConfigurados = [];

/**
 * Atualiza o indicador de progresso do onboarding.
 * @param {number} etapaAtiva - Índice da etapa atual (0, 1 ou 2)
 */
function atualizarPassosOnboarding(etapaAtiva) {
  for (let i = 0; i < 3; i++) {
    const elemento = document.getElementById('s' + i);
    elemento.className = 'step-item ' + (
      i < etapaAtiva ? 'done' :
        i === etapaAtiva ? 'active' : ''
    );
  }

  document.querySelectorAll('.onboard-step').forEach((etapa, i) => {
    etapa.classList.toggle('active', i === etapaAtiva);
  });
}

/**
 * Avança para a próxima etapa do onboarding.
 * @param {number} etapaAtual - Índice da etapa sendo concluída
 */
function proximoOnboarding(etapaAtual) {
  if (etapaAtual === 0) {
    const nome = document.getElementById('house-name').value.trim();

    if (!nome) {
      alert('Por favor, informe o nome da sua residência para continuar.');
      return;
    }

    // Salva os dados da residência no estado da aplicação
    appState.residencia = {
      nome,
      cep: document.getElementById('house-cep').value.trim(),
      area: document.getElementById('house-area').value,
      distribuidora: document.getElementById('house-dist').value
    };

    atualizarPassosOnboarding(1);

  } else if (etapaAtual === 1) {
    if (comodosConfigurados.length === 0) {
      alert('Adicione pelo menos um cômodo para continuar.\nExemplo: Sala de Estar, Quarto, Cozinha...');
      return;
    }

    preencherSelecoesComodos();
    atualizarPassosOnboarding(2);
  }
}

/**
 * Retorna para a etapa anterior do onboarding.
 * @param {number} etapaAtual - Índice da etapa sendo abandonada
 */
function voltarOnboarding(etapaAtual) {
  atualizarPassosOnboarding(etapaAtual - 1);
}

/** Adiciona um novo cômodo na etapa de configuração do onboarding */
function adicionarComodoConfiguracao() {
  const tipo = document.getElementById('new-room-type').value;
  const nome = document.getElementById('new-room-name').value.trim()
    || (obterIconesComodos()[tipo] + ' ' + tipo.charAt(0).toUpperCase() + tipo.slice(1));

  const novoComodo = {
    id: 'c' + Date.now(),
    tipo,
    nome,
    watts: 0 // Consumo será atualizado com dados reais do dispositivo
  };

  comodosConfigurados.push(novoComodo);
  renderizarComodosConfiguracao();
  document.getElementById('new-room-name').value = '';
}

/** Renderiza a lista de cômodos na etapa de configuração */
function renderizarComodosConfiguracao() {
  const container = document.getElementById('rooms-setup-list');

  container.innerHTML = comodosConfigurados.map((comodo, indice) => `
    <div style="display:flex; align-items:center; gap:12px; background:var(--bg-card2); border:1px solid var(--border); border-radius:8px; padding:10px 14px;">
      <span>${obterIconesComodos()[comodo.tipo] || '📦'}</span>
      <span style="flex:1; font-weight:600;">${comodo.nome}</span>
      <span class="tag tag-cyan">${comodo.tipo}</span>
      <button onclick="removerComodoConfiguracao(${indice})" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:18px;">×</button>
    </div>
  `).join('');

  corrigirTextosCorrompidosNaPagina(container);
}

/**
 * Remove um cômodo da lista de configuração.
 * @param {number} indice - Posição do cômodo no array
 */
function removerComodoConfiguracao(indice) {
  comodosConfigurados.splice(indice, 1);
  renderizarComodosConfiguracao();
}

/** Adiciona um novo dispositivo na etapa de configuração do onboarding */
function adicionarDispositivoConfiguracao() {
  const tipo = document.getElementById('dev-type').value;
  const nome = document.getElementById('dev-name').value.trim()
    || (obterIconesDispositivos()[tipo] + ' ' + tipo);
  const idComodo = document.getElementById('dev-room').value;
  const nomeComodo = document.getElementById('dev-room').selectedOptions[0]?.text || '—';
  const potencia = parseInt(document.getElementById('dev-watts').value) || 300;

  const novoDispositivo = {
    id: 'd' + Date.now(),
    tipo,
    nome,
    idComodo,
    nomeComodo,
    watts: potencia,
    status: 'on',
    kwh: +(potencia * 8 / 1000).toFixed(2) // Estimativa de 8h diárias de uso
  };

  dispositivosConfigurados.push(novoDispositivo);
  renderizarDispositivosConfiguracao();
}

/** Renderiza a lista de dispositivos na etapa de configuração */
function renderizarDispositivosConfiguracao() {
  const container = document.getElementById('devices-setup-list');

  container.innerHTML = dispositivosConfigurados.map((disp, indice) => `
    <div style="display:flex; align-items:center; gap:12px; background:var(--bg-card2); border:1px solid var(--border); border-radius:8px; padding:10px 14px;">
      <span>${obterIconesDispositivos()[disp.tipo] || '🔌'}</span>
      <span style="flex:1; font-weight:600;">${disp.nome}</span>
      <span class="tag tag-blue">${disp.nomeComodo}</span>
      <span style="font-family:'Orbitron',monospace; font-size:12px; color:var(--cyan);">${disp.watts}W</span>
      <button onclick="removerDispositivoConfiguracao(${indice})" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:18px;">×</button>
    </div>
  `).join('');

  corrigirTextosCorrompidosNaPagina(container);
}

/**
 * Remove um dispositivo da lista de configuração.
 * @param {number} indice - Posição do dispositivo no array
 */
function removerDispositivoConfiguracao(indice) {
  dispositivosConfigurados.splice(indice, 1);
  renderizarDispositivosConfiguracao();
}

/**
 * Preenche os selects de cômodos em formulários de dispositivos.
 * Usa os cômodos configurados no onboarding ou os do estado da aplicação.
 */
function preencherSelecoesComodos() {
  const seletores = ['dev-room', 'modal-dev-room'];
  const listaComodos = comodosConfigurados.length ? comodosConfigurados : appState.comodos;

  seletores.forEach(idSeletor => {
    const select = document.getElementById(idSeletor);
    if (!select) return;
    select.innerHTML = listaComodos.map(c =>
      `<option value="${c.id}">${c.nome}</option>`
    ).join('');
  });
}

/** Finaliza o onboarding e prepara o acesso ao painel principal */
async function finalizarOnboarding() {
  // Salva os dados configurados no estado da aplicação
  appState.comodos = comodosConfigurados.map(c => ({ ...c, watts: 0 }));
  appState.dispositivos = dispositivosConfigurados;

  // Exibe o aviso sobre o dispositivo de medição
  document.getElementById('modal-alert').classList.add('open');
}


// ===================================================
// ENTRADA NA APLICAÇÃO PRINCIPAL
// ===================================================

/** Inicializa a aplicação principal após login ou onboarding */
function entrarNoApp() {
  mostrarPagina('page-app');

  // Atualiza o nome do usuário na barra de navegação
  if (appState.usuario) {
    const elementoNome = document.getElementById('user-badge-text');
    const primeiroNome = appState.usuario.nome.split(' ')[0];
    elementoNome.textContent = '👤 ' + primeiroNome;
  }

  // Atualiza o label da residência na planta baixa
  if (appState.residencia) {
    document.getElementById('house-label').textContent = appState.residencia.nome || 'Minha Casa';
  }

  // Exibe a aba de conexão ESP32 como padrão ao entrar
  exibirAba('esp32');

  // Inicia os processos de atualização em tempo real
  iniciarSimulacaoAoVivo();
  iniciarGraficoAoVivo();

  // Fecha o dropdown do usuário ao clicar fora dele
  document.addEventListener('click', function fecharDropdown(evento) {
    const menu = document.getElementById('user-dropdown');
    const botao = document.querySelector('.user-menu-btn');

    if (menu && botao && !menu.contains(evento.target) && !botao.contains(evento.target)) {
      fecharMenuUsuario();
    }
  });
}

/** Carrega os dados demo para o modo de demonstração (sem dispositivo conectado) */
function carregarDadosDemo() {
  // TODO: Carregar dados reais do servidor via:
  // GET /api/residencia/:idUsuario
  // GET /api/comodos/:idResidencia
  // GET /api/dispositivos/:idResidencia
  appState.residencia = {};
  appState.comodos = [];
  appState.dispositivos = [];
  comodosConfigurados = [];
}

/** Inicializa o array de alertas da sessão */
function adicionarAlertasAmostra() {
  // TODO: Carregar alertas reais via:
  // GET /api/alertas/:idUsuario
  appState.alertas = [];
}


// ===================================================
// GRÁFICOS
// ===================================================
let graficos = {};

/** Destrói todos os gráficos ativos para liberar memória */
function destruirGraficos() {
  Object.values(graficos).forEach(g => g && g.destroy());
  graficos = {};
}

// Configurações padrão compartilhadas por todos os gráficos
const configPadraoGraficos = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#7aa8cc', font: { family: 'Rajdhani', size: 12 } }
    }
  },
  scales: {
    x: {
      ticks: { color: '#7aa8cc', font: { family: 'Rajdhani', size: 11 } },
      grid: { color: 'rgba(0,212,255,0.05)' }
    },
    y: {
      ticks: { color: '#7aa8cc', font: { family: 'Rajdhani', size: 11 } },
      grid: { color: 'rgba(0,212,255,0.05)' }
    }
  }
};

/** Inicializa todos os gráficos da aba Dashboard */
function inicializarGraficos() {
  const historico = gerarHistoricoSimulado('day');

  // Gráfico de consumo por hora
  if (graficos.porHora) graficos.porHora.destroy();
  graficos.porHora = new Chart(document.getElementById('chart-hourly'), {
    type: 'line',
    data: {
      labels: historico.map(d => d.label),
      datasets: [{
        label: 'kWh',
        data: historico.map(d => d.kwh),
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0,212,255,0.06)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#00d4ff',
        tension: 0.4,
        fill: true
      }]
    },
    options: { ...configPadraoGraficos }
  });

  // Gráfico de pizza — consumo por cômodo
  const nomesComodos = appState.comodos.map(c => c.nome);
  const wattsPorComodo = appState.comodos.map(c => c.watts);
  const coresGrafico = ['#0057ff', '#00d4ff', '#7df9ff', '#1a7eff', '#00a8cc', '#0099ff'];

  if (graficos.pizza) graficos.pizza.destroy();
  graficos.pizza = new Chart(document.getElementById('chart-rooms-pie'), {
    type: 'doughnut',
    data: {
      labels: nomesComodos,
      datasets: [{
        data: wattsPorComodo,
        backgroundColor: coresGrafico,
        borderColor: '#050f1e',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#7aa8cc', font: { family: 'Rajdhani', size: 11 }, padding: 8 }
        }
      }
    }
  });

  // Gráfico de histórico mensal
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const kwhMensal = meses.map(() => 0); // Aguardando dados reais do dispositivo

  if (graficos.mensal) graficos.mensal.destroy();
  graficos.mensal = new Chart(document.getElementById('chart-monthly'), {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [{
        label: 'kWh',
        data: kwhMensal,
        backgroundColor: 'rgba(0,87,255,0.5)',
        borderColor: '#1a7eff',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: { ...configPadraoGraficos }
  });

  // Gráfico horizontal — top dispositivos por consumo
  const nomesDispositivos = appState.dispositivos.slice(0, 6).map(d => d.nome);
  const kwhDispositivos = appState.dispositivos.slice(0, 6).map(d => d.kwh);

  if (graficos.barraDispositivos) graficos.barraDispositivos.destroy();
  graficos.barraDispositivos = new Chart(document.getElementById('chart-devices-bar'), {
    type: 'bar',
    data: {
      labels: nomesDispositivos,
      datasets: [{
        label: 'kWh hoje',
        data: kwhDispositivos,
        backgroundColor: [
          'rgba(0,87,255,0.6)',
          'rgba(0,212,255,0.6)',
          'rgba(255,170,0,0.6)',
          'rgba(255,61,107,0.6)',
          'rgba(0,255,157,0.6)',
          'rgba(125,249,255,0.6)'
        ],
        borderRadius: 4
      }]
    },
    options: { ...configPadraoGraficos, indexAxis: 'y' }
  });
}

// Variáveis para o gráfico ao vivo
let dadosRotulosAoVivo = [];
let dadosKwhAoVivo = [];
let dadosVoltsAoVivo = [];

/** Inicializa o histórico do gráfico ao vivo */
function iniciarGraficoAoVivo() {
  // TODO: Pré-popular com dados históricos do dispositivo
  // GET /api/leituras/historico?periodo=hoje&limite=10
  dadosRotulosAoVivo = [];
  dadosKwhAoVivo = [];
  dadosVoltsAoVivo = [];
}


// ===================================================
// SIMULAÇÃO AO VIVO
// Será substituída pela conexão real com o ESP32
// ===================================================
let intervaloAoVivo;

/** Inicia a atualização periódica dos medidores e cartões de estatísticas */
function iniciarSimulacaoAoVivo() {
  clearInterval(intervaloAoVivo);

  // TODO: Conectar ao WebSocket ou endpoint de polling do dispositivo ESP32
  // GET /api/leituras/aovivo/:idDispositivo (polling ou WebSocket)
  intervaloAoVivo = setInterval(() => {
    const dados = appState.dadosAoVivo;

    // Os valores abaixo serão preenchidos pelo dispositivo conectado:
    // dados.volts = leitura do sensor
    // dados.amps  = leitura do sensor
    // dados.watts = leitura do sensor
    // dados.pf    = leitura do sensor
    // dados.freq  = leitura do sensor
    // dados.kwh   = leitura do sensor

    atualizarMarcadores(dados);
    atualizarCartasEstatisticas(dados);

    // Atualiza o gráfico ao vivo com a nova leitura
    const agora = new Date();
    dadosRotulosAoVivo.push(agora.toLocaleTimeString('pt-BR'));
    dadosKwhAoVivo.push(+(dados.watts / 1000).toFixed(3));
    dadosVoltsAoVivo.push(dados.volts);

    // Mantém apenas os últimos 30 pontos no gráfico ao vivo
    if (dadosRotulosAoVivo.length > 30) {
      dadosRotulosAoVivo.shift();
      dadosKwhAoVivo.shift();
      dadosVoltsAoVivo.shift();
    }

    // Zera o consumo dos cômodos (aguardando leitura real do dispositivo)
    appState.comodos.forEach(c => { c.watts = 0; });

  }, 2500);
}

/**
 * Atualiza os marcadores circulares (gauges) do dashboard.
 * @param {Object} dados - Objeto com os valores de volts, amps, watts, pf, freq e kwh
 */
function atualizarMarcadores(dados) {
  definirMarcador('g-volts', 'gv-volts', dados.volts, 250, dados.volts.toFixed(0));
  definirMarcador('g-amps', 'gv-amps', dados.amps, 30, dados.amps.toFixed(1));
  definirMarcador('g-watts', 'gv-watts', dados.watts, 6000, dados.watts.toFixed(0));
  definirMarcador('g-pf', 'gv-pf', dados.pf, 1, dados.pf.toFixed(2));
  definirMarcador('g-freq', 'gv-freq', (dados.freq - 58) / 4, 1, dados.freq.toFixed(1));
  definirMarcador('g-kwh', 'gv-kwh', dados.kwh, 50, dados.kwh.toFixed(1));
}

/**
 * Define visualmente um marcador circular (gauge) com o valor fornecido.
 * @param {string} idCirculo - ID do elemento SVG circle
 * @param {string} idValor   - ID do elemento de texto do valor
 * @param {number} valor     - Valor atual da métrica
 * @param {number} maximo    - Valor máximo esperado para escala
 * @param {string} rotulo    - Texto a exibir no gauge
 */
function definirMarcador(idCirculo, idValor, valor, maximo, rotulo) {
  const porcentagem = Math.min(1, valor / maximo);
  const circunferencia = 2 * Math.PI * 36;
  const deslocamento = circunferencia * (1 - porcentagem);

  const circulo = document.getElementById(idCirculo);
  const textoVal = document.getElementById(idValor);

  if (circulo) circulo.style.strokeDashoffset = deslocamento;
  if (textoVal) textoVal.textContent = rotulo;
}

/**
 * Atualiza os cartões de estatísticas rápidas no dashboard.
 * @param {Object} dados - Objeto com os valores de leitura atuais
 */
function atualizarCartasEstatisticas(dados) {
  const atualizar = (id, valor) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  };

  atualizar('stat-kwh', dados.kwh.toFixed(1));
  atualizar('stat-cost', 'R$ ' + (dados.kwh * 0.74).toFixed(2));
  atualizar('stat-peak', (dados.watts / 1000).toFixed(2));
}


// ===================================================
// ABA: CÔMODOS
// ===================================================

/** Renderiza os cartões de cômodos na aba correspondente */
function renderizarComodos() {
  const grade = document.getElementById('rooms-grid');
  const icones = obterIconesComodos();
  const totalWatts = appState.comodos.reduce((soma, c) => soma + c.watts, 0);
  const maxWatts = Math.max(...appState.comodos.map(c => c.watts), 1);

  grade.innerHTML = appState.comodos.map(comodo => {
    const porcentagem = totalWatts > 0 ? Math.round(comodo.watts / totalWatts * 100) : 0;
    const ehMaior = comodo.watts === Math.max(...appState.comodos.map(c => c.watts));
    const qtdDispositivos = appState.dispositivos.filter(d => d.idComodo === comodo.id).length;

    return `
      <div class="room-card ${ehMaior ? 'high-consumption' : ''}" onclick="exibirDetalheComodo('${comodo.id}')">
        <div class="room-header">
          <span class="room-icon">${icones[comodo.tipo] || '📦'}</span>
          <span class="room-badge ${ehMaior ? 'badge-high' : 'badge-normal'}">
            ${ehMaior ? '⚠ MAIOR CONSUMO' : 'Normal'}
          </span>
          <button class="room-delete-btn" onclick="deletarComodo('${comodo.id}', event)" title="Deletar cômodo">🗑️</button>
        </div>
        <div class="room-name">${comodo.nome}</div>
        <div class="room-devices">${qtdDispositivos} dispositivo${qtdDispositivos !== 1 ? 's' : ''}</div>
        <div class="consumption-bar">
          <div class="consumption-fill ${ehMaior ? 'high' : ''}" style="width:${porcentagem}%"></div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <div class="room-watts">
            <span style="font-family:'Orbitron',monospace; font-size:18px; color:${ehMaior ? 'var(--danger)' : 'var(--cyan)'};">${comodo.watts}</span>
            <span style="font-size:12px; color:var(--text-secondary);"> W</span>
          </div>
          <div style="font-size:11px; color:var(--text-secondary);">${porcentagem}% do total</div>
        </div>
      </div>
    `;
  }).join('');

  corrigirTextosCorrompidosNaPagina(grade);
}

/** Deleta um cômodo e todos os seus dispositivos associados */
function deletarComodo(idComodo, evento) {
  evento.stopPropagation(); // Evita abrir o detalhe ao clicar no botão deletar

  const comodo = appState.comodos.find(c => c.id === idComodo);
  if (!comodo) return;

  // Conta quantos dispositivos serão deletados
  const dispositivos = appState.dispositivos.filter(d => d.idComodo === idComodo);

  // Pede confirmação ao usuário
  const confirmacao = confirm(
    `⚠️ DELETAR CÔMODO\n\n` +
    `Cômodo: ${comodo.nome}\n` +
    `Dispositivos a remover: ${dispositivos.length}\n\n` +
    `Tem certeza que deseja deletar este cômodo e todos os seus dispositivos?`
  );

  if (!confirmacao) return;

  // Remove o cômodo
  appState.comodos = appState.comodos.filter(c => c.id !== idComodo);

  // Remove todos os dispositivos associados
  appState.dispositivos = appState.dispositivos.filter(d => d.idComodo !== idComodo);

  // Salva no localStorage e re-renderiza
  localStorage.setItem('comodos', JSON.stringify(appState.comodos));
  localStorage.setItem('dispositivos', JSON.stringify(appState.dispositivos));

  renderizarComodos();
  renderizarPlanta();

  alert(`✓ Cômodo "${comodo.nome}" deletado com sucesso!\n${dispositivos.length} dispositivo(s) foram removido(s).`);
}

/**
 * Navega para a planta interativa e destaca o cômodo selecionado.
 * @param {string} idComodo - ID do cômodo a destacar
 */
function exibirDetalheComodo(idComodo) {
  exibirAba('planta');
  destacarComodoPlanta(idComodo);
}


// ===================================================
// ABA: PLANTA INTERATIVA
// ===================================================

/** Renderiza a grade da planta baixa com os cômodos cadastrados */
function renderizarPlanta() {
  const grade = document.getElementById('floor-grid');
  const icones = obterIconesComodos();
  const maxW = Math.max(...appState.comodos.map(c => c.watts), 1);

  grade.innerHTML = appState.comodos.map(comodo => {
    const proporcao = comodo.watts / maxW;
    const isCritico = proporcao > 0.7;
    const isMedio = proporcao > 0.4 && !isCritico;
    const cor = isCritico ? 'var(--danger)' : isMedio ? 'var(--warn)' : 'var(--success)';
    const qtdDisp = appState.dispositivos.filter(d => d.idComodo === comodo.id).length;

    return `
      <div class="floor-room ${isCritico ? 'critical' : ''}" id="floor-${comodo.id}" onclick="selecionarComodoPlanta('${comodo.id}')">
        <div class="heat-overlay" style="background:${cor};"></div>
        <div class="room-icon">${icones[comodo.tipo] || '📦'}</div>
        <div class="room-name" style="color:var(--text-primary);">${comodo.nome}</div>
        <div class="room-kw" style="color:${cor};">${(comodo.watts / 1000).toFixed(2)} kW</div>
        <div style="font-size:10px; color:var(--text-dim);">${qtdDisp} disp.</div>
      </div>
    `;
  }).join('');

  corrigirTextosCorrompidosNaPagina(grade);
}

/**
 * Destaca um cômodo na planta baixa com rolagem automática.
 * @param {string} idComodo - ID do cômodo a destacar
 */
function destacarComodoPlanta(idComodo) {
  document.querySelectorAll('.floor-room').forEach(el => el.classList.remove('active'));

  const elemento = document.getElementById('floor-' + idComodo);
  if (elemento) {
    elemento.classList.add('active');
    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  selecionarComodoPlanta(idComodo);
}

/**
 * Exibe o painel de detalhes do cômodo selecionado na planta.
 * @param {string} idComodo - ID do cômodo selecionado
 */
function selecionarComodoPlanta(idComodo) {
  // Remove destaque de todos os cômodos
  document.querySelectorAll('.floor-room').forEach(el => el.classList.remove('active'));

  const elemento = document.getElementById('floor-' + idComodo);
  if (elemento) elemento.classList.add('active');

  const comodo = appState.comodos.find(c => c.id === idComodo);
  if (!comodo) return;

  // Exibe o painel de detalhes
  const painel = document.getElementById('room-detail-panel');
  painel.style.display = 'block';
  document.getElementById('detail-room-title').textContent = comodo.nome.toUpperCase() + ' — DETALHES E DISPOSITIVOS';

  // Lista os dispositivos do cômodo selecionado
  const dispositivos = appState.dispositivos.filter(d => d.idComodo === idComodo);
  document.getElementById('detail-devices-list').innerHTML = dispositivos.length
    ? dispositivos.map(d => `
        <div style="display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid var(--border);">
          <span>${obterIconesDispositivos()[d.tipo] || '🔌'}</span>
          <span style="flex:1; font-size:13px;">${d.nome}</span>
          <span class="device-status ${d.status}">
            <span class="device-status-dot"></span>${d.status === 'on' ? 'Ligado' : 'Desligado'}
          </span>
          <span style="font-family:'Orbitron',monospace; font-size:12px; color:var(--cyan);">${d.watts}W</span>
        </div>
      `).join('')
    : '<div style="color:var(--text-dim); font-size:13px;">Nenhum dispositivo cadastrado neste cômodo</div>';

  // Gráfico de consumo histórico do cômodo (simulado)
  if (graficos.detalheComodo) graficos.detalheComodo.destroy();
  const historico = Array.from({ length: 12 }, (_, i) => ({
    label: `${i * 2}h`,
    kwh: +(Math.random() * 0.4 + 0.05).toFixed(2)
  }));

  graficos.detalheComodo = new Chart(document.getElementById('chart-room-detail'), {
    type: 'line',
    data: {
      labels: historico.map(d => d.label),
      datasets: [{
        label: 'kWh',
        data: historico.map(d => d.kwh),
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0,212,255,0.08)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 2
      }]
    },
    options: { ...configPadraoGraficos }
  });

  corrigirTextosCorrompidosNaPagina(painel);
}


// ===================================================
// ABA: DISPOSITIVOS
// ===================================================

/** Renderiza a tabela de dispositivos e o gráfico comparativo */
function renderizarDispositivos() {
  const corpo = document.getElementById('devices-tbody');
  const icones = obterIconesDispositivos();

  corpo.innerHTML = appState.dispositivos.map(disp => `
    <tr>
      <td><span style="margin-right:8px;">${icones[disp.tipo] || '🔌'}</span>${disp.nome}</td>
      <td><span class="tag tag-cyan">${disp.nomeComodo}</span></td>
      <td>
        <span class="device-status ${disp.status}">
          <span class="device-status-dot"></span>${disp.status === 'on' ? 'Ligado' : 'Desligado'}
        </span>
      </td>
      <td style="font-family:'Orbitron',monospace; color:var(--cyan);">${disp.watts}W</td>
      <td style="font-family:'Orbitron',monospace;">${disp.kwh} kWh</td>
      <td style="font-family:'Orbitron',monospace;">${(disp.kwh * 30).toFixed(1)} kWh</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="alternarDispositivo('${disp.id}')" style="margin-right:4px;">
          ${disp.status === 'on' ? '⏸ Desligar' : '▶ Ligar'}
        </button>
        <button class="btn btn-sm btn-danger" onclick="removerDispositivo('${disp.id}')">✕</button>
      </td>
    </tr>
  `).join('');

  // Gráfico comparativo de consumo por dispositivo
  if (graficos.dispositivoCompleto) graficos.dispositivoCompleto.destroy();
  graficos.dispositivoCompleto = new Chart(document.getElementById('chart-devices-full'), {
    type: 'bar',
    data: {
      labels: appState.dispositivos.map(d => d.nome),
      datasets: [{
        label: 'kWh hoje',
        data: appState.dispositivos.map(d => d.kwh),
        backgroundColor: appState.dispositivos.map(d =>
          d.status === 'on' ? 'rgba(0,87,255,0.6)' : 'rgba(60,96,128,0.3)'
        ),
        borderColor: appState.dispositivos.map(d =>
          d.status === 'on' ? '#1a7eff' : '#3d6080'
        ),
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: { ...configPadraoGraficos }
  });

  corrigirTextosCorrompidosNaPagina(corpo);
}

/**
 * Alterna o status (ligado/desligado) de um dispositivo.
 * @param {string} idDispositivo - ID do dispositivo a alternar
 */
function alternarDispositivo(idDispositivo) {
  const disp = appState.dispositivos.find(d => d.id === idDispositivo);
  if (disp) {
    disp.status = disp.status === 'on' ? 'off' : 'on';
    renderizarDispositivos();
  }
}

/**
 * Remove um dispositivo após confirmação do usuário.
 * @param {string} idDispositivo - ID do dispositivo a remover
 */
function removerDispositivo(idDispositivo) {
  if (confirm('Deseja realmente remover este dispositivo?\nEsta ação não pode ser desfeita.')) {
    appState.dispositivos = appState.dispositivos.filter(d => d.id !== idDispositivo);
    renderizarDispositivos();
  }
}


// ===================================================
// MODAIS DE ADIÇÃO
// ===================================================

/** Abre o modal de adição de novo cômodo */
function abrirModalAdicionarComodo() {
  preencherSelecoesComodos();
  abrirModal('modal-room');
}

/** Abre o modal de adição de novo dispositivo */
function abrirModalAdicionarDispositivo() {
  preencherSelecoesComodos();
  abrirModal('modal-device');
}

/** Processa a adição de um novo cômodo a partir do modal */
function adicionarComodoDoModal() {
  const tipo = document.getElementById('modal-room-type').value;
  const nome = document.getElementById('modal-room-name').value.trim()
    || (obterIconesComodos()[tipo] + ' ' + tipo);

  const novoComodo = {
    id: 'c' + Date.now(),
    tipo,
    nome,
    watts: 0 // Valor será atualizado com dados reais do dispositivo
  };

  appState.comodos.push(novoComodo);
  comodosConfigurados = appState.comodos;

  preencherSelecoesComodos();
  fecharModal('modal-room');
  renderizarComodos();
}

/** Processa a adição de um novo dispositivo a partir do modal */
function adicionarDispositivoDoModal() {
  const tipo = document.getElementById('modal-dev-type').value;
  const nome = document.getElementById('modal-dev-name').value.trim()
    || (obterIconesDispositivos()[tipo] + ' ' + tipo);
  const seletor = document.getElementById('modal-dev-room');
  const idComodo = seletor.value;
  const nomeComodo = seletor.selectedOptions[0]?.text || '—';
  const potencia = parseInt(document.getElementById('modal-dev-watts').value) || 300;
  const idIoT = document.getElementById('modal-dev-id').value || 'MONITECH-' + (Date.now() % 10000);

  const novoDispositivo = {
    id: 'd' + Date.now(),
    tipo,
    nome,
    idComodo,
    nomeComodo,
    watts: potencia,
    status: 'on',
    kwh: +(potencia * 8 / 1000).toFixed(2),
    idDispositivo: idIoT
  };

  appState.dispositivos.push(novoDispositivo);
  fecharModal('modal-device');
  renderizarDispositivos();
}


// ===================================================
// ABA: RELATÓRIOS
// ===================================================

/** Inicializa os gráficos da aba de relatórios */
function inicializarGraficosRelatorio() {
  const historico = gerarHistoricoSimulado('week');

  // Destrói gráficos anteriores antes de recriar
  ['diario', 'custo', 'volts', 'amps'].forEach(id => {
    if (graficos['rel_' + id]) graficos['rel_' + id].destroy();
  });

  // Gráfico de consumo diário
  graficos.rel_diario = new Chart(document.getElementById('chart-rep-daily'), {
    type: 'bar',
    data: {
      labels: historico.map(d => d.label),
      datasets: [{
        label: 'kWh', data: historico.map(d => d.kwh),
        backgroundColor: 'rgba(0,87,255,0.5)', borderColor: '#1a7eff',
        borderWidth: 1, borderRadius: 4
      }]
    },
    options: { ...configPadraoGraficos }
  });

  // Gráfico de custo estimado
  graficos.rel_custo = new Chart(document.getElementById('chart-rep-cost'), {
    type: 'line',
    data: {
      labels: historico.map(d => d.label),
      datasets: [{
        label: 'R$', data: historico.map(d => d.custo),
        borderColor: '#ffaa00', backgroundColor: 'rgba(255,170,0,0.06)',
        borderWidth: 2, tension: 0.4, fill: true, pointRadius: 3
      }]
    },
    options: { ...configPadraoGraficos }
  });

  // Gráfico de tensão média
  graficos.rel_volts = new Chart(document.getElementById('chart-rep-volts'), {
    type: 'line',
    data: {
      labels: historico.map(d => d.label),
      datasets: [{
        label: 'Tensão (V)', data: historico.map(d => d.volts),
        borderColor: '#7df9ff', backgroundColor: 'rgba(125,249,255,0.05)',
        borderWidth: 2, tension: 0.4, fill: true, pointRadius: 3
      }]
    },
    options: { ...configPadraoGraficos }
  });

  // Gráfico de corrente média
  graficos.rel_amps = new Chart(document.getElementById('chart-rep-amps'), {
    type: 'line',
    data: {
      labels: historico.map(d => d.label),
      datasets: [{
        label: 'Corrente (A)', data: historico.map(d => d.amps),
        borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,0.05)',
        borderWidth: 2, tension: 0.4, fill: true, pointRadius: 3
      }]
    },
    options: { ...configPadraoGraficos }
  });

  // Tabela resumo do período
  const corpoTabela = document.getElementById('report-tbody');
  corpoTabela.innerHTML = historico.map(d => `
    <tr>
      <td style="font-family:'Orbitron',monospace; font-size:12px;">${d.label}</td>
      <td style="color:var(--cyan);   font-family:'Orbitron',monospace;">${d.kwh}</td>
      <td style="color:var(--warn);   font-family:'Orbitron',monospace;">R$ ${d.custo.toFixed(2)}</td>
      <td>${d.watts}W</td>
      <td>${d.volts}V</td>
      <td>${d.amps}A</td>
    </tr>
  `).join('');
}

/** Exporta o relatório de consumo (integrar com endpoint da API) */
function exportarRelatorio() {
  alert('Exportação de relatório\n\nConecte ao endpoint /api/relatorios/exportar para gerar o arquivo PDF ou CSV com os dados do período selecionado.');
}

/** Atualiza os gráficos ao alterar o período selecionado */
function atualizarGraficos() {
  inicializarGraficos();
}


// ===================================================
// ABA: ALERTAS
// ===================================================

/** Renderiza a lista de alertas gerados */
function renderizarAlertas() {
  const lista = document.getElementById('alerts-list');

  lista.innerHTML = appState.alertas.length
    ? appState.alertas.map(alerta => `
        <div class="alert-item ${alerta.tipo}">
          <span class="alert-icon">${alerta.icone}</span>
          <div class="alert-text">
            <strong>${alerta.titulo}</strong>
            <span>${alerta.mensagem}</span>
          </div>
          <span class="alert-time">${alerta.horario}</span>
        </div>
      `).join('')
    : '<div class="empty-state"><div class="empty-icon">🔔</div><div class="empty-title">Nenhum alerta registrado</div></div>';

  corrigirTextosCorrompidosNaPagina(lista);
}

/** Remove todos os alertas da sessão atual */
function limparAlertas() {
  appState.alertas = [];
  renderizarAlertas();
}

/** Salva as configurações de limites de alerta */
function salvarConfiguracaoAlertas() {
  const config = {
    limiteKwh: document.getElementById('alert-kwh-limit').value,
    limiteCusto: document.getElementById('alert-cost-limit').value,
    voltMinimo: document.getElementById('alert-volt-min').value,
    voltMaximo: document.getElementById('alert-volt-max').value
  };

  // TODO: POST /api/alertas/config
  alert(
    'Configurações de alertas salvas com sucesso!\n\n' +
    'Limite de consumo diário: ' + (config.limiteKwh || 'não definido') + ' kWh\n' +
    'Limite de custo mensal: R$ ' + (config.limiteCusto || 'não definido') + '\n' +
    'Faixa de tensão permitida: ' + (config.voltMinimo || '---') + 'V a ' + (config.voltMaximo || '---') + 'V'
  );
}


// ===================================================
// ANIMAÇÃO DE PARTÍCULAS — FUNDO DA INTERFACE
// ===================================================
(function iniciarParticulas() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let largura, altura, particulas = [];

  function redimensionar() {
    largura = canvas.width = window.innerWidth;
    altura = canvas.height = window.innerHeight;
  }

  redimensionar();
  window.addEventListener('resize', redimensionar);

  // Reduz a quantidade de partículas em telas menores para melhorar performance
  const quantidadeParticulas = window.innerWidth < 768 ? 15 : 30;

  for (let i = 0; i < quantidadeParticulas; i++) {
    particulas.push({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      raio: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1
    });
  }

  let ultimoFrame = 0;
  const fpsLimitado = 30;

  function desenhar(tempoAtual) {
    // Limita a taxa de atualização para 30 FPS
    if (tempoAtual - ultimoFrame < 1000 / fpsLimitado) {
      requestAnimationFrame(desenhar);
      return;
    }
    ultimoFrame = tempoAtual;

    ctx.clearRect(0, 0, largura, altura);

    particulas.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Reinicia a posição ao sair da tela
      if (p.x < 0) p.x = largura;
      if (p.x > largura) p.x = 0;
      if (p.y < 0) p.y = altura;
      if (p.y > altura) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.raio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.alpha})`;
      ctx.fill();
    });

    // Desenha linhas entre partículas próximas (com limite de conexões para performance)
    const maxConexoes = 100;
    let conexoes = 0;

    for (let i = 0; i < particulas.length && conexoes < maxConexoes; i++) {
      for (let j = i + 1; j < particulas.length && conexoes < maxConexoes; j++) {
        const dx = particulas[i].x - particulas[j].x;
        const dy = particulas[i].y - particulas[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particulas[i].x, particulas[i].y);
          ctx.lineTo(particulas[j].x, particulas[j].y);
          ctx.strokeStyle = `rgba(0,87,255,${0.05 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          conexoes++;
        }
      }
    }

    requestAnimationFrame(desenhar);
  }

  desenhar(0);
})();


// ===================================================
// MOTOR DE CONEXÃO ESP32
// ===================================================
let estadoESP32 = {
  conectado: false,
  protocolo: 'ws',
  ws: null,
  intervaloHTTP: null,
  portaSerial: null,
  leitorSerial: null,
  tempoConexao: null,
  pacotesRecebidos: 0,
  intervaloUptime: null,
  metricaGrafico: 'volts',
  rotulos: [],
  dados: [],
  ultimoPacote: null
};

let graficoESP32 = null;


// --- Seleção de protocolo de comunicação ---

/**
 * Seleciona o protocolo de comunicação com o ESP32.
 * @param {string} protocolo - 'ws', 'http', 'mqtt' ou 'serial'
 */
function selecionarProtocolo(protocolo) {
  estadoESP32.protocolo = protocolo;

  ['ws', 'http', 'mqtt', 'serial'].forEach(p => {
    document.getElementById('fields-' + p).style.display = p === protocolo ? '' : 'none';
    document.getElementById('proto-' + p).classList.toggle('active', p === protocolo);
  });

  const nomeProtocolo = {
    ws: 'WebSocket',
    http: 'HTTP Polling',
    mqtt: 'MQTT',
    serial: 'Serial/USB'
  };
  document.getElementById('conn-proto-label').textContent = nomeProtocolo[protocolo];

  atualizarCrachassBibliotecas(protocolo);
  atualizarVisualizacaoURL();
}

/** Atualiza a pré-visualização da URL de conexão WebSocket */
function atualizarVisualizacaoURL() {
  const ip = document.getElementById('esp-ip').value || '192.168.1.100';
  const porta = document.getElementById('esp-port-ws').value || '81';
  const path = document.getElementById('esp-ws-path').value || '/ws';
  document.getElementById('esp-url-preview').textContent = `ws://${ip}:${porta}${path}`;
}

// Atualiza a URL em tempo real ao digitar nos campos
['esp-ip', 'esp-port-ws', 'esp-ws-path'].forEach(idCampo => {
  const elemento = document.getElementById(idCampo);
  if (elemento) elemento.addEventListener('input', atualizarVisualizacaoURL);
});

/**
 * Atualiza os crachás de bibliotecas necessárias conforme o protocolo selecionado.
 * @param {string} protocolo - Protocolo de comunicação selecionado
 */
function atualizarCrachassBibliotecas(protocolo) {
  const bibliotecas = {
    ws: ['WebSockets (Markus Sattler)', 'ArduinoJson', 'PZEM-004T-v30'],
    http: ['WebServer (built-in)', 'ArduinoJson', 'PZEM-004T-v30'],
    mqtt: ['PubSubClient', 'ArduinoJson', 'PZEM-004T-v30'],
    serial: ['ArduinoJson', 'PZEM-004T-v30']
  };
  const cores = ['tag-blue', 'tag-blue', 'tag-cyan', 'tag-cyan'];

  document.getElementById('libs-needed').innerHTML =
    (bibliotecas[protocolo] || bibliotecas.ws).map((lib, i) =>
      `<span class="tag ${cores[i] || 'tag-blue'}">${lib}</span>`
    ).join('');
}


// --- Abas de código de referência ---

/**
 * Exibe a aba de código de firmware do ESP32 selecionada.
 * @param {string} aba - 'ws', 'http' ou 'mqtt'
 */
function exibirAbaCodigo(aba) {
  ['ws', 'http', 'mqtt'].forEach(t => {
    document.getElementById('codetab-' + t).style.display = t === aba ? '' : 'none';
    document.getElementById('code-tab-' + t).classList.toggle('active', t === aba);
  });
}

/**
 * Copia o conteúdo de um bloco de código para a área de transferência.
 * @param {string} idElemento - ID do elemento pre que contém o código
 */
function copiarCodigo(idElemento) {
  const texto = document.getElementById(idElemento).textContent;
  navigator.clipboard.writeText(texto).then(() => {
    registrarTerminal('Código copiado para a área de transferência', 'success');
  });
}


// --- Terminal de Log ---

/**
 * Registra uma mensagem no terminal de log da conexão ESP32.
 * @param {string} mensagem - Texto a exibir
 * @param {string} tipo     - 'info', 'success', 'error', 'warn' ou 'data'
 */
function registrarTerminal(mensagem, tipo = 'info') {
  const terminal = document.getElementById('esp-terminal');

  const cores = {
    info: 'var(--text-secondary)',
    success: 'var(--success)',
    error: 'var(--danger)',
    warn: 'var(--warn)',
    data: 'var(--cyan)'
  };
  const prefixos = {
    info: '[i]',
    success: '[ok]',
    error: '[x]',
    warn: '[!]',
    data: '[>]'
  };

  const horario = new Date().toLocaleTimeString('pt-BR', { hour12: false });
  const linha = document.createElement('div');

  linha.innerHTML = `
    <span style="color:var(--text-dim);">[${horario}]</span>
    <span style="color:${cores[tipo] || cores.info};">${prefixos[tipo] || '[?]'} ${corrigirTextoCorrompido(mensagem)}</span>
  `;

  terminal.appendChild(linha);

  if (document.getElementById('esp-autoscroll').checked) {
    terminal.scrollTop = terminal.scrollHeight;
  }
}

/** Limpa o conteúdo do terminal de log */
function limparTerminal() {
  document.getElementById('esp-terminal').innerHTML = '';
  registrarTerminal('Terminal limpo com sucesso', 'info');
}


// --- Seleção de métrica do gráfico ESP32 ---

/**
 * Define a métrica exibida no gráfico de leitura ao vivo do ESP32.
 * @param {string} metrica - 'volts', 'amps' ou 'watts'
 */
function definirMetricaGraficoESP32(metrica) {
  estadoESP32.metricaGrafico = metrica;

  ['volts', 'amps', 'watts'].forEach(m => {
    document.getElementById('esp-ch-' + m).classList.toggle('active', m === metrica);
  });

  if (graficoESP32) {
    const configuracoes = {
      volts: { cor: '#1a7eff', rotulo: 'Tensão (V)' },
      amps: { cor: '#00d4ff', rotulo: 'Corrente (A)' },
      watts: { cor: '#00ff9d', rotulo: 'Potência (W)' }
    };
    const cfg = configuracoes[metrica];

    graficoESP32.data.datasets[0].label = cfg.rotulo;
    graficoESP32.data.datasets[0].borderColor = cfg.cor;
    graficoESP32.data.datasets[0].backgroundColor = cfg.cor + '18';
    graficoESP32.data.datasets[0].pointBackgroundColor = cfg.cor;
    graficoESP32.update('none');
  }
}

/** Inicializa o gráfico de leitura ao vivo do ESP32 */
function inicializarGraficoESP32() {
  if (graficoESP32) graficoESP32.destroy();

  const configuracoes = {
    volts: { cor: '#1a7eff', rotulo: 'Tensão (V)' },
    amps: { cor: '#00d4ff', rotulo: 'Corrente (A)' },
    watts: { cor: '#00ff9d', rotulo: 'Potência (W)' }
  };
  const metrica = estadoESP32.metricaGrafico;
  const cfg = configuracoes[metrica];

  graficoESP32 = new Chart(document.getElementById('chart-esp-live'), {
    type: 'line',
    data: {
      labels: estadoESP32.rotulos,
      datasets: [{
        label: cfg.rotulo,
        data: estadoESP32.dados,
        borderColor: cfg.cor,
        backgroundColor: cfg.cor + '18',
        borderWidth: 2,
        pointRadius: 2,
        pointBackgroundColor: cfg.cor,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { labels: { color: '#7aa8cc', font: { family: 'Rajdhani', size: 12 } } }
      },
      scales: {
        x: {
          ticks: { color: '#7aa8cc', font: { family: 'Rajdhani', size: 10 }, maxTicksLimit: 10 },
          grid: { color: 'rgba(0,212,255,0.05)' }
        },
        y: {
          ticks: { color: '#7aa8cc', font: { family: 'Rajdhani', size: 10 } },
          grid: { color: 'rgba(0,212,255,0.05)' }
        }
      }
    }
  });

  document.getElementById('esp-chart-overlay').style.display = 'none';
}

/**
 * Adiciona uma nova leitura ao gráfico ao vivo do ESP32.
 * @param {Object} dados - Objeto com os valores de volts, amps e watts
 */
function adicionarLeituraESP32(dados) {
  const valor = { volts: dados.volts, amps: dados.amps, watts: dados.watts }[estadoESP32.metricaGrafico];
  const horario = new Date().toLocaleTimeString('pt-BR', { hour12: false });

  estadoESP32.rotulos.push(horario);
  estadoESP32.dados.push(+(valor || 0).toFixed(2));

  // Mantém no máximo 60 pontos no gráfico
  if (estadoESP32.rotulos.length > 60) {
    estadoESP32.rotulos.shift();
    estadoESP32.dados.shift();
  }

  if (graficoESP32) {
    graficoESP32.data.labels = estadoESP32.rotulos;
    graficoESP32.data.datasets[0].data = estadoESP32.dados;
    graficoESP32.update('none');
  }
}


// --- Processamento de dados recebidos do ESP32 ---

/**
 * Processa um pacote JSON recebido do dispositivo ESP32.
 * @param {string} bruto - String JSON bruta recebida
 */
function processarDadosESP32(bruto) {
  let dados;

  try {
    dados = JSON.parse(bruto);
  } catch (e) {
    registrarTerminal('Pacote inválido ou mal formatado: ' + bruto, 'warn');
    return;
  }

  estadoESP32.pacotesRecebidos++;
  estadoESP32.ultimoPacote = dados;

  // Atualiza o contador de pacotes recebidos
  document.getElementById('conn-packets').textContent = estadoESP32.pacotesRecebidos;

  // Exibe o último pacote JSON na interface
  document.getElementById('esp-last-packet').textContent = JSON.stringify(dados, null, 2);

  // Sincroniza as leituras com os medidores do dashboard
  if (dados.volts !== undefined) {
    appState.dadosAoVivo.volts = +dados.volts;
    appState.dadosAoVivo.amps = +dados.amps || appState.dadosAoVivo.amps;
    appState.dadosAoVivo.watts = +dados.watts || appState.dadosAoVivo.watts;
    appState.dadosAoVivo.pf = +dados.pf || appState.dadosAoVivo.pf;
    appState.dadosAoVivo.freq = +dados.hz || appState.dadosAoVivo.freq;
    appState.dadosAoVivo.kwh = +dados.kwh || appState.dadosAoVivo.kwh;

    atualizarMarcadores(appState.dadosAoVivo);
    atualizarCartasEstatisticas(appState.dadosAoVivo);
  }

  // Atualiza o indicador de sinal Wi-Fi do dispositivo
  if (dados.rssi !== undefined) {
    document.getElementById('conn-rssi').textContent = dados.rssi + ' dBm';
  }

  // Exibe as informações de firmware e hardware do dispositivo
  if (dados.fw || dados.chip) {
    document.getElementById('esp-info-empty').style.display = 'none';
    document.getElementById('esp-info-data').style.display = '';

    document.getElementById('esp-fw').textContent = dados.fw || 'Desconhecido';
    document.getElementById('esp-chip').textContent = dados.chip ? '0x' + dados.chip.toString(16).toUpperCase() : 'Desconhecido';
    document.getElementById('esp-local-ip').textContent = dados.ip || 'Desconhecido';
    document.getElementById('esp-ssid').textContent = dados.ssid || 'Desconhecido';
    document.getElementById('esp-sensor').textContent = dados.sensor || 'PZEM-004T';
    document.getElementById('esp-heap').textContent = dados.heap ? (dados.heap / 1024).toFixed(1) + ' KB' : 'Indisponível';
    document.getElementById('device-id').textContent = dados.id || '---';
  }

  if (dados.id) {
    document.getElementById('device-id').textContent = dados.id;
  }

  adicionarLeituraESP32(dados);

  registrarTerminal(
    `RX: V=${(+dados.volts || 0).toFixed(1)}V  ` +
    `A=${(+dados.amps || 0).toFixed(2)}A  ` +
    `W=${(+dados.watts || 0).toFixed(0)}W  ` +
    `kWh=${(+dados.kwh || 0).toFixed(3)}`,
    'data'
  );
}


// --- Atualização da interface de conexão ---

/**
 * Atualiza todos os elementos visuais conforme o estado de conexão.
 * @param {boolean} conectado - true = conectado, false = desconectado
 * @param {string} rotulo     - Texto do badge de status (ex: 'WS ATIVO', 'HTTP POLL')
 */
function definirEstadoConexao(conectado, rotulo = '') {
  estadoESP32.conectado = conectado;

  const badge = document.getElementById('esp-live-badge');
  const ponto = document.getElementById('esp-dot');
  const textoStatus = document.getElementById('esp-live-text');
  const iconeEsp = document.getElementById('esp-icon');
  const pontoNav = document.getElementById('esp32-nav-dot');
  const linhaConn = document.getElementById('conn-line');
  const pulsoConn = document.getElementById('conn-pulse');
  const btnConectar = document.getElementById('btn-connect');
  const btnDesconectar = document.getElementById('btn-disconnect');

  if (conectado) {
    badge.style.cssText = 'background:rgba(0,255,157,0.1); border-color:rgba(0,255,157,0.25); color:var(--success);';
    ponto.style.cssText = 'width:8px; height:8px; border-radius:50%; background:var(--success); box-shadow:0 0 8px var(--success); animation:blink 2s infinite;';
    textoStatus.textContent = rotulo || 'CONECTADO';
    iconeEsp.style.opacity = '1';
    iconeEsp.style.filter = 'drop-shadow(0 0 12px var(--cyan))';
    pontoNav.style.display = 'block';
    linhaConn.style.background = 'rgba(0,212,255,0.3)';
    pulsoConn.style.display = 'block';
    btnConectar.disabled = true;
    btnDesconectar.disabled = false;

    // Inicia o contador de tempo ativo (uptime)
    estadoESP32.tempoConexao = Date.now();
    clearInterval(estadoESP32.intervaloUptime);

    estadoESP32.intervaloUptime = setInterval(() => {
      const segundos = Math.floor((Date.now() - estadoESP32.tempoConexao) / 1000);
      const horas = Math.floor(segundos / 3600);
      const minutos = Math.floor((segundos % 3600) / 60);
      const segs = segundos % 60;

      document.getElementById('conn-uptime').textContent =
        `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
    }, 1000);

    // Para a simulação ao vivo (dados reais do ESP32 assumem o controle)
    clearInterval(intervaloAoVivo);

  } else {
    badge.style.cssText = 'background:rgba(61,96,128,0.2); border-color:rgba(61,96,128,0.3); color:var(--text-dim);';
    ponto.style.cssText = 'width:8px; height:8px; border-radius:50%; background:var(--text-dim);';
    textoStatus.textContent = 'DESCONECTADO';
    iconeEsp.style.opacity = '0.35';
    iconeEsp.style.filter = '';
    pontoNav.style.display = 'none';
    linhaConn.style.background = 'rgba(61,96,128,0.3)';
    pulsoConn.style.display = 'none';
    btnConectar.disabled = false;
    btnDesconectar.disabled = true;

    clearInterval(estadoESP32.intervaloUptime);

    document.getElementById('conn-uptime').textContent = '00:00:00';
    document.getElementById('conn-latency').textContent = '--';
    document.getElementById('conn-rssi').textContent = '--';

    // Retoma a simulação ao vivo após desconexão
    iniciarSimulacaoAoVivo();
  }
}


// --- Conexão via WebSocket ---

/** Inicia uma conexão WebSocket com o dispositivo ESP32 */
function conectarWebSocket() {
  const ip = document.getElementById('esp-ip').value.trim() || '192.168.1.100';
  const porta = document.getElementById('esp-port-ws').value.trim() || '81';
  const caminho = document.getElementById('esp-ws-path').value.trim() || '/ws';
  const url = `ws://${ip}:${porta}${caminho}`;

  registrarTerminal(`Tentando conectar via WebSocket: ${url}`, 'info');
  document.getElementById('conn-latency').textContent = '...';

  try {
    const ws = new WebSocket(url);
    estadoESP32.ws = ws;
    const inicioTempo = Date.now();

    ws.onopen = () => {
      const latencia = Date.now() - inicioTempo;
      document.getElementById('conn-latency').textContent = latencia;
      registrarTerminal(`WebSocket conectado com sucesso em ${latencia}ms`, 'success');
      definirEstadoConexao(true, 'WS ATIVO');
      inicializarGraficoESP32();
    };

    ws.onmessage = (evento) => processarDadosESP32(evento.data);

    ws.onerror = () => {
      registrarTerminal(
        'Erro no WebSocket — falha ao conectar. ' +
        'Verifique o endereço IP, porta e se o ESP32 está na mesma rede Wi-Fi.',
        'error'
      );
      desconectarESP32();
    };

    ws.onclose = () => {
      registrarTerminal('Conexão WebSocket encerrada', 'warn');
      if (estadoESP32.conectado) desconectarESP32();
    };

  } catch (erro) {
    registrarTerminal('Não foi possível criar a conexão WebSocket: ' + erro.message, 'error');
  }
}


// --- Conexão via HTTP Polling ---

/** Inicia o polling HTTP para receber dados do dispositivo ESP32 */
function conectarHTTP() {
  const ip = document.getElementById('esp-ip-http').value.trim() || '192.168.1.100';
  const porta = document.getElementById('esp-port-http').value.trim() || '80';
  const caminho = document.getElementById('esp-http-path').value.trim() || '/api/data';
  const intervalo = parseInt(document.getElementById('esp-poll-interval').value) || 2000;
  const url = `http://${ip}:${porta}${caminho}`;

  registrarTerminal(`HTTP Polling iniciado: ${url} (a cada ${intervalo}ms)`, 'info');

  const buscarDados = () => {
    if (!estadoESP32.conectado) return;

    const inicio = Date.now();

    fetch(url)
      .then(resposta => resposta.json())
      .then(dados => {
        const latencia = Date.now() - inicio;
        document.getElementById('conn-latency').textContent = latencia;
        processarDadosESP32(JSON.stringify(dados));
      })
      .catch(erro => {
        registrarTerminal(
          'Erro HTTP: ' + erro.message +
          ' → Certifique-se de que o ESP32 configurou o cabeçalho Access-Control-Allow-Origin: *',
          'error'
        );
      });
  };

  definirEstadoConexao(true, 'HTTP POLL');
  inicializarGraficoESP32();

  buscarDados();
  estadoESP32.intervaloHTTP = setInterval(buscarDados, intervalo);
}


// --- Conexão via MQTT (WebSocket bridge) ---

/** Inicia a conexão MQTT com o dispositivo ESP32 */
function conectarMQTT() {
  const broker = document.getElementById('esp-mqtt-broker').value.trim() || 'broker.hivemq.com';
  const porta = document.getElementById('esp-mqtt-port').value.trim() || '8884';
  const topico = document.getElementById('esp-mqtt-topic').value.trim() || 'MONITECH/home/energy';
  const clientId = document.getElementById('esp-mqtt-cid').value.trim() || 'MONITECH-WEB';

  registrarTerminal(`MQTT via WebSocket broker: wss://${broker}:${porta}/mqtt`, 'info');
  registrarTerminal(`Tópico inscrito: ${topico} | Client ID: ${clientId}`, 'info');
  registrarTerminal(
    'Atenção: Para MQTT completo em produção, integre a biblioteca mqtt.js (npm install mqtt). Modo demonstração ativo.',
    'warn'
  );

  // Modo demonstração para MQTT.
  // Em produção: import mqtt from 'mqtt'; const client = mqtt.connect(wsUrl);
  // Os dados virão diretamente do dispositivo de monitoramento conectado.
  definirEstadoConexao(true, 'MQTT ATIVO');
  inicializarGraficoESP32();
  registrarTerminal('Conexão MQTT estabelecida. Aguardando publicações do dispositivo...', 'success');

  // TODO: Integrar com broker MQTT real via mqtt.js
}


// --- Seleção de porta Serial/USB ---

/** Solicita ao usuário que selecione uma porta serial para comunicação com o ESP32 */
async function selecionarPortaSerial() {
  if (!('serial' in navigator)) {
    registrarTerminal(
      'Web Serial API não suportada neste navegador. ' +
      'Utilize Google Chrome ou Microsoft Edge para usar esta funcionalidade.',
      'error'
    );
    return;
  }

  try {
    estadoESP32.portaSerial = await navigator.serial.requestPort();
    document.getElementById('serial-port-info').style.display = '';
    registrarTerminal('Porta serial selecionada com sucesso. Clique em CONECTAR para iniciar.', 'success');
  } catch (erro) {
    registrarTerminal('Nenhuma porta selecionada: ' + erro.message, 'warn');
  }
}


// --- Conexão via Serial/USB ---

/** Inicia a leitura de dados via porta Serial/USB */
async function conectarSerial() {
  if (!estadoESP32.portaSerial) {
    registrarTerminal('Selecione uma porta serial antes de conectar.', 'error');
    return;
  }

  const baudRate = parseInt(document.getElementById('esp-baud').value) || 115200;

  try {
    await estadoESP32.portaSerial.open({ baudRate });
    registrarTerminal(`Porta serial aberta: ${baudRate} baud`, 'success');

    definirEstadoConexao(true, 'SERIAL/USB');
    inicializarGraficoESP32();

    // Configura o leitor de stream de texto
    const decodificador = new TextDecoderStream();
    estadoESP32.portaSerial.readable.pipeTo(decodificador.writable);

    const leitor = decodificador.readable.getReader();
    estadoESP32.leitorSerial = leitor;

    let buffer = '';

    // Loop assíncrono de leitura dos dados da porta serial
    (async () => {
      while (true) {
        const { value, done } = await leitor.read();
        if (done) break;

        buffer += value;
        const linhas = buffer.split('\n');
        buffer = linhas.pop(); // mantém o fragmento incompleto no buffer

        linhas.forEach(linha => {
          linha = linha.trim();
          if (linha.startsWith('{')) {
            processarDadosESP32(linha);
          } else if (linha) {
            registrarTerminal('ESP32: ' + linha, 'info');
          }
        });
      }
    })();

  } catch (erro) {
    registrarTerminal('Erro ao abrir porta serial: ' + erro.message, 'error');
  }
}


// --- Dispatcher principal de conexão ---

/** Inicia a conexão com o ESP32 conforme o protocolo selecionado */
function conectarESP32() {
  registrarTerminal('Iniciando conexão com o dispositivo ESP32...', 'info');

  estadoESP32.pacotesRecebidos = 0;
  document.getElementById('conn-packets').textContent = '0';

  const idDispositivo = document.getElementById('esp-device-id').value.trim() || 'MONITECH-001';
  document.getElementById('device-id').textContent = idDispositivo;

  const protocolo = estadoESP32.protocolo;

  if (protocolo === 'ws') conectarWebSocket();
  else if (protocolo === 'http') conectarHTTP();
  else if (protocolo === 'mqtt') conectarMQTT();
  else if (protocolo === 'serial') conectarSerial();
}


// --- Desconexão ---

/** Encerra a conexão ativa com o dispositivo ESP32 */
function desconectarESP32() {
  // Fecha o WebSocket se ativo
  if (estadoESP32.ws) {
    try { estadoESP32.ws.close(); } catch (_) { }
    estadoESP32.ws = null;
  }

  // Para o polling HTTP se ativo
  if (estadoESP32.intervaloHTTP) {
    clearInterval(estadoESP32.intervaloHTTP);
    estadoESP32.intervaloHTTP = null;
  }

  // Fecha o leitor serial se ativo
  if (estadoESP32.leitorSerial) {
    try { estadoESP32.leitorSerial.cancel(); } catch (_) { }
    estadoESP32.leitorSerial = null;
  }

  // Fecha a porta serial se aberta
  if (estadoESP32.portaSerial && estadoESP32.portaSerial.readable) {
    try { estadoESP32.portaSerial.close(); } catch (_) { }
  }

  definirEstadoConexao(false);
  registrarTerminal('Dispositivo ESP32 desconectado com sucesso.', 'warn');

  // Oculta as informações do dispositivo
  document.getElementById('esp-info-empty').style.display = '';
  document.getElementById('esp-info-data').style.display = 'none';

  // Limpa e exibe o overlay no gráfico ao vivo
  if (graficoESP32) {
    graficoESP32.data.labels = [];
    graficoESP32.data.datasets[0].data = [];
    graficoESP32.update();
  }
  document.getElementById('esp-chart-overlay').style.display = 'flex';
}


// --- Teste de conectividade (PING) ---

/** Executa um teste de conectividade com o dispositivo ESP32 */
async function verificarConexaoESP32() {
  const protocolo = estadoESP32.protocolo;

  if (protocolo === 'ws') {
    if (estadoESP32.ws && estadoESP32.ws.readyState === WebSocket.OPEN) {
      const inicio = Date.now();
      estadoESP32.ws.send(JSON.stringify({ cmd: 'ping' }));
      registrarTerminal('PING enviado via WebSocket', 'info');
      document.getElementById('conn-latency').textContent = (Date.now() - inicio) + 'ms*';
    } else {
      registrarTerminal('WebSocket não está conectado. Clique em CONECTAR primeiro.', 'error');
    }

  } else if (protocolo === 'http') {
    const ip = document.getElementById('esp-ip-http').value || '192.168.1.100';
    const porta = document.getElementById('esp-port-http').value || '80';
    const inicio = Date.now();

    fetch(`http://${ip}:${porta}/api/data`)
      .then(() => {
        const latencia = Date.now() - inicio;
        document.getElementById('conn-latency').textContent = latencia + 'ms';
        registrarTerminal(`PING OK: ${latencia}ms — dispositivo respondeu`, 'success');
      })
      .catch(erro => {
        registrarTerminal('PING falhou: ' + erro.message, 'error');
      });

  } else {
    registrarTerminal('Teste de PING disponível apenas para WebSocket e HTTP.', 'warn');
  }
}


// --- Inicialização da aba ESP32 ---

// Flag para evitar reinicialização ao trocar de aba
let esp32TabAberta = false;

/** Inicializa a aba de conexão ESP32 na primeira abertura */
function inicializarAbaEsp32() {
  esp32TabAberta = true;

  registrarTerminal('MONITECH ESP32 — Interface de conexão inicializada', 'success');
  registrarTerminal('Selecione o protocolo de comunicação, configure o endereço IP e clique em CONECTAR', 'info');
  registrarTerminal('Certifique-se de que o dispositivo ESP32 está conectado à mesma rede Wi-Fi que este computador', 'info');

  selecionarProtocolo('ws');
  definirEstadoConexao(false);
}

/** Wrapper chamado pelo HTML para selecionar o protocolo de conexão */
function selecionarProtocoloConexao(protocolo) {
  selecionarProtocolo(protocolo);
}


// ===================================================
// UTILITÁRIOS DE TEXTO — CORREÇÃO DE ENCODING
// ===================================================

/**
 * Corrige textos com encoding UTF-8 corrompido (dupla codificação).
 * @param {string} texto - Texto possivelmente corrompido
 * @returns {string} Texto corrigido
 */
function corrigirTextoCorrompido(texto) {
  if (typeof texto !== 'string') return texto;

  // Detecta padrão de dupla codificação UTF-8
  if (!/(\u00C3|\u00C2|\u00E2|\u00F0|\u00EF|\uFFFD)/.test(texto)) return texto;

  try {
    const bytes = Uint8Array.from(texto, c => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  } catch (_) {
    return texto;
  }
}

/**
 * Percorre o DOM a partir de um elemento raiz e corrige todos os textos corrompidos.
 * @param {Element} raiz - Elemento raiz da varredura (padrão: document.body)
 */
function corrigirTextosCorrompidosNaPagina(raiz = document.body) {
  if (!raiz) return;

  const atributos = ['placeholder', 'title', 'aria-label', 'value'];
  const elementos = raiz.querySelectorAll('*');

  elementos.forEach(el => {
    // Corrige atributos de texto
    atributos.forEach(attr => {
      if (el.hasAttribute && el.hasAttribute(attr)) {
        el.setAttribute(attr, corrigirTextoCorrompido(el.getAttribute(attr)));
      }
    });

    // Corrige nós de texto diretos
    el.childNodes.forEach(no => {
      if (no.nodeType === Node.TEXT_NODE) {
        no.textContent = corrigirTextoCorrompido(no.textContent);
      }
    });
  });

  document.title = corrigirTextoCorrompido(document.title);
}

// Substitui alert e confirm nativos para corrigir encoding automaticamente
const alertaNativo = window.alert.bind(window);
const confirmacaoNativa = window.confirm.bind(window);

window.alert = function (mensagem) {
  const textoCorrigido = corrigirTextoCorrompido(String(mensagem));
  const linhas = textoCorrigido.split('\n');
  const titulo = linhas[0] || '';
  const texto = linhas.slice(1).join('\n');

  // Detecta tipo pelo conteúdo
  let tipo = 'info';
  if (textoCorrigido.includes('✓')) tipo = 'success';
  if (textoCorrigido.includes('✕') || textoCorrigido.toLowerCase().includes('erro')) tipo = 'error';
  if (textoCorrigido.includes('⚠') || textoCorrigido.toLowerCase().includes('aviso')) tipo = 'warning';

  // Usa o sistema customizado
  inicializarContainerAlertas();
  mostrarAlerta(tipo, titulo, texto, 5000);
};

window.confirm = (msg) => confirmacaoNativa(corrigirTextoCorrompido(String(msg)));

// Executa a correção de encoding assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  inicializarContainerAlertas();
  aplicarTema(obterTemaSalvo(), false);
  corrigirTextosCorrompidosNaPagina();
});
