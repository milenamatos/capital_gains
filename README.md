# Capital Gains


## Passo 1: Fazer o build da aplicação

```
docker build . -t capital-gains
```

## Passo 2: Executar

É possível executar a aplicação de duas formas: 

- Passando um arquivo *.txt* que contém as listas de operações:

```
docker run -i capital-gains < input.txt
```

- Digitar os inputs no terminal:

```
docker run -i capital-gains
<lista_de_operacoes>
```


Em ambos os casos sempre deve ser passado uma lista por linha. Existe um arquivo **input.txt** no projeto, contendo 2 listas, disponível para testes.

