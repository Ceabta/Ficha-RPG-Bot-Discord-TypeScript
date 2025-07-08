
# 🤖 Ficha RPG - Discord Bot

Um bot de Discord feito em TypeScript para gerenciar fichas de personagem de RPG diretamente no servidor! Ideal para campanhas online ou play-by-chat.

## ✨ Funcionalidades

- 📋 Adicionar personagens com atributos básicos (HP, Mana, Sanidade, Armadura, Situação)
- 📌 Visualizar todos os personagens cadastrados por usuário
- ♻️ Atualizar qualquer atributo do personagem (ex: HP, Mana)
- 🗑️ Deletar personagens com confirmação em 2 etapas
- 📖 Paginação automática ao listar muitos personagens
- 💾 Armazenamento local via arquivo JSON

---

## 🚀 Como usar

### ✅ Pré-requisitos

- Node.js 18+
- TypeScript
- Discord bot registrado com intents corretas


1. Instale as dependências:
   ```bash
   npm install
   ```

2. Copie o arquivo `.env.example` e renomeie para `.env`, preenchendo com suas credenciais.

3. Copie o arquivo `src/data/personagens.example.json` e renomeie para `personagens.json`:
   ```bash
   cp src/data/personagens.example.json src/data/personagens.json
   ```
   > Esse arquivo é onde os dados dos personagens são salvos. Ele **não será enviado ao GitHub**.

4. Execute o bot:
   ```bash
   npx ts-node src/index.ts
   ```

---

## 🔧 Comandos disponíveis

| Comando               | Descrição                                                |
|-----------------------|----------------------------------------------------------|
| `/addpersonagem`      | Adiciona um novo personagem                              |
| `/listarpersonagens`  | Lista os personagens do usuário com paginação            |
| `/verpersonagem`      | Mostra os detalhes de um personagem específico           |
| `/atualizar`          | Atualiza um ou mais atributos de um personagem           |
| `/deletarpersonagem`  | Remove um personagem com confirmação por botão           |
| `/ping`               | Verifica se o bot está online                            |

---

## 🧱 Estrutura do Projeto

```
src/
├── commands/           # Comandos slash separados por arquivo
│   ├── addpersonagem.ts
│   ├── atualizar.ts
│   ├── deletarpersonagem.ts
│   ├── listarpersonagens.ts
│   └── verpersonagem.ts
├── data/
│   └── personagens.json  # Armazena os personagens por usuário
├── deploy-commands.ts  # Script para registrar os comandos
├── emojis.ts           # Emojis usados no embed
└── index.ts            # Arquivo principal do bot
```

---

## 💾 Exemplo de estrutura JSON

```json
{
  "123456789012345678": {
    "Arthas": {
      "hp_total": 100,
      "hp_atual": 80,
      "mana": 50,
      "sanidade": 90,
      "armadura": 15,
      "situacao": "Vivo"
    }
  }
}
```

---

## 📷 Exemplo de visualização no Discord

![image](https://github.com/user-attachments/assets/967a63a4-6f02-4e87-9e3f-283d452f8247)


---

## 📦 Instalação local

```bash
git clone https://github.com/seuusuario/ficha-rpg-discord-bot
cd ficha-rpg-discord-bot
npm install
```

Edite o arquivo `.env` com seu token e ID de cliente:

```env
DISCORD_TOKEN=seu_token_aqui
CLIENT_ID=seu_id_de_aplicacao
```

---

## 🚀 Executando

```bash
npx ts-node src/deploy-commands.ts  # Registrar comandos
npx ts-node src/index.ts            # Rodar o bot
```

---

## 🛡️ Licença

MIT © 2025 Leonardo Cesário
