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
        saveFile(retornoFile, `${file.name}`);
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
        //reject(`Linhas inválidas: ${invalidLines.join(', ')}`);
        reject(resultsDiv.innerHTML += `<p><b>Arquivo ${file.name} inválido</b>. - Linhas inválidas: ${invalidLines.join(', ')}</p>`);
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
      const retornoFile = retornoLines.join('\n'); // Concatena as linhas em uma string
      resolve(retornoFile); // Retorna a string
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

function processHeader(headerLine) {
  // Implementar lógica para processar o header do arquivo de remessa
  // Extrair informações relevantes, como data, agência, conta, etc.
  // E criar o header do arquivo de retorno com os dados correspondentes
  // Exemplo:
  // return `0${headerLine.substring(1, 400)}`;
  return headerLine;
}

function processTransaction(transactionLine) {
  // Implementar lógica para processar a transação do arquivo de remessa
  // Extrair informações relevantes, como número do título, valor, data de vencimento, etc.
  // E criar a linha de transação do arquivo de retorno com os dados correspondentes
  // Exemplo:
  // return `1${transactionLine.substring(1, 400)}`;
  return transactionLine;
}

function processTrailer(trailerLine) {
  // Implementar lógica para processar o trailer do arquivo de remessa
  // Extrair informações relevantes, como número total de registros, etc.
  // E criar o trailer do arquivo de retorno com os dados correspondentes
  // Exemplo:
  // return `9${trailerLine.substring(1, 400)}`;
  return trailerLine;
}



async function saveFile(fileContent, fileName) {
  try {
    console.log('fileContent:', fileContent);
    console.log('typeof fileContent:', typeof fileContent); // Depura fileContent
    // Request File System Access API permission
    const [handle] = await window.showSaveFilePicker({
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