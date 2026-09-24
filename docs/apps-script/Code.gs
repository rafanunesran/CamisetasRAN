/**
 * CamisetasRAN - Upload de imagens (estampas e mockups) para o Google Drive
 *
 * Recebe as imagens enviadas pelo backstage.html (função uploadToDrive),
 * salva no Google Drive e devolve a URL pública da imagem.
 *
 * COMO USAR: veja docs/apps-script/README.md no repositório.
 * Copie e cole ESTE ARQUIVO INTEIRO no editor do Apps Script (Code.gs),
 * substituindo todo o conteúdo antigo.
 */

// ==================== CONFIGURAÇÃO ====================
const CONFIG = {
  // ID da pasta do Drive onde as imagens serão salvas.
  // Deixe vazio ('') para o script criar/usar automaticamente a pasta FOLDER_NAME.
  // Para usar uma pasta existente, abra a pasta no Drive e copie o ID do final da URL:
  // https://drive.google.com/drive/folders/ESTE_TRECHO_E_O_ID
  FOLDER_ID: '',

  // Nome da pasta criada automaticamente quando FOLDER_ID estiver vazio.
  FOLDER_NAME: 'CamisetasRAN - Imagens',

  // E-mail que recebe o alerta quando o acesso ao Drive parar de funcionar.
  ALERT_EMAIL: 'rafaelnf93@gmail.com',

  // Tamanho máximo por imagem (em MB).
  MAX_SIZE_MB: 20
};
// ======================================================


/**
 * Recebe o upload vindo do site.
 * Corpo esperado (JSON): { name, type, image }  -> image = data URL em base64
 * Resposta: { result: 'success', url, id } ou { result: 'error', error }
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Nenhum dado recebido.');
    }

    const payload = JSON.parse(e.postData.contents);
    if (!payload.image) {
      throw new Error('Campo "image" ausente.');
    }

    // Aceita tanto "data:image/png;base64,AAAA" quanto só "AAAA"
    const parts = String(payload.image).split(',');
    const base64 = parts.length > 1 ? parts[1] : parts[0];
    const mimeMatch = parts.length > 1 ? parts[0].match(/data:([^;]+);/) : null;
    const mimeType = payload.type || (mimeMatch ? mimeMatch[1] : 'image/png');

    if (mimeType.indexOf('image/') !== 0) {
      throw new Error('Tipo de arquivo não permitido: ' + mimeType);
    }

    const bytes = Utilities.base64Decode(base64);
    if (bytes.length > CONFIG.MAX_SIZE_MB * 1024 * 1024) {
      throw new Error('Imagem maior que ' + CONFIG.MAX_SIZE_MB + ' MB.');
    }

    const fileName = sanitizeName_(payload.name) || ('imagem_' + Date.now());
    const blob = Utilities.newBlob(bytes, mimeType, fileName);

    const folder = getFolder_();
    const file = folder.createFile(blob);

    // Permite que o site exiba a imagem para qualquer pessoa com o link
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (shareErr) {
      console.warn('Não foi possível compartilhar o arquivo: ' + shareErr);
    }

    // Formato de URL que o site já sabe converter (getDisplayUrl)
    const url = 'https://drive.google.com/uc?export=view&id=' + file.getId();
    return json_({ result: 'success', url: url, id: file.getId() });

  } catch (err) {
    console.error(err);
    const message = String(err && err.message ? err.message : err);
    if (message.indexOf('DriveApp') !== -1 || message.indexOf('permiss') !== -1) {
      notifyFailure_(message);
    }
    return json_({ result: 'error', error: message });
  }
}


/**
 * Teste rápido pelo navegador: abra a URL do /exec.
 * Retorna { result: 'ok' } se o acesso ao Drive estiver funcionando.
 */
function doGet() {
  try {
    const folder = getFolder_();
    return json_({ result: 'ok', folder: folder.getName() });
  } catch (err) {
    return json_({ result: 'error', error: String(err && err.message ? err.message : err) });
  }
}


/**
 * EXECUTE ESTA FUNÇÃO PELO EDITOR sempre que colar/editar o script.
 * Ela pede TODAS as permissões necessárias de uma vez (Drive, e-mail e acionadores)
 * e já instala a verificação diária.
 */
function autorizar() {
  const folder = getFolder_();
  MailApp.getRemainingDailyQuota();
  instalarVerificacaoDiaria();
  console.log('Tudo autorizado! Pasta de imagens: ' + folder.getName() + ' (' + folder.getUrl() + ')');
}


/**
 * Verificação automática (roda 1x por dia pelo acionador).
 * Se o acesso ao Drive tiver caído, envia um e-mail de alerta.
 */
function verificarAcessoDrive() {
  try {
    const folder = getFolder_();
    // Testa escrita de verdade: cria e apaga um arquivo temporário
    const temp = folder.createFile('teste_verificacao.txt', 'ok', 'text/plain');
    temp.setTrashed(true);
    console.log('Acesso ao Drive OK.');
  } catch (err) {
    notifyFailure_(String(err && err.message ? err.message : err));
  }
}


/**
 * Cria o acionador diário de verificarAcessoDrive (sem duplicar).
 * Já é chamada por autorizar(); não precisa rodar separadamente.
 */
function instalarVerificacaoDiaria() {
  const exists = ScriptApp.getProjectTriggers().some(function (t) {
    return t.getHandlerFunction() === 'verificarAcessoDrive';
  });
  if (!exists) {
    ScriptApp.newTrigger('verificarAcessoDrive').timeBased().everyDays(1).atHour(8).create();
    console.log('Verificação diária instalada (por volta das 8h).');
  } else {
    console.log('Verificação diária já estava instalada.');
  }
}


// ==================== FUNÇÕES INTERNAS ====================

function getFolder_() {
  const props = PropertiesService.getScriptProperties();

  // 1. Pasta definida manualmente na configuração
  if (CONFIG.FOLDER_ID) {
    return DriveApp.getFolderById(CONFIG.FOLDER_ID);
  }

  // 2. Pasta criada anteriormente pelo script (ID salvo)
  const savedId = props.getProperty('FOLDER_ID');
  if (savedId) {
    try {
      const saved = DriveApp.getFolderById(savedId);
      if (!saved.isTrashed()) return saved;
    } catch (ignored) {
      // Pasta apagada ou sem acesso: procura/cria outra abaixo
    }
  }

  // 3. Procura pelo nome ou cria uma nova
  const found = DriveApp.getFoldersByName(CONFIG.FOLDER_NAME);
  let folder = null;
  while (found.hasNext()) {
    const candidate = found.next();
    if (!candidate.isTrashed()) { folder = candidate; break; }
  }
  if (!folder) folder = DriveApp.createFolder(CONFIG.FOLDER_NAME);

  props.setProperty('FOLDER_ID', folder.getId());
  return folder;
}

function sanitizeName_(name) {
  if (!name) return '';
  return String(name).replace(/[\\/:*?"<>|]/g, '_').slice(0, 150);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Envia no máximo 1 alerta a cada 6 horas para não lotar a caixa de e-mail
function notifyFailure_(message) {
  try {
    const props = PropertiesService.getScriptProperties();
    const last = Number(props.getProperty('LAST_ALERT') || 0);
    if (Date.now() - last < 6 * 60 * 60 * 1000) return;

    MailApp.sendEmail(
      CONFIG.ALERT_EMAIL,
      'CamisetasRAN: upload de imagens parou de funcionar',
      'O Apps Script de upload perdeu acesso ao Google Drive.\n\n' +
      'Erro: ' + message + '\n\n' +
      'Como resolver:\n' +
      '1. Abra o projeto em https://script.google.com\n' +
      '2. Selecione a função "autorizar" e clique em Executar\n' +
      '3. Aceite todas as permissões\n'
    );
    props.setProperty('LAST_ALERT', String(Date.now()));
  } catch (mailErr) {
    // Se nem o e-mail funcionar, a autorização geral caiu; só registra no log
    console.error('Falha ao enviar alerta: ' + mailErr);
  }
}
