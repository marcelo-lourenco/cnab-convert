const fileInput = document.getElementById('fileInput');
const processButton = document.getElementById('processButton');
const messageElement = document.getElementById('message');
let vlTotal = 0;

function displayMessage(type, message) {
  messageElement.className = '';
  messageElement.classList.add(`${type}-message`);
  messageElement.textContent = message;
  messageElement.style.display = 'block';
}

fileInput.addEventListener('change', () => {
  const files = fileInput.files;
  const selectedFileNamesDisplay = document.querySelector('.success-message');
  if (files.length > 0) {
    const selectedFileNames = Array.from(files).map(file => file.name);
    displayMessage('info', `Arquivo(s) selecionado(s):\n ${selectedFileNames.join('\n')}`);
    processButton.disabled = false;
  } else {
    selectedFileNamesDisplay.style.display = 'none';
    processButton.disabled = true;
  }
});

processButton.addEventListener('click', async () => {
  const files = fileInput.files;
  for (const file of files) {
    try {
      const isValid = await validateFile(file);
      if (isValid) {
        const retornoFile = await convertRemessaToRetorno(file);
        displayMessage('success', `Arquivo convertido com sucesso!\n ${file.name}`);
        await saveFile(retornoFile, `${file.name}`);
      } else {
        console.error(`Arquivo inválido.\n ${file.name}`);
        displayMessage('error', `Arquivo inválido.\n ${file.name}`);
      }
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      displayMessage('error', `Erro ao processar arquivo ${file.name}: ${error.message}`);
    }
  }
});

async function validateFile(file) {
  // Validação básica de tamanho da linha
  const reader = new FileReader();
  let lines = [];
  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      lines = e.target.result.split('\n');

      // Remove a última linha se estiver vazia
      if (lines[lines.length - 1].trim() === '') {
        lines.pop();
      }

      if (lines.length < 3) {
        reject(displayMessage('error', 'Arquivo com menos de 3 linhas.'));
        return;
      }

      let isValid = true;
      let invalidLines = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length !== 400) {
          isValid = false;
          invalidLines.push(i + 1);
        }
      }

      if (isValid) {
        // 0 = Header, 1 = Transação, 9 = Trailer
        if (lines[0].startsWith('0') && lines[lines.length - 1].startsWith('9')) {
          for (let i = 1; i < lines.length - 1; i++) {
            if (!lines[i].startsWith('1')) {
              isValid = false;
              invalidLines.push(i + 1);
            }
          }
        } else {
          isValid = false;
          invalidLines.push(1, lines.length);
        }
      }

      if (!isValid) {
        reject(displayMessage('error', `Linhas inválidas: ${invalidLines.join(', ')}`));
      } else {
        resolve(true);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

async function convertRemessaToRetorno(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      const lines = e.target.result.split('\n');
      // Processar o arquivo de remessa (implementar lógica de conversão)
      const retornoLines = await processRemessa(lines);
      // Gerar o arquivo de retorno (Exemplo: concatenar as linhas)
      if (Array.isArray(retornoLines)) {
        const retornoFile = retornoLines.join('\n'); // Concatena as linhas em uma string
        resolve(retornoFile); // Retorna a string
      } else {
        reject('Erro: retornoLines não é um array.');
        reject(displayMessage('error', 'Erro: retornoLines não é um array.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

async function processRemessa(lines) {
  const retornoLines = [];
  // Processar o header (Registro 0)
  retornoLines.push(processHeader(lines[0]));

  // Processar as transações (Registro 1)
  let qttTransaction = 0; // Inicializa a contagem de transações
  for (let i = 1; i < lines.length - 2; i++) {
    retornoLines.push(processTransaction(lines[i]));
    qttTransaction++; // Incrementa a contagem a cada transação processada
  }

  // Processar o trailer (Registro 9)
  retornoLines.push(processTrailer(lines[lines.length - 2], qttTransaction)); // Passa a quantidade de transações para o trailer

  return retornoLines;
}

function replace(line, start, end, replacement) {
  const basedStart = start - 1;
  return line.slice(0, basedStart) + replacement + line.slice(end);
}

function now(format) {
  const n = new Date();
  const dd = n.getDate().toString().padStart(2, '0');
  const mm = (n.getMonth() + 1).toString().padStart(2, '0');
  const aa = n.getFullYear().toString().slice(-2);
  const aaaa = n.getFullYear().toString();
  let dt;
  if (format === 'ddmmaa') {
    dt = `${dd}${mm}${aa}`;
  } else if (format === 'ddmmaaaa') {
    dt = `${dd}${mm}${aaaa}`;
  }
  return dt;
}

function processHeader(line) {
  line = replace(line, 2, 2, '2'); // 1 - Identificação do Arquivo-Retorno
  line = replace(line, 3, 9, 'RETORNO'); // 7 -Literal Retorno
  //line = replace(line, 12, 26, 'COBRANCA'.padEnd(15, ' ')); // 15 - Literal Serviço
  line = replace(line, 95, 100, now('ddmmaa')); // 6 - Data da Gravação do Arquivo (data corrente DDMMAA)
  line = replace(line, 101, 108, '01600000'); // 8 - Densidade de Gravação
  line = replace(line, 109, 113, '99999'); // 5 -Nº Aviso Bancário
  line = replace(line, 114, 379, ''.padEnd(266, ' ')) // 266 - Branco
  line = replace(line, 380, 385, now('ddmmaa')); // 6 - Data do Crédito (data corrente DDMMAA)
  line = replace(line, 386, 394, ''.padEnd(9, ' ')); // 9 - Branco
  return line;
}


function processTransaction(line) {

  let originalLine = line;

  line = replace(line, 63, 70, '00000000'); // 8 - Zeros
  line = replace(line, 83, 92, '0000000000'); // 10 - Uso do Banco - Zeros
  line = replace(line, 93, 104, '000000000000'); // 12 - Uso do Banco - Zeros
  line = replace(line, 105, 105, 'R'); // 1 - Indicador de Rateio Crédito "R" ou "0"
  line = replace(line, 106, 107, '00'); // 2 - Pagamento Parcial 
  line = replace(line, 108, 108, originalLine.slice(23, 24)); // 1 - Carteira "9" posição 24 da linha original
  line = replace(line, 109, 110, '06'); // 2 - Identificação da Ocorrência
  line = replace(line, 111, 116, now('ddmmaa')); // 6 - Data Ocorrência no Banco (data corrente DDMMAA)
  line = replace(line, 117, 126, originalLine.slice(110, 120)); // 10 - Documento posição 111 a 120 da linha original
  line = replace(line, 127, 146, originalLine.slice(70, 82).padStart(20, '0')); // 10 -Identificação do Título no Banco - posição 71 a 81 + digito 82 a 82 da linha original
  line = replace(line, 147, 152, originalLine.slice(120, 126)); // 6 - Data Venciment do Titúlo ( DDMMAA) posição 121 a 126 da linha original
  line = replace(line, 153, 165, originalLine.slice(126, 139)); //  "Valor do Título" posição 127 a 139 da linha original
  line = replace(line, 166, 168, originalLine.slice(139, 142)); // "Banco Cobrador" posição 140 a 142 da linha original
  line = replace(line, 169, 173, originalLine.slice(142, 147)); // "Agência Cobradora" posição 143 a 147 da linha original
  line = replace(line, 174, 175, ''.padEnd(2, ' ')); // 2 - Branco - Especie Título
  line = replace(line, 176, 188, '0000000000000'); // 13 - Despesas de cobrança para os Códigos de Ocorrência
  line = replace(line, 189, 201, '0000000000000'); // 13 - Outras Despesas Custas de Protesto
  line = replace(line, 202, 214, '0000000000000'); // 13 - Juros Operação em Atraso
  line = replace(line, 215, 227, '0000000000000'); // 13 - IOF Devido
  line = replace(line, 228, 240, '0000000000000'); // 13 - Abatimento Concedido sobre o Título
  line = replace(line, 241, 253, '0000000000000'); // 13 - Desconto Concedido
  line = replace(line, 254, 266, originalLine.slice(126, 139)); // 13 -Valor Pago - posição 127 a 139 da linha original
  line = replace(line, 267, 279, '0000000000000'); // 13 - Juros de Mora
  line = replace(line, 280, 292, '0000000000000'); // 13 - Outros Créditos
  line = replace(line, 293, 294, ''.padEnd(2, ' ')); // 2 - Branco
  line = replace(line, 295, 295, 'A'); // "Motivo do Código de Ocorrência" =  "A" - Aceito
  line = replace(line, 296, 301, originalLine.slice(120, 126)); // 6 - Data do Crédito ( DDMMAA) posição 121 a 126 da linha original
  line = replace(line, 302, 304, ''.padEnd(3, ' ')); // Origem Pagamento - 2 - Branco 
  line = replace(line, 305, 314, ''.padEnd(10, ' ')); // 10 | Brancos
  line = replace(line, 315, 318, '0000'); // 4 - Quando Cheque Bradesco informe 0237  - Código do Banco
  line = replace(line, 319, 328, '00'); // 2 - Motivos das Rejeições para os Códigos de Ocorrência das Posições
  line = replace(line, 329, 368, ''.padEnd(40, ' ')); //40 | Brancos
  line = replace(line, 369, 370, ''.padEnd(2, ' ')); //Número do Cartório | 2 | 
  line = replace(line, 371, 380, ''.padEnd(10, ' ')); //Número do Protocolo | 10
  line = replace(line, 381, 394, ''.padEnd(14, ' ')); //14 - Brancos
  line = replace(line, 395, 400, originalLine.slice(394, 400)); //Nº Sequencial de Registro | 6 - | posição 395, 400 da linha original

  vlTotal = vlTotal + parseFloat(originalLine.slice(126, 139)); //posição 127 a 139 da linha original (acumula o valor total)
  //console.log(String(vlTotal).padStart(14, '0'))

  return line;
}

function processTrailer(line, qttLines) {
  let originalLine = line;
  let quantityLines = String(qttLines);
  let lastSeqNum = qttLines + 2

  line = replace(line, 1, 1, '9'); // Identificação do Registro | 1 | 9
  line = replace(line, 2, 2, '2'); // Identificação do Retorno | 1 | 2
  line = replace(line, 3, 4, '01'); // Identificação Tipo de Registro | 2 | 1
  line = replace(line, 5, 7, '237'); // Código do Banco | 3 | 237
  line = replace(line, 8, 17, ''.padEnd(10, ' ')); // Brancos | 10 | Brancos
  line = replace(line, 18, 25, quantityLines.padStart(8, '0')); // Quantidade de Títulos em Cobrança | 8 | Quantidade de Títulos em Cobrança
  line = replace(line, 26, 39, String(vlTotal).padStart(14, '0')); // Valor Total em Cobrança | 14 | Valor Total em Cobrança
  line = replace(line, 40, 47, '99999999'); // Nº do Aviso Bancário | 8 | Nº do Aviso Bancário
  line = replace(line, 48, 57, ''.padEnd(10, ' ')); // Brancos | 10 | Brancos
  line = replace(line, 58, 62, ''.padStart(5, '0')); // Quantidade de Registros- Ocorrência 02 - Confirmação de Entradas | 5 | Quantidade de Registros
  line = replace(line, 63, 74, ''.padEnd(12, '0')); // "Valor dos Registros - Ocorrência 02 - Confirmação de Entradas" | 12 | Valor dos Registros
  line = replace(line, 75, 86, String(vlTotal).padStart(12, '0')); // "Valor dos Registros-Ocorrência 06 - Liquidação" | 12 | Valor dos Registros
  line = replace(line, 87, 91, quantityLines.padStart(5, '0')); // "Quantidade dos Registros - Ocorrência 06 - Liquidação" | 5 | Quantidade de Registros
  line = replace(line, 92, 103, String(vlTotal).padStart(12, '0')); // Valor dos Registros - Ocorrência 06 | 12 | Valor dos Registros
  line = replace(line, 104, 108, ''.padStart(5, '0')); // "Quantidade dos Registros - Ocorrência 09 e 10-Títulos baixados" | 5 | Quantidade de Registros Baixados
  line = replace(line, 109, 120, '20'.padStart(12, '0')); // "Valor dos Registros - Ocorrência 09 e 10 - Títulos Baixados" | 12 | Valor dos Registros Baixados
  line = replace(line, 121, 125, ''.padStart(5, '0')); // "Quantidade de Registros - Ocorrência 13 - Abatimento Cancelado" | 5 | Quantidade de Registros
  line = replace(line, 126, 137, ''.padStart(12, '0')); // Valor dos Registros - Ocorrência 13 - Abatimento Cancelado | 12 | Valor dos Registros
  line = replace(line, 138, 142, ''.padStart(5, '0')); // "Quantidade dos Registros - Ocorrência 14 - Vencimento Alterado" | 5 | Quantidade dos Registros
  line = replace(line, 143, 154, '54'.padStart(12, '0')); // Valor dos Registros - Ocorrência 14 - Vencimento Alterado | 12 | Valor dos Registros
  line = replace(line, 155, 159, ''.padStart(5, '0')); // Quantidade dos Registros- Ocorrência 12 - Abatimento Concedido | 5 | Quantidade de Registros
  line = replace(line, 160, 171, ''.padStart(12, ' ')); // Valor dos Registros - Ocorrência 12 - Abatimento Concedido | 12 | Valor dos Registros
  line = replace(line, 172, 176, '76'.padStart(5, '0')); // Quantidade dos Registros- Ocorrência 19-Confirmação da Instrução Protesto | 5 | Quantidade de Registros
  line = replace(line, 177, 188, ''.padStart(12, '0')); // "Valor dos Registros - Ocorrência 19 - Confirmação da Instrução de Protesto" | 12 | Valor dos Registros
  line = replace(line, 189, 362, ''.padEnd(174, ' ')); // Brancos | 174 | Brancos
  line = replace(line, 363, 377, '77'.padStart(15, '0')); // Valor Total dos Rateios Efetuados | 15 | Valor Total Rateios
  line = replace(line, 378, 385, ''.padStart(8, '0')); // Quantidade Total dos Rateios Efetuados | 8 | Quantidade Rateios Efetuados
  line = replace(line, 386, 394, ''.padEnd(9, ' ')); // Brancos | 9 | Brancos
  line = replace(line, 395, 400, String(lastSeqNum).padStart(6, '0')); // Número Sequencial do Registro | 6 | Nº Sequencial do Registro
  return line;
}

async function saveFile(fileContent, fileName) {
  try {
    if (typeof fileContent !== 'string') {
      throw new Error('fileContent não é uma string.');
    }

    // Request File System Access API permission
    const handle = await window.showSaveFilePicker({
      suggestedName: fileName.replace('.rem', '.ret'), // Remove .rem and add .ret
      types: [
        {
          description: 'Arquivos de Retorno',
          accept: {
            'text/plain': ['.ret']
          }
        }
      ]
    });

    if (handle) {
      // Create a writable file stream
      const writable = await handle.createWritable();
      await writable.write(fileContent); // Grava a string diretamente
      await writable.close();
      displayMessage('success', `Arquivo salvo com sucesso: ${fileName.replace('.rem', '.ret')}`);
    } else {
      displayMessage('alert', `Operação cancelada pelo usuário.`);
    }
  } catch (error) {
    displayMessage('error', `Erro ao salvar o arquivo: ${error}`);
  }
}