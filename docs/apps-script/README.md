# Apps Script de upload de imagens

O `backstage.html` envia as imagens de **estampas** (Estoque) e **mockups** (Produtos)
para um Google Apps Script, que salva no Google Drive. O código completo desse script
está em [`appscript`](../../appscript) (na raiz do repositório).

## O que esta versão faz

- Salva as imagens numa pasta do Drive (cria a pasta `CamisetasRAN - Imagens` automaticamente, ou usa a que você definir em `CONFIG.FOLDER_ID`).
- Aceita apenas imagens, com limite de tamanho (`CONFIG.MAX_SIZE_MB`).
- Tem a função **`autorizar`**, que pede todas as permissões de uma vez e instala a verificação diária.
- **Verificação diária** (`verificarAcessoDrive`): testa se o script ainda consegue gravar no Drive e envia um e-mail se não conseguir.
- Também envia o e-mail de alerta se um upload falhar por falta de permissão (no máximo 1 e-mail a cada 6h).
- Abrir a URL `/exec` no navegador mostra `{"result":"ok"}` quando está tudo funcionando.
- **Estampas sem limite de tamanho**: o PNG é enviado em partes (upload retomável do Drive) e chega ao Drive byte a byte igual ao original. O limite `MAX_SIZE_MB` vale só para os mockups.
- **Download da imagem original em partes** (`/exec?action=fileInfo&id=...` e `action=chunk`): usado pelo botão **Gerar Arquivo** do Relatório de Produção e Compras para montar o PNG de impressão. Só entrega arquivos da pasta de imagens do sistema.
- Arquivos grandes (ex.: estampas de 600 DPI com 100+ MB) funcionam: tanto o envio quanto o download são feitos em partes de 8 MB.
- A primeira execução de `autorizar` depois desta versão pede também a permissão "conectar a um serviço externo" (necessária para a Drive API).

## Instalação (copiar e colar)

1. Abra o projeto do script em https://script.google.com (com a conta dona da implantação atual).
2. Abra o arquivo `Código.gs` / `Code.gs`, **apague todo o conteúdo** e cole o conteúdo inteiro do arquivo [`appscript`](../../appscript).
   - Opcional: se quiser continuar salvando na pasta antiga, coloque o ID dela em `FOLDER_ID`.
3. Clique em **Salvar** (ícone de disquete).
4. No seletor de funções (ao lado de "Depurar"), escolha **`autorizar`** e clique em **Executar**.
   - Aceite todas as permissões. Se aparecer "O Google não verificou este app": **Avançado → Acessar (não seguro)**.
   - O log deve mostrar `Tudo autorizado!`.
5. **Implantar → Gerenciar implantações → lápis (editar)** na implantação existente:
   - Versão: **Nova versão**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
   - Clique em **Implantar**.

   Editando a implantação existente, a URL continua a mesma e **não é preciso mudar nada no site**.
6. Teste: abra a URL do `/exec` no navegador. Deve aparecer `{"result":"ok",...}`. Depois suba uma imagem pelo site.

## Se o erro voltar

Você vai receber um e-mail "CamisetasRAN: upload de imagens parou de funcionar".
Para resolver, repita o **passo 4** (executar `autorizar`).

Regra de ouro: **sempre que editar o script, execute `autorizar` antes de implantar.**
