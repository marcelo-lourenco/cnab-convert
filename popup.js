const fileInput = document.getElementById('fileInput');
const processButton = document.getElementById('processButton');
const resultsDiv = document.getElementById('results');

fileInput.addEventListener('change', () => {
  const files = fileInput.files;
  if (files.length > 0) {
    processButton.disabled = false;
  } else {
    processButton.disabled = true;
  }
});

processButton.addEventListener('click', async () => {
  const files = fileInput.files;
  resultsDiv.innerHTML = '';

  for (const file of files) {
    try {
      const isValid = await validateFile(file);
      if (isValid) {
        const retornoFile = await convertRemessaToRetorno(file);
        console.log('Arquivo de retorno:', retornoFile);
        resultsDiv.innerHTML += `<p>Arquivo ${file.name} convertido com sucesso! </p>`;
        // Salvar ou exibir o arquivo de retorno
        await saveFile(retornoFile, `${file.name}`);
      } else {
        resultsDiv.innerHTML += `<p>Arquivo ${file.name} inválido.</p>`;
      }
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      resultsDiv.innerHTML += `<p>Erro ao processar arquivo ${file.name}: ${error.message}</p>`;
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
        reject('Arquivo com menos de 3 linhas.');
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
        reject(`Linhas inválidas: ${invalidLines.join(', ')}`);
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
      console.log('retornoLines:', retornoLines); // Depura retornoLines
      console.log('typeof retornoLines:', typeof retornoLines); // Depura o tipo de retornoLines
      // Gerar o arquivo de retorno (Exemplo: concatenar as linhas)
      if (Array.isArray(retornoLines)) {
        const retornoFile = retornoLines.join('\n'); // Concatena as linhas em uma string
        resolve(retornoFile); // Retorna a string
      } else {
        reject('Erro: retornoLines não é um array.');
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
  for (let i = 1; i < lines.length - 1; i++) {
    retornoLines.push(processTransaction(lines[i]));
  }

  // Processar o trailer (Registro 9)
  retornoLines.push(processTrailer(lines[lines.length - 1]));

  return retornoLines;
}




function replace(line, start, end, replacement) {
  const zeroBasedStart = start - 1;
  const zeroBasedEnd = end;
  return line.slice(0, zeroBasedStart) + replacement + line.slice(zeroBasedEnd);
}



function processHeader(line) {
  // Exemplo: Modificar o código do banco (posição 77-79)
  line = replace(line, 2,  2, '2');
  line = replace(line, 3, 9, 'RETORNO');
  return line;
}

function processTransaction(line) {
  
//  line = replace(line, 111, 116, line.slice(121, 126)); // "Data Ocorrência no Banco" copiar de "Data de Vencimento"
//  line = replace(line, 153, 165, line.slice(127, 139)); //  "Valor do pagamento" copiar de "Valor do Título"
//  line = replace(line, 147, 152, line.slice(121, 126)); // "Data Vencimento do Título" copiar de "Data de Vencimento" 
//  line = replace(line, 109, 110, '06'); // "Código de Ocorrência"  = "06"
//  line = replace(line, 254, 266, line.slice(127, 139)); // "Valor Pago" copiar de "Valor do Título"
//  line = replace(line, 295, 295, 'A'); // "Motivo do Código de Ocorrência" =  "A" - Aceito
//  line = replace(line, 296, 301, line.slice(121, 126)); // "Data do Crédito" copiar da "Data de Vencimento"

  return line;
}

function processTrailer(line) {
  return line;
}

async function saveFile(fileContent, fileName) {
  try {
    console.log('fileContent:', fileContent);
    console.log('typeof fileContent:', typeof fileContent); // Depura fileContent
    
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

      console.log(`Arquivo ${fileName.replace('.rem', '.ret')} salvo com sucesso!`); // Log the new filename
    } else {
      console.error('O usuário cancelou a operação de salvar o arquivo.');
    }
  } catch (error) {
    console.error('Erro ao salvar o arquivo:', error);
  }
}
