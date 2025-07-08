import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

export default {
  data: new SlashCommandBuilder()
    .setName('atualizarstatus')
    .setDescription('Atualiza qualquer atributo de um personagem seu')
    .addStringOption(opt =>
      opt.setName('nome').setDescription('Nome do personagem').setRequired(true))
    .addStringOption(opt =>
      opt.setName('atributo')
        .setDescription('Atributo a ser atualizado (hp_total, hp_atual, mana, armadura, etc)')
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('valor').setDescription('Novo valor do atributo').setRequired(true)),

  async execute(interaction: any) {
    const userId = interaction.user.id;
    const nome = interaction.options.getString('nome');
    const atributo = interaction.options.getString('atributo')!;
    const valor = interaction.options.getInteger('valor')!;
    const path = './src/data/personagens.json';

    if (!fs.existsSync(path)) {
      return interaction.reply('❌ Nenhum personagem salvo ainda.');
    }

    const data = JSON.parse(fs.readFileSync(path, 'utf-8'));

    if (!data[userId]?.[nome]) {
      return interaction.reply(`❌ Personagem **${nome}** não encontrado.`);
    }

    data[userId][nome][atributo] = valor;

    fs.writeFileSync(path, JSON.stringify(data, null, 2));

    return interaction.reply(`✅ **${atributo}** de **${nome}** atualizado para **${valor}**.`);
  }
};