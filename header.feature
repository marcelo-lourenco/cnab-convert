                  | Campo                                           | Posição | Descrição                                                                      | Remessa  | Retorno  |
                  | 11 - Identificação do Tipo de Arquivo           | 021-022 | Código que identifica o tipo de arquivo: "01" para Remessa e "02" para Retorno | 01       | 02       |
                  | 12 - Número da Versão do Layout do Arquivo      | 023-026 | Versão do layout do arquivo utilizado                                          | 400      | 400      |
                  | 13 - Número Sequencial do Arquivo               | 027-030 | Número sequencial que identifica o arquivo dentro do lote                      | Variável | Variável |
                  | 14 - Data de Gravação do Arquivo                | 031-038 | Data de criação do arquivo no formato AAAAMMDD                                 | Variável | Variável |
                  | 15 - Hora de Gravação do Arquivo                | 039-044 | Hora de criação do arquivo no formato HHMMSS                                   | Variável | Variável |
                  | 16 - Identificação da Empresa                   | 045-074 | Código da empresa que gerou o arquivo                                          | Variável | Variável |
                  | 17 - Nome da Empresa                            | 075-134 | Nome completo da empresa que gerou o arquivo                                   | Variável | Variável |
                  | 18 - Número da Conta Corrente                   | 135-148 | Número da conta corrente da empresa no banco                                   | Variável | Variável |
                  | 19 - Número da Agência                          | 149-152 | Número da agência da conta corrente                                            | Variável | Variável |
                  | 20 - Dígito Verificador da Agência              | 153     | Dígito verificador da agência                                                  | Variável | Variável |
                  | 21 - Identificação do Ambiente                  | 154     | Código que identifica o ambiente: "1" para produção e "2" para desenvolvimento | 1 ou 2   | 1 ou 2   |
                  | **22 - Número da Versão do Layout do Arquivo ** | 155-158 | Versão do layout do arquivo utilizado                                          | 400      | 400      |
                  | 23 - Identificação do Tipo de Registro          | 159-160 | Código que identifica o tipo de registro: "0" para registro header label       | 00       | 00       |

                  Os campos 13, 14 e 15 variam de acordo com o arquivo gerado.
Os campos 16, 17, 18, 19 e 20 correspondem à informação da empresa que gerou o arquivo.
O campo 21 é definido de acordo com o ambiente em que o arquivo foi gerado.



                  | Campo                                                 | Posição   | Descrição                                                                                      | Remessa  | Retorno  |
                  | **1 - Número da Conta Corrente                        | 001-014   | Número da conta corrente do beneficiário                                                       | Variável | Variável |
                  | **2 - Dígito Verificador da Conta Corrente            | 015       | Dígito verificador da conta corrente                                                           | Variável | Variável |
                  | **3 - Número da Agência                               | 016-019   | Número da agência da conta corrente                                                            | Variável | Variável |
                  | **4 - Dígito Verificador da Agência                   | 020       | Dígito verificador da agência                                                                  | Variável | Variável |
                  | **5 - Código do Banco                                 | 021-023   | Código do banco                                                                                | 033      | 033      |
                  | **6 - Identificação do Tipo de Operação               | 024       | Código que identifica o tipo de operação: 1 para pagamento                                     | 1        | 1        |
                  | **7 - Número da Conta Corrente do Cedente             | 025-038   | Número da conta corrente do cedente                                                            | Variável | Variável |
                  | **8 - Dígito Verificador da Conta Corrente do Cedente | 039       | Dígito verificador da conta corrente do cedente                                                | Variável | Variável |
                  | **9 - Número da Agência do Cedente                    | 040-043   | Número da agência da conta corrente do cedente                                                 | Variável | Variável |
                  | **10 - Dígito Verificador da Agência do Cedente       | 044       | Dígito verificador da agência do cedente                                                       | Variável | Variável |
                  | **11 - Identificação do Tipo de Inscrição             | 045       | Código que identifica o tipo de inscrição: 1 para CPF e 2 para CNPJ                            | 1 ou 2   | 1 ou 2   |
                  | **12 - Número de Inscrição                            | 046-059   | Número da inscrição do cedente (CPF ou CNPJ)                                                   | Variável | Variável |
                  | **13 - Nome do Cedente                                | 060-119   | Nome do cedente                                                                                | Variável | Variável |
                  | **14 - Valor do Título                                | 0120-0129 | Valor do título a ser pago                                                                     | Variável | Variável |
                  | **15 - Data de Vencimento do Título                   | 0130-0137 | Data de vencimento do título no formato AAAAMMDD                                               | Variável | Variável |
                  | **16 - Identificação da Modalidade de Cobrança        | 0138      | Código que identifica a modalidade de cobrança                                                 | Variável | Variável |
                  | **17 - Identificação da Carteira                      | 0139      | Código que identifica a carteira                                                               | Variável | Variável |
                  | **18 - Número do Título                               | 0140-0151 | Número do título                                                                               | Variável | Variável |
                  | **19 - Nosso Número                                   | 0152-0163 | Nosso número                                                                                   | Variável | Variável |
                  | **20 - Data do Pagamento                              | 0164-0171 | Data do pagamento no formato AAAAMMDD                                                          | -        | Variável |
                  | **21 - Valor do Pagamento                             | 0172-0181 | Valor do pagamento                                                                             | -        | Variável |
                  | **22 - Número do Contrato                             | 0182-0193 | Número do contrato                                                                             | Variável | Variável |
                  | **23 - Data do Crédito                                | 0194-0201 | Data do crédito do pagamento no formato AAAAMMDD                                               | -        | Variável |
                  | **24 - Identificação da Ocorrência                    | 0202-0203 | Código que identifica a ocorrência do pagamento                                                | -        | Variável |
                  | **25 - Código do Banco                                | 0204-0206 | Código do banco do cedente                                                                     | -        | Variável |
                  | **26 - Identificação da Conta do Cedente              | 0207-0208 | Código que identifica o tipo de conta do cedente: 1 para conta corrente, 2 para conta poupança | -        | Variável |
                  | **27 - Número da Conta do Cedente                     | 0209-0222 | Número da conta do cedente                                                                     | -        | Variável |
                  | **28 - Dígito Verificador da Conta do Cedente         | 0223      | Dígito verificador da conta do cedente                                                         | -        | Variável |
                  | **29 - Número da Agência do Cedente                   | 0224-0227 | Número da agência da conta do cedente                                                          | -        | Variável |
                  | **30 - Dígito Verificador da Agência do Cedente       | 0228      | Dígito verificador da agência do cedente                                                       | -        | Variável |
                  | **31 - Identificação da Empresa                       | 0229-0258 | Código da empresa que gerou o arquivo                                                          | Variável | Variável |
Observações:
Os campos 1, 2, 3, 4, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 22, 24, 25, 26, 27, 28, 29, 30, 31 variam de acordo com os dados do título e do cedente.
Os campos 20, 21, 23, 24, 25, 26, 27, 28, 29, 30, 31 são preenchidos somente no arquivo de retorno.
Conclusão:
O "Registro de Transação - Tipo 1" possui diferenças significativas entre o Arquivo-Remessa e o Arquivo-Retorno. No arquivo de retorno, os campos relacionados ao pagamento, como data, valor e ocorrência, são preenchidos. Além disso, os campos referentes à conta corrente do cedente também são incluídos. As informações do título e do cedente permanecem as mesmas em ambos os arquivos, porém alguns campos podem variar de acordo com o caso específico.