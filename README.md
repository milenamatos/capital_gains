# Capital Gains

Este projeto calcula o imposto a ser pago sobre lucros ou prejuízos de operações no mercado financeiro de ações. 
Os dados passados, via linha de comando, são as operações realizadas, sendo que devem estar no formato JSON e conter os seguintes campos:

- operation: pode ser do tipo **buy** ou **sell**
- unit-cost: custo unitário da ação
- quantity: quantidade de ações]

Exemplo de entrada:

`[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"sell", "unit-cost":20.00, "quantity": 5000}]`

# Como rodar o projeto

## Rodando manualmente

Para rodar manualmente você vai precisar ter o Node e o NPM instalado em sua máquina: 

- Link para download: https://nodejs.org/en/download/

Em seguida basta executar os seguintes comandos no terminal, na raiz do projeto:

### Passo 1: Instalar os pacotes
```
npm install
```

### Passo 2: Executar

É possível executar a aplicação de duas formas: 

- Passando um arquivo *.txt* que contém as listas de operações:

```
node index.js < input.txt
```

**OBS**: Deve ser colocado no final do arquivo 2 linhas em branco, para que aplicação reconheça a última linha vazia e inicie os cálculos. Existe um arquivo **input.txt** no projeto, contendo 3 listas, disponível para testes.

- Digitando as operações no terminal:

```
node index.js
<lista_de_operacoes>
```

## Rodando com Docker

Você vai precisar ter o Docker e o Docker Compose instalados na sua máquina. Os links para download e instalação são:
- Docker: https://docs.docker.com/engine/install/
- Docker Compose: https://docs.docker.com/compose/install/

### Passo 1: Executar

Para fazer o build e executar o projeto pela primeira vez, basta executar apenas um comando no terminal (seguido dos inputs), na raiz do projeto. Para as seguintes execuções, será utilizado o mesmo comando:

`docker-compose run capital-gains`

Este comando deve ser acompanhado dos dados de input, exatamente como é feito na execução manual: **passando um arquivo .txt** ou **digitando as operações no terminal**. E as mesmas condições se aplicam. Exemplo:

- Passando um arquivo *.txt* que contém as listas de operações:

```
docker-compose run capital-gains < input.txt
```

- Digitando as operações no terminal:

```
docker-compose run capital-gains
<lista_de_operacoes>
```

# Testando o projeto

Para rodar os testes do projeto basta executar os seguintes comandos:

1. **Apenas se estiver rodando o projeto com Docker**, execute este comando primeiro para acessar o container: 
    ```
    docker-compose run capital-gains bash
    ```

2. Escolha um dos seguintes comandos para rodar os testes:
    ```
    npm run test
    ```
    ou para obter dados da cobertura:

    ```
    npm run test:coverage
    ```



# Tecnologias utilizadas

- **Node.js**: Este projeto foi desenvolvido utilizando Node.js, por conta de sua simplicidade. A linguagem base, JavaScript, atendeu todas as necessidades previstas do projeto.
- **Docker**: Utilizado para garantir maior flexibilidade e eficiência, facilitando a execução do projeto em qualquer máquina.
- **Jest**: Utilizado durante o desenvolvimento, é uma simples framework de testes, que permitiu a execução de testes, auxiliando na correção e confiabilidade do código. 

# Arquitetura e organização

Este projeto é composto apenas pelo arquivo *index.js*, que fica responsável por ler os dados de input e formatar o JSON, e outros 4 arquivos contidos no diretório *src*:

- **index.js**: Como mencionado, este arquivo utiliza a lib "*readlin*e" (única no projeto todo) para auxiliar na leitura das linhas digitas no terminal (entrada padrão stdin). Para cada linha digitada, converte para JSON e salva em listas, para iniciar o processo posteriormente.
- **src/utils/round.js**: Arquivo auxiliar para arrendondar valores em 2 casas decimais.
- **src/operations.js**:  Arquivo auxiliar que mapeia os tipos aceitos de operações (*sell* e *buy*). 
- **src/taxes.js**: O processo inicia por esse arquivo, com auxílio de dois loops, ele itera pelas listas, e nos objetos de cada lista, chama a função que registra a operação e retorna o imposto calculado. Para cada lista, é printado na tela os impostos retornados.
- **src/stocks.js**: É o principal arquivo do projeto, se trata da classe "Stocks" (ações) que controla as operações de ações e realiza todos os cálculos necessários. Para cara lista de operações, é instanciado um novo objeto Stocks. Ficam salvos nesse objeto as seguintes informações: 
  - quantidade de ações atuais (*quantity*)
  - média ponderada atual (*average*)
  - prejuízo atual (*loss*)
  - o lucro atual (*profit*)
  - o imposto atual (*tax*)
  - a operação atual (*currentOperation*) 
  - as operações disponíveis (*operations*, através do objeto definido em *src/operations.js*)

# Resumo das regras do ganho de capital

- Operações de compra não geram imposto. 
- Impostos devem ser pagos quando o valor total da operação (custo unitário da ação x quantidade) for menor ou igual a R$ 20.000,00.
- O percentual de imposto pago é de 20% sobre o lucro obtido na operação. Ou seja, o imposto vai ser pago quando há uma operação de venda cujo preço é superior ao **preço médio ponderado** de compra (fórmula para calculo mais abaixo).
- Prejuízos acontecem quando as ações são vendidas a um valor menor do que o preço médio ponderado de compra, e ele será deduzido dos lucros seguintes. Neste caso, não há imposto. 


**Cálculo da média ponderada**:

```
nova-media-ponderada = ((quantidade-de-acoes-atual * media-ponderada-atual) + (quantidade-de-acoes * valor-de-compra)) / (quantidade-de-acoes-atual + quantidade-de-acoes-compradas) 
``` 