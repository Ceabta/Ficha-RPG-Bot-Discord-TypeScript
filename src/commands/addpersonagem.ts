import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

export default {
  data: new SlashCommandBuilder()
    .setName('addpersonagem')
    .setDescription('Adiciona um personagem com status básicos')
    .addStringOption(opt =>
      opt.setName('nome').setDescription('Nome do personagem').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('hp_total').setDescription('Vida Total').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('hp_atual').setDescription('Vida Atual').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('armadura').setDescription('Armadura (CA/Defesa)').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('mana').setDescription('Mana').setRequired(false))
    .addIntegerOption(opt =>
        opt.setName('sanidade').setDescription('Sanidade').setRequired(false)),
  
  async execute(interaction: any) {
    const nome = interaction.options.getString('nome');
    const hp_total = interaction.options.getInteger('hp_total');
    const hp_atual = interaction.options.getInteger('hp_atual');
    const mana = interaction.options.getInteger('mana') || 0; // 0 como padrão se não for fornecido
    const sanidade = interaction.options.getInteger('sanidade') || 100; // 100 como padrão se não for fornecido
    const armadura = interaction.options.getInteger('armadura');
    const situacao = 'Vivo';
    const userId = interaction.user.id;

    // Carregar arquivo existente (ou criar novo)
    const path = './src/data/personagens.json';
    let data = {};
    if (fs.existsSync(path)) {
      const raw = fs.readFileSync(path, 'utf-8');
      data = JSON.parse(raw);
    }

    // Salvar personagem
    if (!(data as any)[userId]) {
      (data as any)[userId] = {};
    } else {
      // Verificar se o nome já existe (case sensitive)
      const nomesExistentes = Object.keys((data as any)[userId] || {});
      const nomeJaExiste = nomesExistentes.some(n => n.toLowerCase() === nome.toLowerCase());
      if (nomeJaExiste) {
        return interaction.reply(`❌ Já existe um personagem chamado **${nome}** (mesmo nome, ignorando maiúsculas/minúsculas).`);
      }
    }

    (data as any)[userId][nome] = { hp_total, hp_atual, mana, sanidade, armadura, situacao };


    fs.writeFileSync(path, JSON.stringify(data, null, 2));

    await interaction.reply(`✅ Personagem **${nome}** adicionado com sucesso!`);
  }
}