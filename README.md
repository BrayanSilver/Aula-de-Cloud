# Sistema de Estoque

Este projeto é uma aplicação web simples para gerenciamento de estoques, incluindo funcionalidades como login, cadastro de produtos e navegação no sistema.

---

## Estrutura dos Arquivos

- **`index.html`**: Página inicial do sistema. Apresenta um painel de boas-vindas e informações gerais sobre o sistema, além de um carrossel de imagens ilustrativas.
- **`cadastro.html`**: Página destinada ao cadastro de produtos. Inclui um formulário para inserir informações como cliente, obra, valor estimado e outras.
- **`login.html`**: Página de login e registro. Permite que os usuários façam login no sistema ou criem uma nova conta.

---

## Funcionalidades

1. **Login e Registro de Usuários**
   - Página de login para autenticação dos usuários.
   - Opção de criação de novas contas.
   - Validação de credenciais com envio para um servidor backend.

2. **Gerenciamento de Produtos**
   - Cadastro de produtos com informações detalhadas.
   - Integração com uma API backend para envio de dados via requisições `POST`.

3. **Interface Dinâmica**
   - Menu lateral interativo para navegação entre páginas.
   - Carrossel de imagens na página inicial para apresentação visual.

---

## Tecnologias Utilizadas

- **HTML5**: Estrutura e marcação.
- **CSS3**: Estilização.
- **JavaScript**: Interatividade e integração com o backend.
- **Google Fonts**: Fontes personalizadas.
- **Boxicons**: Ícones para a interface.
- **Node.js**: Ambiente de execução para o backend.
- **Express.js**: Framework para criação de rotas e APIs no backend.
- **CORS**: Middleware para permitir o compartilhamento de recursos entre diferentes origens.

---

## Requisitos do Sistema

Antes de iniciar, certifique-se de que você tem:

- **Node.js** e **npm** instalados.
- Acesso à internet para baixar dependências e conectar ao backend.
- **Servidor Backend** configurado para lidar com os endpoints necessários.

---

## Passo a Passo para Rodar o Projeto

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd <nome-da-pasta>
2. Configurar as Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto e configure as variáveis necessárias, como o exemplo abaixo


PORT=3000
DATABASE_URL=seu_banco_de_dados
JWT_SECRET=uma_chave_secreta
PORT: Porta na qual o servidor backend será executado.
DATABASE_URL: URL para conexão com o banco de dados (se aplicável).
JWT_SECRET: Chave secreta para autenticação JWT.
3. Instalar Dependências

npm install


4. Executar o Servidor
Navegue até a pasta do backend (se aplicável) e execute o servidor:

cd src
node server.js


5. Acessar o Projeto
Abra o navegador e acesse:


http://localhost:<PORT>
Substitua <PORT> pela porta configurada na variável de ambiente.

Configuração e Conexão com a Instância EC2 na AWS

1. Configurando a Instância EC2

Acesse o console do EC2 na AWS.
Navegue até Instâncias e clique em Executar instâncias.
Preencha as configurações da seguinte forma:
Imagem do Servidor: Escolha Ubuntu Server (recomendado: versão LTS mais recente).
Tipo de Instância: Selecione o tipo adequado às suas necessidades (ex.: t2.micro para fins gratuitos).
Par de Chaves:
Crie um novo par de chaves.
Mantenha as configurações padrão.
Baixe o arquivo .pem gerado e salve-o (ex.: dentro da pasta app no seu projeto).
Configuração de Firewall: Crie um grupo de segurança que permita as portas 22 (SSH) e 3000 (ou a porta da sua aplicação).


2. Transferindo os Arquivos para o EC2
Use o SCP para enviar os arquivos para o servidor:


scp -i caminho/para/sua-chave.pem -r ./app ubuntu@<ENDEREÇO_IP_DA_INSTÂNCIA>:/home/ubuntu
Substitua caminho/para/sua-chave.pem pelo caminho da sua chave.
Substitua <ENDEREÇO_IP_DA_INSTÂNCIA> pelo endereço público da instância.


3. Conectando-se ao Servidor via SSH
Conecte-se à instância EC2:



ssh -i caminho/para/sua-chave.pem ubuntu@<ENDEREÇO_IP_DA_INSTÂNCIA>


4. Configurando o Ambiente na Instância EC2
Após conectar, atualize o sistema e instale as dependências necessárias:


sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm
Verifique se as versões foram instaladas corretamente:


node -v
npm -v


5. Configurando e Executando o Projeto no EC2
Navegue até a pasta enviada:


cd /home/ubuntu/app
Instale as dependências:


npm install
Execute o servidor:


cd src
node server.js


Certifique-se de que as portas necessárias estão abertas no grupo de segurança para acessar sua aplicação.

Próximos Passos

Implementar um backend funcional para gerenciar autenticação e armazenamento de dados.
Melhorar o design para dispositivos móveis (responsividade).
Adicionar testes para validar as interações e garantir a qualidade do sistema.
Observação: Caso enfrente problemas:

Verifique as configurações do grupo de segurança (firewall) no EC2.
Certifique-se de que a chave .pem tem as permissões corretas:

chmod 400 chave.pem

Confirme o IP público da instância e substitua nos comandos.

Autor: [Brayan R. Silveira, Emanuelly Luna, Murilo Silveira, Gustavo Cebula, Kauan, Patrick ]

